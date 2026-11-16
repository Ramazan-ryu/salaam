import { Inject, Injectable } from '@nestjs/common';
import type { LocalizedText, OrganizerSubmission, TrustTier } from '@salaam/domain';
import { inArray } from 'drizzle-orm';
import type { Actor } from '../../common/auth';
import { ProblemError } from '../../common/problem.filter';
import { firstLocale, normalizeLocalized } from '../../common/text';
import { addDays, localToUtc } from '../../common/time';
import { DB, type Db } from '../../db/client';
import { categories, eventCategories, events, fieldProvenance, occurrences } from '../../db/schema';
import { AuditService } from '../audit/audit.service';

type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

export interface PublishInput {
  cityId: string;
  placeId: string;
  organizerId?: string | null;
  title: LocalizedText;
  description?: LocalizedText;
  occurrences: OrganizerSubmission['occurrences'];
  categorySlugs: string[];
  ticketUrl?: string;
  price?: OrganizerSubmission['price'];
  eventLanguage?: string;
  trustTier: TrustTier;
  sourceId: string;
  sourceItemId?: string | null;
  sourceUrl?: string | null;
}

/**
 * Writes a human-verified event. This is the ONLY code path that publishes content in MVP-1:
 * every caller is a human decision (review approval or curator manual entry) — D-25.
 */
@Injectable()
export class PublicationService {
  constructor(
    @Inject(DB) private readonly db: Db,
    private readonly audit: AuditService,
  ) {}

  async publishHumanVerified(input: PublishInput, actor: Actor, tx: Tx) {
    const now = new Date();
    const cats = input.categorySlugs.length
      ? await tx.select().from(categories).where(inArray(categories.slug, input.categorySlugs))
      : [];
    if (cats.length !== new Set(input.categorySlugs).size) {
      throw new ProblemError(400, 'UNKNOWN_CATEGORY', 'One or more category slugs are unknown');
    }

    const price = input.price;
    const [event] = await tx
      .insert(events)
      .values({
        cityId: input.cityId,
        organizerId: input.organizerId ?? null,
        primaryPlaceId: input.placeId,
        title: input.title,
        description: input.description ?? null,
        originalLocale: firstLocale(input.title),
        titleNormalized: normalizeLocalized(input.title),
        ticketUrl: input.ticketUrl ?? null,
        // Price fields only when explicitly stated by the source (never inferred).
        isFree: price?.isFree ?? null,
        priceMin: price?.min !== undefined ? String(price.min) : null,
        priceMax: price?.max !== undefined ? String(price.max) : null,
        currency: price && (price.min !== undefined || price.max !== undefined) ? price.currency : null,
        eventLanguage: input.eventLanguage ?? null,
        trustTier: input.trustTier,
        verificationStatus: 'staff_verified',
        lifecycleStatus: 'scheduled',
        availability: 'unknown',
        sourceId: input.sourceId,
        sourceItemId: input.sourceItemId ?? null,
        sourceUrl: input.sourceUrl ?? null,
        lastVerifiedAt: now,
        publishedAt: now,
      })
      .returning();

    const occRows = input.occurrences.map((o) => {
      const startsAt = localToUtc(o.date, o.startTime ?? '00:00');
      let endsAt: Date | null = null;
      if (o.endTime && o.startTime) {
        endsAt = localToUtc(o.endTime > o.startTime ? o.date : addDays(o.date, 1), o.endTime);
      }
      return { eventId: event!.id, placeId: input.placeId, startsAt, endsAt, timeUnknown: !o.startTime };
    });
    const insertedOcc = await tx.insert(occurrences).values(occRows).returning();

    if (cats.length) {
      await tx.insert(eventCategories).values(cats.map((c) => ({ eventId: event!.id, categoryId: c.id })));
    }

    const verified = { method: 'human' as const, verified: true, verifiedBy: actor.id, verifiedAt: now };
    const prov = [
      { field: 'title', evidence: JSON.stringify(input.title) },
      { field: 'place', evidence: input.placeId },
      { field: 'occurrences', evidence: JSON.stringify(input.occurrences) },
      ...(input.ticketUrl ? [{ field: 'ticket_url', evidence: input.ticketUrl }] : []),
      ...(price ? [{ field: 'price', evidence: JSON.stringify(price) }] : []),
    ];
    await tx.insert(fieldProvenance).values(
      prov.map((p) => ({
        entityType: 'event',
        entityId: event!.id,
        field: p.field,
        evidence: p.evidence.slice(0, 500),
        sourceItemId: input.sourceItemId ?? null,
        ...verified,
      })),
    );

    await this.audit.record(actor, 'event.publish', 'event', event!.id, { after: { event, occurrences: insertedOcc } }, tx);
    return { event: event!, occurrences: insertedOcc };
  }
}
