/**
 * Response schemas of the SALAAM API. Public responses are `.strict()` so the contract test fails if a field
 * is added or leaked without updating the contract (docs/openapi.json).
 */
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { AVAILABILITY, LIFECYCLE_STATUSES, localizedTextSchema, PLACE_KINDS, TRUST_TIERS, VERIFICATION_STATUSES } from '@salaam/domain';
import { z } from 'zod';

extendZodWithOpenApi(z);

const isoDateTime = z.string().datetime({ offset: true }).openapi({ example: '2026-11-20T14:00:00.000Z' });
const uuid = z.string().uuid();

export const problemSchema = z
  .object({
    type: z.string(),
    title: z.string(),
    status: z.number().int(),
    detail: z.string(),
    code: z.string().openapi({ example: 'VALIDATION_FAILED' }),
    instance: z.string().optional(),
    errors: z.array(z.object({ path: z.string(), message: z.string() })).optional(),
  })
  .openapi('Problem', { description: 'RFC 9457 problem details (`application/problem+json`).' });

export const healthSchema = z.object({ status: z.literal('ok'), db: z.literal('ok') }).strict().openapi('Health');

export const trustSchema = z
  .object({
    tier: z.enum(TRUST_TIERS),
    verification: z.enum(VERIFICATION_STATUSES),
    lastVerifiedAt: isoDateTime.nullable(),
    badge: z.enum(['verified', 'from_organizer']),
    unconfirmedFields: z.array(z.string()).openapi({ description: 'Fields not confirmed by a human, e.g. start_time.' }),
  })
  .strict()
  .openapi('Trust');

export const occurrenceItemSchema = z
  .object({
    id: uuid.openapi({ description: 'Occurrence id (one date/time of an event).' }),
    startsAt: isoDateTime,
    endsAt: isoDateTime.nullable(),
    timeUnknown: z.boolean().openapi({ description: 'True when the source gave a date but no start time.' }),
    lifecycle: z.enum(LIFECYCLE_STATUSES),
    availability: z.enum(AVAILABILITY),
    event: z
      .object({
        id: uuid,
        title: z.string().nullable(),
        description: z.string().nullable(),
        locale: z.string().nullable().openapi({ description: 'Language of the returned title.' }),
        translated: z.boolean(),
        categories: z.array(z.string()),
        ticketUrl: z.string().url().nullable(),
        price: z
          .object({
            isFree: z.boolean().nullable(),
            min: z.number().nullable(),
            max: z.number().nullable(),
            currency: z.string().nullable(),
          })
          .strict()
          .optional()
          .openapi({ description: 'Present only when the source stated a price. Never inferred.' }),
      })
      .strict(),
    place: z
      .object({
        id: uuid,
        name: z.string().nullable(),
        kind: z.enum(PLACE_KINDS),
        location: z.object({ lat: z.number(), lng: z.number() }).strict(),
        distanceKm: z.number().optional().openapi({ description: 'Only when X-Approx-Area was sent.' }),
      })
      .strict(),
    trust: trustSchema,
    attribution: z
      .object({
        sourceName: z.string().nullable(),
        url: z.string().nullable(),
        synthetic: z.boolean().openapi({ description: 'Sample data (never returned in production).' }),
      })
      .strict(),
  })
  .strict()
  .openapi('OccurrenceItem');

export const discoverResponseSchema = z
  .object({
    lens: z.enum(['now', 'tonight', 'weekend', 'date']),
    window: z.object({ from: isoDateTime, to: isoDateTime }).strict(),
    items: z.array(occurrenceItemSchema),
  })
  .strict()
  .openapi('DiscoverResponse');

export const categorySchema = z.object({ slug: z.string(), name: localizedTextSchema, sort: z.number().int() }).strict().openapi('Category');
export const districtSchema = z.object({ id: uuid, slug: z.string(), name: localizedTextSchema }).strict().openapi('District');

export const publicPlaceSchema = z
  .object({
    id: uuid,
    name: localizedTextSchema,
    kind: z.enum(PLACE_KINDS),
    address: localizedTextSchema.nullable(),
    location: z.object({ lat: z.number(), lng: z.number() }).strict(),
    website: z.string().nullable(),
    trust: z.object({ tier: z.enum(TRUST_TIERS), verification: z.enum(VERIFICATION_STATUSES), lastVerifiedAt: isoDateTime.nullable() }).strict(),
  })
  .strict()
  .openapi('Place');

/* Staff responses: documented, not strict (internal consumers, change more often). */
export const placeHitSchema = z
  .object({ id: uuid, name: localizedTextSchema, kind: z.enum(PLACE_KINDS), lat: z.number(), lng: z.number(), score: z.number() })
  .openapi('PlaceSearchHit');
export const adminEventRowSchema = z
  .object({
    id: uuid,
    title: localizedTextSchema,
    verificationStatus: z.enum(VERIFICATION_STATUSES),
    lifecycleStatus: z.enum(LIFECYCLE_STATUSES),
    trustTier: z.enum(TRUST_TIERS),
    lastVerifiedAt: isoDateTime.nullable(),
    nextStart: isoDateTime.nullable(),
  })
  .openapi('AdminEventRow');
export const publishResultSchema = z
  .object({ event: z.object({ id: uuid }).passthrough(), occurrences: z.array(z.object({ id: uuid }).passthrough()) })
  .openapi('PublishResult');
export const submissionReceiptSchema = z
  .object({ submissionId: uuid, reviewTaskId: uuid, status: z.literal('pending_review') })
  .strict()
  .openapi('SubmissionReceipt');
export const submissionRowSchema = z
  .object({
    id: uuid,
    title: localizedTextSchema.nullable(),
    receivedAt: isoDateTime,
    status: z.enum(['pending_review', 'published', 'rejected']),
    eventId: uuid.nullable(),
  })
  .openapi('SubmissionRow');
export const reviewTaskRowSchema = z
  .object({
    id: uuid,
    type: z.string(),
    status: z.enum(['open', 'done', 'skipped']),
    priority: z.number().int(),
    summary: z.string(),
    openedAt: isoDateTime,
    sourceCode: z.string().nullable(),
  })
  .openapi('ReviewTaskRow');
export const reviewTaskDetailSchema = z
  .object({
    task: z.object({ id: uuid, status: z.string(), summary: z.string() }).passthrough(),
    source: z.object({ code: z.string(), name: z.string(), trustTier: z.enum(TRUST_TIERS) }).nullable(),
    evidence: z.object({ payload: z.unknown(), url: z.string().nullable(), rawText: z.string().nullable(), collectedAt: isoDateTime }).nullable(),
  })
  .openapi('ReviewTaskDetail');
export const decisionResultSchema = z
  .object({
    taskId: uuid,
    decision: z.enum(['approve', 'reject']),
    eventId: uuid.optional(),
    occurrenceIds: z.array(uuid).optional(),
  })
  .openapi('DecisionResult');
export const genericRecordSchema = z.object({ id: uuid }).passthrough().openapi('Record');
