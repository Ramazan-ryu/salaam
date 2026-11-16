/**
 * Database schema — first slice of docs/DATABASE_DESIGN.md (city data, status model,
 * provenance, sources, review, audit). Identity/user tables arrive after spike S-AUTH.
 */
import { sql } from 'drizzle-orm';
import {
  bigserial,
  boolean,
  check,
  customType,
  doublePrecision,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import {
  AUTOMATION_LEVELS,
  AVAILABILITY,
  CONNECTOR_TYPES,
  LIFECYCLE_STATUSES,
  PLACE_KINDS,
  REVIEW_DECISIONS,
  REVIEW_TASK_TYPES,
  SOURCE_STATUSES,
  TRUST_TIERS,
  VERIFICATION_STATUSES,
  type LocalizedText,
} from '@salaam/domain';

// --- Enums ------------------------------------------------------------------
export const trustTier = pgEnum('trust_tier', TRUST_TIERS);
export const verificationStatus = pgEnum('verification_status', VERIFICATION_STATUSES);
export const lifecycleStatus = pgEnum('lifecycle_status', LIFECYCLE_STATUSES);
export const availability = pgEnum('availability', AVAILABILITY);
export const automationLevel = pgEnum('automation_level', AUTOMATION_LEVELS);
export const connectorType = pgEnum('connector_type', CONNECTOR_TYPES);
export const sourceStatus = pgEnum('source_status', SOURCE_STATUSES);
export const placeKind = pgEnum('place_kind', PLACE_KINDS);
export const reviewTaskType = pgEnum('review_task_type', REVIEW_TASK_TYPES);
export const reviewTaskStatus = pgEnum('review_task_status', ['open', 'done', 'skipped']);
export const reviewDecision = pgEnum('review_decision', REVIEW_DECISIONS);
export const provenanceMethod = pgEnum('provenance_method', ['partner', 'parser', 'llm', 'human']);

/** PostGIS geography(Point,4326), generated from lat/lng (read-only in app code). */
const geographyPoint = customType<{ data: string; driverData: string }>({
  dataType() {
    return 'geography(Point,4326)';
  },
});

const localized = (name: string) => jsonb(name).$type<LocalizedText>();
const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
};

// --- Geography & taxonomy ----------------------------------------------------
export const cities = pgTable('cities', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: localized('name').notNull(),
  timezone: text('timezone').notNull().default('Asia/Baku'),
  active: boolean('active').notNull().default(true),
});

export const districts = pgTable(
  'districts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cityId: uuid('city_id').notNull().references(() => cities.id),
    slug: text('slug').notNull(),
    name: localized('name').notNull(),
  },
  (t) => [uniqueIndex('districts_city_slug_uq').on(t.cityId, t.slug)],
);

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: localized('name').notNull(),
  sort: integer('sort').notNull().default(0),
});

// --- Places & organizers -------------------------------------------------------
export const places = pgTable(
  'places',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cityId: uuid('city_id').notNull().references(() => cities.id),
    districtId: uuid('district_id').references(() => districts.id),
    kind: placeKind('kind').notNull().default('venue'),
    name: localized('name').notNull(),
    /** Lower-cased, all locale variants joined; used for trigram matching. */
    nameNormalized: text('name_normalized').notNull(),
    address: localized('address'),
    lat: doublePrecision('lat').notNull(),
    lng: doublePrecision('lng').notNull(),
    location: geographyPoint('location').generatedAlwaysAs(
      sql`ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography`,
    ),
    website: text('website'),
    trustTier: trustTier('trust_tier').notNull().default('T1_official'),
    verificationStatus: verificationStatus('verification_status').notNull().default('pending_review'),
    lastVerifiedAt: timestamp('last_verified_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index('places_location_gist').using('gist', t.location),
    index('places_name_trgm').using('gin', sql`${t.nameNormalized} gin_trgm_ops`),
    check('places_lat_range', sql`${t.lat} BETWEEN -90 AND 90`),
    check('places_lng_range', sql`${t.lng} BETWEEN -180 AND 180`),
  ],
);

export const organizers = pgTable('organizers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: localized('name').notNull(),
  website: text('website'),
  instagramHandle: text('instagram_handle'),
  verified: boolean('verified').notNull().default(false),
  ...timestamps,
});

/** user_id is an opaque identity id until spike S-AUTH introduces the users table. */
export const organizerMembers = pgTable(
  'organizer_members',
  {
    organizerId: uuid('organizer_id')
      .notNull()
      .references(() => organizers.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    role: text('role').notNull().default('editor'),
  },
  (t) => [primaryKey({ columns: [t.organizerId, t.userId] })],
);

// --- Sources & pipeline ----------------------------------------------------------
export const sources = pgTable('sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  /** Register id, e.g. DS-002 (docs/DATA_SOURCES_REGISTER.md). */
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  connectorType: connectorType('connector_type').notNull(),
  config: jsonb('config').$type<Record<string, unknown>>().notNull().default({}),
  status: sourceStatus('status').notNull().default('proposed'),
  defaultTrustTier: trustTier('default_trust_tier').notNull(),
  automationLevel: automationLevel('automation_level').notNull().default('L1'),
  automationApprovedBy: text('automation_approved_by'),
  automationApprovedAt: timestamp('automation_approved_at', { withTimezone: true }),
  legalBasis: text('legal_basis'),
  evidenceRef: text('evidence_ref'),
  attribution: text('attribution'),
  retentionDays: integer('retention_days').notNull().default(90),
  ...timestamps,
});

export const sourceItems = pgTable(
  'source_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sourceId: uuid('source_id')
      .notNull()
      .references(() => sources.id),
    externalId: text('external_id'),
    url: text('url'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    /** Structured payload (e.g. organizer form) or connector-native fields. */
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull().default({}),
    rawText: text('raw_text'),
    contentHash: text('content_hash').notNull(),
    submittedBy: text('submitted_by'),
    collectedAt: timestamp('collected_at', { withTimezone: true }).notNull().defaultNow(),
    purgeAfter: timestamp('purge_after', { withTimezone: true }).notNull(),
  },
  (t) => [uniqueIndex('source_items_source_hash_uq').on(t.sourceId, t.contentHash)],
);

// --- Events & occurrences ---------------------------------------------------------
export const events = pgTable(
  'events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cityId: uuid('city_id')
      .notNull()
      .references(() => cities.id),
    organizerId: uuid('organizer_id').references(() => organizers.id),
    primaryPlaceId: uuid('primary_place_id').references(() => places.id),
    title: localized('title').notNull(),
    description: localized('description'),
    originalLocale: text('original_locale'),
    titleNormalized: text('title_normalized').notNull(),
    ticketUrl: text('ticket_url'),
    priceMin: numeric('price_min', { precision: 10, scale: 2 }),
    priceMax: numeric('price_max', { precision: 10, scale: 2 }),
    currency: text('currency'),
    isFree: boolean('is_free'),
    eventLanguage: text('event_language'),
    trustTier: trustTier('trust_tier').notNull(),
    verificationStatus: verificationStatus('verification_status').notNull().default('pending_review'),
    lifecycleStatus: lifecycleStatus('lifecycle_status').notNull().default('scheduled'),
    availability: availability('availability').notNull().default('unknown'),
    sourceId: uuid('source_id').references(() => sources.id),
    sourceItemId: uuid('source_item_id').references(() => sourceItems.id),
    sourceUrl: text('source_url'),
    lastVerifiedAt: timestamp('last_verified_at', { withTimezone: true }),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index('events_city_status_idx').on(t.cityId, t.verificationStatus, t.lifecycleStatus),
    index('events_title_trgm').using('gin', sql`${t.titleNormalized} gin_trgm_ops`),
    check(
      'events_published_requires_verification',
      sql`${t.publishedAt} IS NULL OR ${t.verificationStatus} IN ('auto_approved','staff_verified')`,
    ),
  ],
);

export const eventCategories = pgTable(
  'event_categories',
  {
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.categoryId] })],
);

export const occurrences = pgTable(
  'occurrences',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    placeId: uuid('place_id')
      .notNull()
      .references(() => places.id),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true }),
    timeUnknown: boolean('time_unknown').notNull().default(false),
    lifecycleStatus: lifecycleStatus('lifecycle_status').notNull().default('scheduled'),
    availability: availability('availability').notNull().default('unknown'),
    ...timestamps,
  },
  (t) => [
    index('occurrences_starts_idx').on(t.startsAt),
    index('occurrences_place_starts_idx').on(t.placeId, t.startsAt),
    check('occurrences_end_after_start', sql`${t.endsAt} IS NULL OR ${t.endsAt} > ${t.startsAt}`),
  ],
);

export const fieldProvenance = pgTable(
  'field_provenance',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    field: text('field').notNull(),
    method: provenanceMethod('method').notNull(),
    sourceItemId: uuid('source_item_id').references(() => sourceItems.id),
    evidence: text('evidence'),
    confidence: real('confidence'),
    derived: boolean('derived').notNull().default(false),
    verified: boolean('verified').notNull().default(false),
    verifiedBy: text('verified_by'),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('field_provenance_entity_idx').on(t.entityType, t.entityId, t.field)],
);

// --- Review & audit -----------------------------------------------------------------
export const reviewTasks = pgTable(
  'review_tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: reviewTaskType('type').notNull(),
    status: reviewTaskStatus('status').notNull().default('open'),
    priority: integer('priority').notNull().default(50),
    sourceItemId: uuid('source_item_id').references(() => sourceItems.id),
    eventId: uuid('event_id').references(() => events.id),
    summary: text('summary').notNull(),
    dueAt: timestamp('due_at', { withTimezone: true }),
    openedAt: timestamp('opened_at', { withTimezone: true }).notNull().defaultNow(),
    closedAt: timestamp('closed_at', { withTimezone: true }),
    handlingSeconds: integer('handling_seconds'),
  },
  (t) => [index('review_tasks_status_priority_idx').on(t.status, t.priority)],
);

export const reviewDecisions = pgTable('review_decisions', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id')
    .notNull()
    .references(() => reviewTasks.id),
  decision: reviewDecision('decision').notNull(),
  reasonCode: text('reason_code'),
  note: text('note'),
  diff: jsonb('diff').$type<Record<string, unknown>>(),
  decidedBy: text('decided_by').notNull(),
  decidedAt: timestamp('decided_at', { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    actorId: text('actor_id').notNull(),
    actorRole: text('actor_role').notNull(),
    action: text('action').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id'),
    before: jsonb('before'),
    after: jsonb('after'),
    at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('audit_logs_entity_idx').on(t.entityType, t.entityId)],
);
