import { eq } from 'drizzle-orm';
import { cities, events, occurrences, places, sources } from '../src/db/schema';
import { localToUtc } from '../src/common/time';
import { bakuDate, bootTestApp, type TestCtx } from './helpers';

describe('Synthetic data isolation (production mode)', () => {
  let ctx: TestCtx;
  const date = bakuDate(1);

  beforeAll(async () => {
    ctx = await bootTestApp({ NODE_ENV: 'production', DEV_AUTH: 'false' });
    const [city] = await ctx.db.select().from(cities);
    const [ds3] = await ctx.db.select().from(sources).where(eq(sources.code, 'DS-003'));
    expect(ds3!.isSynthetic).toBe(true);
    const [place] = await ctx.db
      .insert(places)
      .values({ cityId: city!.id, name: { az: 'Nümunə' }, nameNormalized: 'nümunə', kind: 'venue', lat: 40.37, lng: 49.84, trustTier: 'T1_official', verificationStatus: 'staff_verified' })
      .returning();
    const [ev] = await ctx.db
      .insert(events)
      .values({
        cityId: city!.id,
        primaryPlaceId: place!.id,
        title: { az: 'Nümunə tədbir' },
        originalLocale: 'az',
        titleNormalized: 'nümunə tədbir',
        trustTier: 'T1_official',
        verificationStatus: 'staff_verified',
        sourceId: ds3!.id,
        publishedAt: new Date(),
      })
      .returning();
    await ctx.db.insert(occurrences).values({ eventId: ev!.id, placeId: place!.id, startsAt: localToUtc(date, '19:00') });
  });
  afterAll(() => ctx.app.close());

  it('never shows synthetic events publicly in production', async () => {
    const res = await ctx.http().get(`/v1/discover?lens=date&date=${date}`).expect(200);
    expect(res.body.items).toHaveLength(0);
  });

  it('staff endpoints are closed when DEV_AUTH is off (no real auth yet)', async () => {
    const res = await ctx.http().get('/v1/admin/events').set({ 'x-dev-user-id': 'a', 'x-dev-role': 'admin' }).expect(401);
    expect(res.body.code).toBe('AUTH_NOT_CONFIGURED');
  });
});
