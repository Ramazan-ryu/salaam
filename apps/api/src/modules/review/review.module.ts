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
  Query,
} from '@nestjs/common';
import { localizedTextSchema, organizerSubmissionSchema } from '@salaam/domain';
import { and, asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { CurrentActor, Roles, type Actor } from '../../common/auth';
import { ProblemError } from '../../common/problem.filter';
import { DB, type Db } from '../../db/client';
import { places, reviewDecisions, reviewTasks, sourceItems, sources } from '../../db/schema';
import { AuditService } from '../audit/audit.service';
import { CatalogModule, CatalogService, newPlaceSchema } from '../catalog/catalog.module';
import { EventsModule } from '../events/events.module';
import { PublicationService } from '../events/publication.service';

const REJECT_REASONS = ['not_permitted', 'insufficient_info', 'duplicate', 'out_of_scope', 'spam', 'other'] as const;

const decisionSchema = z.discriminatedUnion('decision', [
  z.object({
    decision: z.literal('approve'),
    placeId: z.string().uuid().optional(),
    newPlace: newPlaceSchema.optional(),
    categorySlugs: z.array(z.string()).max(5).optional(),
    titleOverride: localizedTextSchema.optional(),
    note: z.string().max(1000).optional(),
  }),
  z.object({
    decision: z.literal('reject'),
    reasonCode: z.enum(REJECT_REASONS),
    note: z.string().max(1000).optional(),
  }),
]);

@Injectable()
export class ReviewService {
  constructor(
    @Inject(DB) private readonly db: Db,
    private readonly publication: PublicationService,
    private readonly catalog: CatalogService,
    private readonly audit: AuditService,
  ) {}

  list(status: 'open' | 'done' | 'skipped' = 'open') {
    return this.db
      .select({
        id: reviewTasks.id,
        type: reviewTasks.type,
        status: reviewTasks.status,
        priority: reviewTasks.priority,
        summary: reviewTasks.summary,
        openedAt: reviewTasks.openedAt,
        sourceCode: sources.code,
      })
      .from(reviewTasks)
      .leftJoin(sourceItems, eq(sourceItems.id, reviewTasks.sourceItemId))
      .leftJoin(sources, eq(sources.id, sourceItems.sourceId))
      .where(eq(reviewTasks.status, status))
      .orderBy(asc(reviewTasks.priority), asc(reviewTasks.openedAt))
      .limit(200);
  }

  async get(id: string) {
    const [row] = await this.db
      .select({ task: reviewTasks, item: sourceItems, source: sources })
      .from(reviewTasks)
      .leftJoin(sourceItems, eq(sourceItems.id, reviewTasks.sourceItemId))
      .leftJoin(sources, eq(sources.id, sourceItems.sourceId))
      .where(eq(reviewTasks.id, id));
    if (!row) throw new ProblemError(404, 'TASK_NOT_FOUND', 'Review task not found');
    return {
      task: row.task,
      source: row.source ? { code: row.source.code, name: row.source.name, trustTier: row.source.defaultTrustTier } : null,
      evidence: row.item ? { payload: row.item.payload, url: row.item.url, rawText: row.item.rawText, collectedAt: row.item.collectedAt } : null,
    };
  }

  async decide(id: string, body: unknown, actor: Actor) {
    const input = decisionSchema.parse(body);
    return this.db.transaction(async (tx) => {
      const [row] = await tx
        .select({ task: reviewTasks, item: sourceItems, source: sources })
        .from(reviewTasks)
        .leftJoin(sourceItems, eq(sourceItems.id, reviewTasks.sourceItemId))
        .leftJoin(sources, eq(sources.id, sourceItems.sourceId))
        .where(and(eq(reviewTasks.id, id)))
        .for('update', { of: reviewTasks });
      if (!row) throw new ProblemError(404, 'TASK_NOT_FOUND', 'Review task not found');
      if (row.task.status !== 'open') throw new ProblemError(409, 'TASK_CLOSED', 'This task was already decided');

      const now = new Date();
      const closeTask = async (eventId: string | null) => {
        await tx
          .update(reviewTasks)
          .set({
            status: 'done',
            closedAt: now,
            eventId,
            handlingSeconds: Math.round((now.getTime() - row.task.openedAt.getTime()) / 1000),
          })
          .where(eq(reviewTasks.id, id));
      };

      if (input.decision === 'reject') {
        await closeTask(null);
        await tx.insert(reviewDecisions).values({
          taskId: id,
          decision: 'reject',
          reasonCode: input.reasonCode,
          note: input.note ?? null,
          decidedBy: actor.id,
        });
        await this.audit.record(actor, 'review.reject', 'review_task', id, { after: input }, tx);
        return { taskId: id, decision: 'reject' as const };
      }

      if (row.task.type !== 'new_item' || !row.item || !row.source) {
        throw new ProblemError(422, 'UNSUPPORTED_TASK', 'Only new_item tasks with a source item can be approved here');
      }
      if (row.source.status !== 'approved') {
        throw new ProblemError(409, 'SOURCE_NOT_APPROVED', `Source ${row.source.code} is not approved`);
      }
      if (!input.placeId && !input.newPlace) {
        throw new ProblemError(400, 'PLACE_REQUIRED', 'Resolve the place: give placeId or newPlace');
      }

      const payload = row.item.payload as { organizerId?: string; submission?: unknown };
      const submission = organizerSubmissionSchema.parse(payload.submission);

      let placeId = input.placeId;
      let cityId: string;
      if (input.newPlace) {
        const place = await this.catalog.createPlace(input.newPlace, actor, tx);
        placeId = place.id;
        cityId = place.cityId;
      } else {
        const [place] = await tx.select().from(places).where(eq(places.id, placeId!));
        if (!place) throw new ProblemError(404, 'PLACE_NOT_FOUND', 'Place not found');
        cityId = place.cityId;
      }

      const { event, occurrences } = await this.publication.publishHumanVerified(
        {
          cityId,
          placeId: placeId!,
          organizerId: payload.organizerId ?? null,
          title: input.titleOverride ?? submission.title,
          description: submission.description,
          occurrences: submission.occurrences,
          categorySlugs: input.categorySlugs ?? submission.categorySlugs,
          ticketUrl: submission.ticketUrl,
          price: submission.price,
          eventLanguage: submission.eventLanguage,
          trustTier: row.source.defaultTrustTier,
          sourceId: row.source.id,
          sourceItemId: row.item.id,
          sourceUrl: submission.ticketUrl ?? null,
        },
        actor,
        tx,
      );

      await closeTask(event.id);
      await tx.insert(reviewDecisions).values({
        taskId: id,
        decision: input.titleOverride ? 'edit' : 'approve',
        note: input.note ?? null,
        diff: input.titleOverride ? { title: { from: submission.title, to: input.titleOverride } } : null,
        decidedBy: actor.id,
      });
      await this.audit.record(actor, 'review.approve', 'review_task', id, { after: { eventId: event.id } }, tx);
      return { taskId: id, decision: 'approve' as const, eventId: event.id, occurrenceIds: occurrences.map((o) => o.id) };
    });
  }
}

@Controller('v1/admin/review-tasks')
export class ReviewController {
  constructor(private readonly review: ReviewService) {}

  @Roles('curator')
  @Get()
  list(@Query('status') status?: string) {
    return this.review.list(z.enum(['open', 'done', 'skipped']).default('open').parse(status));
  }

  @Roles('curator')
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.review.get(id);
  }

  @Roles('curator')
  @Post(':id/decision')
  decide(@Param('id', ParseUUIDPipe) id: string, @Body() body: unknown, @CurrentActor() actor: Actor) {
    return this.review.decide(id, body, actor);
  }
}

@Module({
  imports: [EventsModule, CatalogModule],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
