/**
 * Development seed: reference data + clearly fictional SAMPLE content (DS-003, never public).
 * Run: pnpm db:seed
 */
import { eq } from 'drizzle-orm';
import { loadDotEnv } from '../env';
import { normalizeLocalized } from '../common/text';
import { localToUtc, addDays, localParts } from '../common/time';
import { createDb, createPool, type Db } from './client';
import { categories, cities, districts, eventCategories, events, occurrences, places, sources } from './schema';

const DISTRICTS: Array<[string, string]> = [
  ['binagadi', 'Binəqədi'],
  ['garadagh', 'Qaradağ'],
  ['khatai', 'Xətai'],
  ['khazar', 'Xəzər'],
  ['narimanov', 'Nərimanov'],
  ['nasimi', 'Nəsimi'],
  ['nizami', 'Nizami'],
  ['pirallahi', 'Pirallahı'],
  ['sabunchu', 'Sabunçu'],
  ['sabail', 'Səbail'],
  ['surakhani', 'Suraxanı'],
  ['yasamal', 'Yasamal'],
];

const CATEGORIES = [
  { slug: 'music', name: { az: 'Musiqi', ru: 'Музыка', en: 'Music' }, sort: 1 },
  { slug: 'exhibition_culture', name: { az: 'Sərgi və mədəniyyət', ru: 'Выставки и культура', en: 'Exhibitions & culture' }, sort: 2 },
  { slug: 'workshop_talk', name: { az: 'Emalatxana və söhbət', ru: 'Мастер-классы и лекции', en: 'Workshops & talks' }, sort: 3 },
  { slug: 'community_free', name: { az: 'İcma və pulsuz', ru: 'Сообщества и бесплатно', en: 'Community & free' }, sort: 4 },
  { slug: 'cinema', name: { az: 'Kino', ru: 'Кино', en: 'Cinema' }, sort: 5 },
];

export async function seedReference(db: Db, opts: { approveOrganizerPortal: boolean }) {
  await db
    .insert(cities)
    .values({ slug: 'baku', name: { az: 'Bakı', ru: 'Баку', en: 'Baku' }, timezone: 'Asia/Baku' })
    .onConflictDoNothing();
  const [baku] = await db.select().from(cities).where(eq(cities.slug, 'baku'));
  await db
    .insert(districts)
    .values(DISTRICTS.map(([slug, az]) => ({ cityId: baku!.id, slug, name: { az } })))
    .onConflictDoNothing();
  await db.insert(categories).values(CATEGORIES).onConflictDoNothing();
  await db
    .insert(sources)
    .values([
      {
        code: 'DS-001',
        name: 'Curator manual entry',
        connectorType: 'manual_entry',
        defaultTrustTier: 'T1_official',
        status: 'approved',
        legalBasis: 'Curator records facts from official sources with link-back (internal)',
      },
      {
        code: 'DS-002',
        name: 'Organizer portal submissions',
        connectorType: 'organizer_portal',
        defaultTrustTier: 'T3_organizer_submitted',
        status: opts.approveOrganizerPortal ? 'approved' : 'proposed',
        legalBasis: opts.approveOrganizerPortal
          ? 'DEV SEED ONLY — production approval pending organizer terms (QL-07)'
          : 'Pending organizer terms (QL-07)',
      },
      {
        code: 'DS-003',
        name: 'Synthetic seed data (never public in production)',
        connectorType: 'manual_entry',
        defaultTrustTier: 'T1_official',
        status: 'approved',
        isSynthetic: true,
        legalBasis: 'Internal synthetic data',
      },
    ])
    .onConflictDoNothing();
  return baku!;
}

async function seedSamples(db: Db, cityId: string) {
  const [ds3] = await db.select().from(sources).where(eq(sources.code, 'DS-003'));
  const existing = await db.select({ id: events.id }).from(events).where(eq(events.sourceId, ds3!.id));
  if (existing.length) return;

  const samplePlaces = [
    { name: { az: 'Nümunə Caz Klubu' }, kind: 'venue' as const, lat: 40.3667, lng: 49.8352 },
    { name: { az: 'Nümunə Qalereya' }, kind: 'gallery' as const, lat: 40.3655, lng: 49.8400 },
    { name: { az: 'Nümunə Emalatxana' }, kind: 'venue' as const, lat: 40.3780, lng: 49.8530 },
  ];
  const inserted = await db
    .insert(places)
    .values(
      samplePlaces.map((p) => ({
        cityId,
        ...p,
        nameNormalized: normalizeLocalized(p.name),
        trustTier: 'T1_official' as const,
        verificationStatus: 'staff_verified' as const,
        lastVerifiedAt: new Date(),
      })),
    )
    .returning();
  const cats = await db.select().from(categories);
  const cat = (slug: string) => cats.find((c) => c.slug === slug)!.id;
  const today = localParts(new Date()).date;

  const samples = [
    { title: { az: 'Caz axşamı: canlı trio (nümunə)', ru: 'Джазовый вечер: трио (пример)', en: 'Jazz night: live trio (sample)' }, place: 0, time: '20:00', cat: 'music' },
    { title: { az: 'Şəhər fotoları sərgisi (nümunə)', en: 'City photography exhibition (sample)' }, place: 1, time: '18:00', cat: 'exhibition_culture' },
    { title: { az: 'Keramika emalatxanası (nümunə)', ru: 'Мастер-класс по керамике (пример)' }, place: 2, time: '18:30', cat: 'workshop_talk' },
  ];
  for (const [i, s] of samples.entries()) {
    const [ev] = await db
      .insert(events)
      .values({
        cityId,
        primaryPlaceId: inserted[s.place]!.id,
        title: s.title,
        originalLocale: 'az',
        titleNormalized: normalizeLocalized(s.title),
        trustTier: 'T1_official',
        verificationStatus: 'staff_verified',
        sourceId: ds3!.id,
        lastVerifiedAt: new Date(),
        publishedAt: new Date(),
      })
      .returning();
    await db.insert(eventCategories).values({ eventId: ev!.id, categoryId: cat(s.cat) });
    for (let d = 0; d < 3; d++) {
      await db.insert(occurrences).values({
        eventId: ev!.id,
        placeId: inserted[s.place]!.id,
        startsAt: localToUtc(addDays(today, d + i % 2), s.time),
      });
    }
  }
}

if (require.main === module) {
  loadDotEnv();
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is required');
  const pool = createPool(url);
  const db = createDb(pool);
  seedReference(db, { approveOrganizerPortal: process.env.NODE_ENV !== 'production' })
    .then(async (city) => {
      if (process.env.NODE_ENV !== 'production') await seedSamples(db, city.id);
      console.log('Seed complete');
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}
