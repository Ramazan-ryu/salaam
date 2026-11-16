import {
  Body,
  Controller,
  Get,
  Inject,
  Injectable,
  Module,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { localizedTextSchema, organizerSubmissionSchema, type OrganizerSubmission } from '@salaam/domain';
import { and, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { CurrentActor, Roles, type Actor } from '../../common/auth';
import { ProblemError } from '../../common/problem.filter';
import { stableHash } from '../../common/text';
import { DB, type Db } from '../../db/client';
import { organizerMembers, organizers, reviewTasks, sourceItems } from '../../db/schema';
import { AuditService } from '../audit/audit.service';
import { SourcesModule, SourcesService } from '../sources/sources.module';

const createOrganizerSchema = z.object({
  name: localizedTextSchema,
  website: z.string().url().optional(),
  instagramHandle: z.string().max(60).optional(),
  memberUserIds: z.array(z.string().min(1).max(120)).max(10).default([]),
});

/** Priority: events starting within 72 h first (docs/CONTENT_OPERATIONS.md §3). */
function priorityFor(submission: OrganizerSubmission, now = new Date()): number {
  const first = submission.occurrences.map((o) => o.date).sort()[0]!;
  const hours = (new Date(`${first}T00:00:00+04:00`).getTime() - now.getTime()) / 3600_000;
  return hours <= 72 ? 20 : 50;
}

@Injectable()
export class OrganizerService {
  constructor(
    @Inject(DB) private readonly db: Db,
    private readonly sourcesService: SourcesService,
    private readonly audit: AuditService,
  ) {}

  async createOrganizer(input: z.infer<typeof createOrganizerSchema>, actor: Actor) {
    return this.db.transaction(async (tx) => {
      const [org] = await tx
        .insert(organizers)
        .values({ name: input.name, website: input.website ?? null, instagramHandle: input.instagramHandle ?? null, verified: true })
        .returning();
      if (input.memberUserIds.length) {
        await tx.insert(organizerMembers).values(input.memberUserIds.map((userId) => ({ organizerId: org!.id, userId, role: 'owner' })));
      }
      await this.audit.record(actor, 'organizer.create', 'organizer', org!.id, { after: { org, members: input.memberUserIds } }, tx);
      return org!;
    });
  }

  private async assertMember(orgId: string, actor: Actor) {
    const [org] = await this.db.select().from(organizers).where(eq(organizers.id, orgId));
    if (!org) throw new ProblemError(404, 'ORGANIZER_NOT_FOUND', 'Organizer not found');
    if (actor.role === 'admin' || actor.role === 'curator') return org;
    const [m] = await this.db
      .select()
      .from(organizerMembers)
      .where(and(eq(organizerMembers.organizerId, orgId), eq(organizerMembers.userId, actor.id)));
    if (!m) throw new ProblemError(403, 'NOT_ORGANIZER_MEMBER', 'You are not a member of this organizer');
    return org;
  }

  /** A submission becomes a source item + review task. It is never published automatically. */
  async submit(orgId: string, body: unknown, actor: Actor) {
    await this.assertMember(orgId, actor);
    const submission = organizerSubmissionSchema.parse(body);
    const source = await this.sourcesService.getByCode('DS-002');
    this.sourcesService.assertApproved(source);

    const payload = { organizerId: orgId, submission };
    const contentHash = stableHash(payload);
    const route = this.sourcesService.route(source); // always 'review' through MVP-1 (D-25)

    return this.db.transaction(async (tx) => {
      const [existing] = await tx
        .select({ id: sourceItems.id })
        .from(sourceItems)
        .where(and(eq(sourceItems.sourceId, source.id), eq(sourceItems.contentHash, contentHash)));
      if (existing) throw new ProblemError(409, 'DUPLICATE_SUBMISSION', 'This exact submission was already received');

      const [item] = await tx
        .insert(sourceItems)
        .values({
          sourceId: source.id,
          payload,
          contentHash,
          submittedBy: actor.id,
          purgeAfter: new Date(Date.now() + source.retentionDays * 86400_000),
        })
        .returning();
      const title = submission.title.az ?? submission.title.ru ?? submission.title.en ?? '';
      const [task] = await tx
        .insert(reviewTasks)
        .values({
          type: 'new_item',
          sourceItemId: item!.id,
          summary: `Organizer submission: ${title}`.slice(0, 200),
          priority: priorityFor(submission),
        })
        .returning();
      await this.audit.record(actor, 'submission.create', 'source_item', item!.id, { after: { taskId: task!.id, route } }, tx);
      return { submissionId: item!.id, reviewTaskId: task!.id, status: 'pending_review' as const };
    });
  }

  async listSubmissions(orgId: string, actor: Actor) {
    await this.assertMember(orgId, actor);
    const rows = await this.db
      .select({
        id: sourceItems.id,
        payload: sourceItems.payload,
        collectedAt: sourceItems.collectedAt,
        taskStatus: reviewTasks.status,
        eventId: reviewTasks.eventId,
      })
      .from(sourceItems)
      .leftJoin(reviewTasks, eq(reviewTasks.sourceItemId, sourceItems.id))
      .where(sql`${sourceItems.payload} ->> 'organizerId' = ${orgId}`)
      .orderBy(desc(sourceItems.collectedAt))
      .limit(100);
    return rows.map((r) => ({
        id: r.id,
        title: ((r.payload as { submission?: OrganizerSubmission }).submission?.title) ?? null,
        receivedAt: r.collectedAt,
        status: r.taskStatus === 'open' ? 'pending_review' : r.eventId ? 'published' : 'rejected',
        eventId: r.eventId,
      }));
  }
}

@Controller('v1')
export class OrganizerController {
  constructor(private readonly organizer: OrganizerService) {}

  @Roles('curator')
  @Post('admin/organizers')
  create(@Body() body: unknown, @CurrentActor() actor: Actor) {
    return this.organizer.createOrganizer(createOrganizerSchema.parse(body), actor);
  }

  @Roles('organizer', 'curator')
  @Post('organizer/:orgId/submissions')
  submit(@Param('orgId', ParseUUIDPipe) orgId: string, @Body() body: unknown, @CurrentActor() actor: Actor) {
    return this.organizer.submit(orgId, body, actor);
  }

  @Roles('organizer', 'curator')
  @Get('organizer/:orgId/submissions')
  list(@Param('orgId', ParseUUIDPipe) orgId: string, @CurrentActor() actor: Actor) {
    return this.organizer.listSubmissions(orgId, actor);
  }
}

@Module({
  imports: [SourcesModule],
  providers: [OrganizerService],
  controllers: [OrganizerController],
})
export class OrganizerModule {}
