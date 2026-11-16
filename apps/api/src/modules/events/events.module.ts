import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Module,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  AVAILABILITY,
  LIFECYCLE_STATUSES,
  localizedTextSchema,
  occurrenceInputSchema,
  organizerSubmissionSchema,
  VERIFICATION_STATUSES,
} from '@salaam/domain';
import { desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { CurrentActor, Public, Roles, type Actor } from '../../common/auth';
import { ProblemError } from '../../common/problem.filter';
import { parseAcceptLanguage } from '../../common/text';
import { DB, type Db } from '../../db/client';
import { events, fieldProvenance, occurrences, places } from '../../db/schema';
import { AuditService } from '../audit/audit.service';
import { CatalogModule } from '../catalog/catalog.module';
import { SourcesModule, SourcesService } from '../sources/sources.module';
import { DiscoverService } from './discover.service';
import { PublicationService } from './publication.service';

export const discoverSchema = z.object({
  lens: z.enum(['now', 'tonight', 'weekend', 'date']).default('tonight'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  category: z.string().max(60).optional(),
  district: z.string().max(60).optional(),
  radiusKm: z.coerce.number().min(0.5).max(50).default(5),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

/** Curator manual entry (DS-001): facts verified from an official source link. */
export const manualEventSchema = z.object({
  placeId: z.string().uuid(),
  organizerId: z.string().uuid().optional(),
  title: localizedTextSchema,
  description: localizedTextSchema.optional(),
  occurrences: z.array(occurrenceInputSchema).min(1).max(50),
  categorySlugs: z.array(z.string()).max(5).default([]),
  ticketUrl: z.string().url().optional(),
  price: organizerSubmissionSchema.shape.price,
  eventLanguage: organizerSubmissionSchema.shape.eventLanguage,
  sourceUrl: z.string().url(),
  trustTier: z.enum(['T1_official', 'T3_organizer_submitted', 'T4_community_submitted']).default('T1_official'),
});

export const lifecycleSchema = z.object({
  lifecycleStatus: z.enum(LIFECYCLE_STATUSES),
  availability: z.enum(AVAILABILITY).optional(),
  reason: z.string().min(3).max(500),
  evidenceUrl: z.string().url().optional(),
});

@Controller('v1')
export class PublicEventsController {
  constructor(private readonly discover: DiscoverService) {}

  @Public()
  @Get('discover')
  find(
    @Query() query: Record<string, string>,
    @Headers('accept-language') acceptLanguage: string | undefined,
    @Headers('x-approx-area') approxArea: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const q = discoverSchema.parse(query);
    // Location-dependent answers must never be stored by shared caches (docs/API_SPECIFICATION.md).
    res.setHeader('Cache-Control', approxArea ? 'private, no-store' : 'public, max-age=60');
    res.setHeader('Vary', 'Accept-Language, X-Approx-Area');
    if (q.lens === 'date' && !q.date) throw new ProblemError(400, 'DATE_REQUIRED', 'date is required for lens=date');
    return this.discover.discover({ ...q, approxArea: approxArea || undefined, locale: parseAcceptLanguage(acceptLanguage) });
  }

  @Public()
  @Get('occurrences/:id')
  occurrence(@Param('id', ParseUUIDPipe) id: string, @Headers('accept-language') acceptLanguage?: string) {
    return this.discover.occurrence(id, parseAcceptLanguage(acceptLanguage));
  }
}

@Controller('v1/admin')
export class AdminEventsController {
  constructor(
    @Inject(DB) private readonly db: Db,
    private readonly publication: PublicationService,
    private readonly sourcesService: SourcesService,
    private readonly audit: AuditService,
  ) {}

  @Roles('curator')
  @Get('events')
  async list(@Query('status') status?: string) {
    const st = status ? z.enum(VERIFICATION_STATUSES).parse(status) : undefined;
    return this.db
      .select({
        id: events.id,
        title: events.title,
        verificationStatus: events.verificationStatus,
        lifecycleStatus: events.lifecycleStatus,
        trustTier: events.trustTier,
        lastVerifiedAt: events.lastVerifiedAt,
        nextStart: sql<string | null>`(SELECT min(o.starts_at) FROM occurrences o WHERE o.event_id = ${events.id} AND o.starts_at > now())`,
      })
      .from(events)
      .where(st ? eq(events.verificationStatus, st) : undefined)
      .orderBy(desc(events.createdAt))
      .limit(100);
  }

  @Roles('curator')
  @Post('events')
  async createManual(@Body() body: unknown, @CurrentActor() actor: Actor) {
    const input = manualEventSchema.parse(body);
    const source = await this.sourcesService.getByCode('DS-001');
    this.sourcesService.assertApproved(source);
    const [place] = await this.db.select().from(places).where(eq(places.id, input.placeId));
    if (!place) throw new ProblemError(404, 'PLACE_NOT_FOUND', 'Place not found');
    return this.db.transaction((tx) =>
      this.publication.publishHumanVerified(
        { ...input, cityId: place.cityId, sourceId: source.id, sourceUrl: input.sourceUrl },
        actor,
        tx,
      ),
    );
  }

  /** Lifecycle/availability changes are human-only (never set by the pipeline). */
  @Roles('curator')
  @Patch('occurrences/:id/lifecycle')
  async setLifecycle(@Param('id', ParseUUIDPipe) id: string, @Body() body: unknown, @CurrentActor() actor: Actor) {
    const input = lifecycleSchema.parse(body);
    return this.db.transaction(async (tx) => {
      const [before] = await tx.select().from(occurrences).where(eq(occurrences.id, id));
      if (!before) throw new ProblemError(404, 'OCCURRENCE_NOT_FOUND', 'Not found');
      const [after] = await tx
        .update(occurrences)
        .set({
          lifecycleStatus: input.lifecycleStatus,
          ...(input.availability ? { availability: input.availability } : {}),
          updatedAt: new Date(),
        })
        .where(eq(occurrences.id, id))
        .returning();
      await tx.update(events).set({ lastVerifiedAt: new Date(), updatedAt: new Date() }).where(eq(events.id, before.eventId));
      await tx.insert(fieldProvenance).values({
        entityType: 'occurrence',
        entityId: id,
        field: 'lifecycle',
        method: 'human',
        evidence: [input.reason, input.evidenceUrl].filter(Boolean).join(' | ').slice(0, 500),
        verified: true,
        verifiedBy: actor.id,
        verifiedAt: new Date(),
      });
      await this.audit.record(actor, 'occurrence.lifecycle', 'occurrence', id, { before, after }, tx);
      return after!;
    });
  }
}

@Module({
  imports: [SourcesModule, CatalogModule],
  providers: [PublicationService, DiscoverService],
  controllers: [PublicEventsController, AdminEventsController],
  exports: [PublicationService],
})
export class EventsModule {}
