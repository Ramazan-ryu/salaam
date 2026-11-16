/**
 * Development seed: reference data + clearly fictional SAMPLE content (DS-003, never public).
 * Run: pnpm db:seed
 */
import { and, eq, sql } from 'drizzle-orm';
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

type SampleEvent = {
  title: { az: string; ru?: string; en?: string };
  place: number;
  time: string;
  days: number[];
  cats: string[];
  free?: boolean;
};

/**
 * Clearly fictional SAMPLE content (source DS-003, is_synthetic): every title ends with "(nümunə)/(пример)/(sample)",
 * every place is called "Nümunə …". Idempotent: re-running adds missing places/events and tops up dates for the
 * coming week, so the dev app always has something to show. Never runs in production.
 */
async function seedSamples(db: Db, cityId: string) {
  const [ds3] = await db.select().from(sources).where(eq(sources.code, 'DS-003'));
  const samplePlaces = [
    { name: { az: 'Nümunə Caz Klubu' }, kind: 'venue' as const, lat: 40.3667, lng: 49.8352 },
    { name: { az: 'Nümunə Qalereya' }, kind: 'gallery' as const, lat: 40.3655, lng: 49.84 },
    { name: { az: 'Nümunə Emalatxana' }, kind: 'venue' as const, lat: 40.378, lng: 49.853 },
    { name: { az: 'Nümunə Açıq Kino Həyəti' }, kind: 'venue' as const, lat: 40.361, lng: 49.835 },
    { name: { az: 'Nümunə Park' }, kind: 'park' as const, lat: 40.372, lng: 49.845 },
    { name: { az: 'Nümunə Kitab Kafesi' }, kind: 'cafe' as const, lat: 40.38, lng: 49.84 },
  ];
  const placeIds: string[] = [];
  for (const p of samplePlaces) {
    const nameNormalized = normalizeLocalized(p.name);
    const [found] = await db.select({ id: places.id }).from(places).where(eq(places.nameNormalized, nameNormalized));
    if (found) {
      placeIds.push(found.id);
      continue;
    }
    const [row] = await db
      .insert(places)
      .values({ cityId, ...p, nameNormalized, trustTier: 'T1_official', verificationStatus: 'staff_verified', lastVerifiedAt: new Date() })
      .returning({ id: places.id });
    placeIds.push(row!.id);
  }
  const cats = await db.select().from(categories);
  const cat = (slug: string) => cats.find((c) => c.slug === slug)!.id;
  const today = localParts(new Date()).date;
  const wd = new Date(`${today}T12:00:00+04:00`).getUTCDay(); // 0 = Sunday
  const toFriday = (5 - wd + 7) % 7;
  const weekend = [toFriday, toFriday + 1, toFriday + 2];

  const samples: SampleEvent[] = [
    { title: { az: 'Caz axşamı: canlı trio (nümunə)', ru: 'Джазовый вечер: трио (пример)', en: 'Jazz night: live trio (sample)' }, place: 0, time: '20:00', days: [0, 1, 2, ...weekend], cats: ['music'] },
    { title: { az: 'Şəhər fotoları sərgisi (nümunə)', ru: 'Выставка городской фотографии (пример)', en: 'City photography exhibition (sample)' }, place: 1, time: '18:00', days: [0, 1, 2, ...weekend], cats: ['exhibition_culture'] },
    { title: { az: 'Keramika emalatxanası (nümunə)', ru: 'Мастер-класс по керамике (пример)', en: 'Ceramics workshop (sample)' }, place: 2, time: '18:30', days: [0, 2, weekend[1]!], cats: ['workshop_talk'] },
    { title: { az: 'Açıq havada kino gecəsi (nümunə)', ru: 'Кино под открытым небом (пример)', en: 'Open-air cinema night (sample)' }, place: 3, time: '21:00', days: [0, 1, ...weekend], cats: ['cinema'] },
    { title: { az: 'Parkda könüllü təmizlik (nümunə)', ru: 'Волонтёрская уборка парка (пример)', en: 'Volunteer park clean-up (sample)' }, place: 4, time: '10:00', days: [weekend[1]!, weekend[2]!], cats: ['community_free'], free: true },
    { title: { az: 'Kitab klubu görüşü (nümunə)', ru: 'Встреча книжного клуба (пример)', en: 'Book club meetup (sample)' }, place: 5, time: '19:00', days: [0, weekend[0]!], cats: ['community_free', 'workshop_talk'], free: true },
    { title: { az: 'Dəniz kənarında DJ set (nümunə)', ru: 'DJ-сет у моря (пример)', en: 'Seaside DJ set (sample)' }, place: 3, time: '22:30', days: [weekend[0]!, weekend[1]!], cats: ['music'] },
    { title: { az: 'Uşaqlar üçün rəsm dərsi (nümunə)', ru: 'Урок рисования для детей (пример)', en: "Kids' drawing class (sample)" }, place: 2, time: '11:00', days: [weekend[1]!, weekend[2]!], cats: ['workshop_talk'] },
  ];

  for (const s of samples) {
    const titleNormalized = normalizeLocalized(s.title);
    // Match on the Azerbaijani title within DS-003, so adding translations later does not create a duplicate.
    let [ev] = await db
      .select({ id: events.id })
      .from(events)
      .where(and(eq(events.sourceId, ds3!.id), sql`${events.title} ->> 'az' = ${s.title.az}`));
    if (!ev) {
      [ev] = await db
        .insert(events)
        .values({
          cityId,
          primaryPlaceId: placeIds[s.place]!,
          title: s.title,
          originalLocale: 'az',
          titleNormalized,
          trustTier: 'T1_official',
          verificationStatus: 'staff_verified',
          sourceId: ds3!.id,
          lastVerifiedAt: new Date(),
          publishedAt: new Date(),
          ...(s.free ? { isFree: true } : {}),
        })
        .returning({ id: events.id });
      await db.insert(eventCategories).values(s.cats.map((c) => ({ eventId: ev!.id, categoryId: cat(c) })));
    }
    const existing = await db.select({ startsAt: occurrences.startsAt }).from(occurrences).where(eq(occurrences.eventId, ev!.id));
    const have = new Set(existing.map((o) => o.startsAt.getTime()));
    for (const d of new Set(s.days)) {
      const startsAt = localToUtc(addDays(today, d), s.time);
      if (have.has(startsAt.getTime())) continue;
      await db.insert(occurrences).values({ eventId: ev!.id, placeId: placeIds[s.place]!, startsAt });
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
