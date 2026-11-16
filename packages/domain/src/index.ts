/**
 * Shared domain vocabulary for Salaam (API, web, mobile).
 * Source of truth for statuses: docs/GLOSSARY.md and ADR-0019.
 */
import { z } from 'zod';

export const LOCALES = ['az', 'ru', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

/** Localized text: at least one locale must be present. */
export const localizedTextSchema = z
  .object({
    az: z.string().trim().min(1).max(2000).optional(),
    ru: z.string().trim().min(1).max(2000).optional(),
    en: z.string().trim().min(1).max(2000).optional(),
  })
  .refine((v) => Boolean(v.az || v.ru || v.en), {
    message: 'At least one of az, ru, en is required',
  });
export type LocalizedText = z.infer<typeof localizedTextSchema>;

// --- Status model (ADR-0019) ---------------------------------------------
export const TRUST_TIERS = [
  'T1_official',
  'T2_partner',
  'T3_organizer_submitted',
  'T4_community_submitted',
  'T5_ai_extracted',
] as const;
export type TrustTier = (typeof TRUST_TIERS)[number];

export const VERIFICATION_STATUSES = [
  'pending_review',
  'auto_approved',
  'staff_verified',
  'rejected',
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const LIFECYCLE_STATUSES = ['scheduled', 'postponed', 'cancelled', 'ended'] as const;
export type LifecycleStatus = (typeof LIFECYCLE_STATUSES)[number];

export const AVAILABILITY = ['unknown', 'available', 'sold_out', 'unavailable'] as const;
export type Availability = (typeof AVAILABILITY)[number];

/** Statuses that make content publicly visible (publication invariant). */
export const PUBLIC_VERIFICATION_STATUSES: readonly VerificationStatus[] = [
  'auto_approved',
  'staff_verified',
];

// --- Automation ladder (docs/CONTENT_OPERATIONS.md §5) --------------------
export const AUTOMATION_LEVELS = ['L0', 'L1', 'L2', 'L3', 'L4'] as const;
export type AutomationLevel = (typeof AUTOMATION_LEVELS)[number];

/** D-25 (confirmed): through MVP-1 nothing may be auto-approved. */
export function canAutoApprove(level: AutomationLevel, founderApprovedActivation: boolean): boolean {
  return (level === 'L2' || level === 'L3' || level === 'L4') && founderApprovedActivation;
}

// --- Data sources (docs/DATA_SOURCES_REGISTER.md) -------------------------
export const CONNECTOR_TYPES = [
  'manual_entry',
  'organizer_portal',
  'ics_feed',
  'rss_feed',
  'structured_web',
  'instagram_owned_account',
  'partner_feed',
  'osm_import',
  'telegram_channel_bot',
  'email_ingest',
] as const;
export type ConnectorType = (typeof CONNECTOR_TYPES)[number];

export const SOURCE_STATUSES = ['proposed', 'under_review', 'approved', 'suspended', 'retired'] as const;
export type SourceStatus = (typeof SOURCE_STATUSES)[number];

// --- Places & categories --------------------------------------------------
export const PLACE_KINDS = [
  'venue',
  'cinema',
  'cafe',
  'restaurant',
  'park',
  'museum',
  'gallery',
  'bike_station',
  'landmark',
  'other',
] as const;
export type PlaceKind = (typeof PLACE_KINDS)[number];

// --- Roles (docs/SECURITY_AND_PRIVACY.md §4) -------------------------------
export const ROLES = ['user', 'organizer', 'curator', 'moderator', 'admin'] as const;
export type Role = (typeof ROLES)[number];

// --- Review ---------------------------------------------------------------
export const REVIEW_TASK_TYPES = [
  'new_item',
  'possible_duplicate',
  'field_conflict',
  'lifecycle_signal',
  'audit',
  'organizer_claim',
  'report',
] as const;
export type ReviewTaskType = (typeof REVIEW_TASK_TYPES)[number];

export const REVIEW_DECISIONS = ['approve', 'edit', 'merge', 'reject'] as const;
export type ReviewDecision = (typeof REVIEW_DECISIONS)[number];

// --- Organizer submission payload (docs/ORGANIZER_OUTREACH.md §6) ---------
export const occurrenceInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:MM')
    .optional(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:MM')
    .optional(),
});

export const organizerSubmissionSchema = z.object({
  title: localizedTextSchema,
  description: localizedTextSchema.optional(),
  placeName: z.string().trim().min(2).max(200),
  placeAddress: z.string().trim().max(300).optional(),
  occurrences: z.array(occurrenceInputSchema).min(1).max(50),
  price: z
    .object({
      isFree: z.boolean().optional(),
      min: z.number().nonnegative().optional(),
      max: z.number().nonnegative().optional(),
      currency: z.literal('AZN').default('AZN'),
    })
    .optional(),
  ticketUrl: z.string().url().max(500).optional(),
  eventLanguage: z.enum(['az', 'ru', 'en', 'mixed', 'none']).optional(),
  categorySlugs: z.array(z.string().max(60)).max(5).default([]),
  rightsConfirmed: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm you may share this information' }),
  }),
});
export type OrganizerSubmission = z.infer<typeof organizerSubmissionSchema>;

/** Resolve localized text with the documented fallback chain (ADR-0018). */
export function resolveLocalized(
  text: Partial<Record<Locale, string>> | null | undefined,
  locale: Locale,
  originalLocale?: Locale | null,
): { value: string | null; locale: Locale | null } {
  if (!text) return { value: null, locale: null };
  const chain: Locale[] = [locale];
  if (originalLocale) chain.push(originalLocale);
  chain.push('az', 'ru', 'en');
  for (const l of chain) {
    const v = text[l];
    if (v) return { value: v, locale: l };
  }
  return { value: null, locale: null };
}
