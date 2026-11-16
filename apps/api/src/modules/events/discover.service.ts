import { Inject, Injectable } from '@nestjs/common';
import { resolveLocalized, type Locale, type LocalizedText, type TrustTier, type VerificationStatus } from '@salaam/domain';
import { sql, type SQL } from 'drizzle-orm';
import { decodeGeohash } from '../../common/geohash';
import { ProblemError } from '../../common/problem.filter';
import { lensWindow, type Lens } from '../../common/time';
import { DB, type Db } from '../../db/client';

export interface DiscoverQuery {
  lens: Lens;
  date?: string;
  category?: string;
  district?: string;
  radiusKm: number;
  /** Request-scoped approximate area (geohash ≤6). Never stored or logged. */
  approxArea?: string;
  locale: Locale;
  limit: number;
  now?: Date;
}

interface Row {
  occurrence_id: string;
  starts_at: Date;
  ends_at: Date | null;
  time_unknown: boolean;
  lifecycle_status: string;
  availability: string;
  event_id: string;
  title: LocalizedText;
  description: LocalizedText | null;
  original_locale: string | null;
  trust_tier: TrustTier;
  verification_status: VerificationStatus;
  last_verified_at: Date | null;
  is_free: boolean | null;
  price_min: string | null;
  price_max: string | null;
  currency: string | null;
  ticket_url: string | null;
  source_url: string | null;
  source_name: string | null;
  place_id: string;
  place_name: LocalizedText;
  place_kind: string;
  lat: number;
  lng: number;
  distance_km: number | null;
  categories: string[] | null;
  unconfirmed: string[] | null;
}

/** "Verified" / "From organizer" badges (docs/GLOSSARY.md, public badge rules). */
export function trustBadge(tier: TrustTier, status: VerificationStatus): 'verified' | 'from_organizer' {
  if (tier === 'T3_organizer_submitted') return 'from_organizer';
  return status === 'staff_verified' || tier === 'T1_official' || tier === 'T2_partner' ? 'verified' : 'from_organizer';
}

const PUBLIC_EVENT = sql`e.verification_status IN ('auto_approved','staff_verified') AND e.published_at IS NOT NULL`;

@Injectable()
export class DiscoverService {
  constructor(@Inject(DB) private readonly db: Db) {}

  async discover(q: DiscoverQuery) {
    const now = q.now ?? new Date();
    const { from, to } = lensWindow(q.lens, now, q.date);

    let point: { lat: number; lng: number } | null = null;
    if (q.approxArea) {
      if (q.approxArea.length > 6) {
        throw new ProblemError(400, 'AREA_TOO_PRECISE', 'Approximate area must be a geohash of at most 6 characters');
      }
      point = decodeGeohash(q.approxArea.toLowerCase());
      if (!point) throw new ProblemError(400, 'AREA_INVALID', 'Approximate area is not a valid geohash');
    }

    const filters: SQL[] = [
      PUBLIC_EVENT,
      sql`e.lifecycle_status = 'scheduled' AND o.lifecycle_status = 'scheduled'`,
      sql`o.starts_at < ${to.toISOString()}::timestamptz`,
      sql`COALESCE(o.ends_at, o.starts_at + interval '3 hours') > ${from.toISOString()}::timestamptz`,
    ];
    if (q.category) {
      filters.push(
        sql`EXISTS (SELECT 1 FROM event_categories ec2 JOIN categories c2 ON c2.id = ec2.category_id WHERE ec2.event_id = e.id AND c2.slug = ${q.category})`,
      );
    }
    if (q.district) {
      filters.push(sql`p.district_id = (SELECT id FROM districts WHERE slug = ${q.district} LIMIT 1)`);
    }
    if (point) {
      filters.push(
        sql`ST_DWithin(p.location, ST_SetSRID(ST_MakePoint(${point.lng}, ${point.lat}), 4326)::geography, ${q.radiusKm * 1000})`,
      );
    }
    const distance = point
      ? sql`ST_Distance(p.location, ST_SetSRID(ST_MakePoint(${point.lng}, ${point.lat}), 4326)::geography) / 1000`
      : sql`NULL::float8`;

    const rows = await this.query(sql.join(filters, sql` AND `), distance, point ? sql`distance_km ASC, o.starts_at ASC` : sql`o.starts_at ASC`, q.limit);
    return {
      lens: q.lens,
      window: { from: from.toISOString(), to: to.toISOString() },
      items: rows.map((r) => this.present(r, q.locale)),
    };
  }

  async occurrence(id: string, locale: Locale) {
    const rows = await this.query(sql`${PUBLIC_EVENT} AND o.id = ${id}::uuid`, sql`NULL::float8`, sql`o.starts_at`, 1);
    const row = rows[0];
    if (!row) throw new ProblemError(404, 'OCCURRENCE_NOT_FOUND', 'Not found');
    return this.present(row, locale);
  }

  private async query(where: SQL, distance: SQL, order: SQL, limit: number): Promise<Row[]> {
    const res = await this.db.execute<Row & Record<string, unknown>>(sql`
      SELECT o.id AS occurrence_id, o.starts_at, o.ends_at, o.time_unknown, o.lifecycle_status, o.availability,
             e.id AS event_id, e.title, e.description, e.original_locale, e.trust_tier, e.verification_status,
             e.last_verified_at, e.is_free, e.price_min, e.price_max, e.currency, e.ticket_url, e.source_url,
             s.name AS source_name,
             p.id AS place_id, p.name AS place_name, p.kind AS place_kind, p.lat, p.lng,
             ${distance} AS distance_km,
             (SELECT array_agg(c.slug ORDER BY c.sort) FROM event_categories ec JOIN categories c ON c.id = ec.category_id WHERE ec.event_id = e.id) AS categories,
             (SELECT array_agg(DISTINCT fp.field) FROM field_provenance fp WHERE fp.entity_type = 'event' AND fp.entity_id = e.id AND fp.verified = false) AS unconfirmed
      FROM occurrences o
      JOIN events e ON e.id = o.event_id
      JOIN places p ON p.id = o.place_id
      LEFT JOIN sources s ON s.id = e.source_id
      WHERE ${where}
      ORDER BY ${order}
      LIMIT ${Math.min(Math.max(limit, 1), 50)}
    `);
    return res.rows as Row[];
  }

  private present(r: Row, locale: Locale) {
    const title = resolveLocalized(r.title, locale, r.original_locale as Locale | null);
    const description = resolveLocalized(r.description, locale, r.original_locale as Locale | null);
    const unconfirmed = [...(r.unconfirmed ?? [])];
    if (r.time_unknown) unconfirmed.push('start_time');
    const hasPrice = r.is_free !== null || r.price_min !== null || r.price_max !== null;
    return {
      id: r.occurrence_id,
      startsAt: new Date(r.starts_at).toISOString(),
      endsAt: r.ends_at ? new Date(r.ends_at).toISOString() : null,
      timeUnknown: r.time_unknown,
      lifecycle: r.lifecycle_status,
      availability: r.availability,
      event: {
        id: r.event_id,
        title: title.value,
        description: description.value,
        locale: title.locale,
        translated: false,
        categories: r.categories ?? [],
        ticketUrl: r.ticket_url,
        // Omitted entirely when the source stated no price (never inferred).
        ...(hasPrice
          ? {
              price: {
                isFree: r.is_free,
                min: r.price_min !== null ? Number(r.price_min) : null,
                max: r.price_max !== null ? Number(r.price_max) : null,
                currency: r.currency,
              },
            }
          : {}),
      },
      place: {
        id: r.place_id,
        name: resolveLocalized(r.place_name, locale).value,
        kind: r.place_kind,
        location: { lat: r.lat, lng: r.lng },
        ...(r.distance_km !== null ? { distanceKm: Math.round(Number(r.distance_km) * 10) / 10 } : {}),
      },
      trust: {
        tier: r.trust_tier,
        verification: r.verification_status,
        lastVerifiedAt: r.last_verified_at ? new Date(r.last_verified_at).toISOString() : null,
        badge: trustBadge(r.trust_tier, r.verification_status),
        unconfirmedFields: unconfirmed,
      },
      attribution: { sourceName: r.source_name, url: r.source_url },
    };
  }
}
