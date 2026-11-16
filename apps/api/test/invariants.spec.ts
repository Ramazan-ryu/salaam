import { eq } from 'drizzle-orm';
import { loadConfig } from '../src/config';
import { cities, events, places, sources } from '../src/db/schema';
import { bakuDate, bootTestApp, curator, type TestCtx } from './helpers';

describe('Platform invariants', () => {
  let ctx: TestCtx;
  let placeId: string;
  const date = bakuDate(3);

  beforeAll(async () => {
    ctx = await bootTestApp();
    const res = await ctx
      .http()
      .post('/v1/admin/places')
      .set(curator)
      .send({ name: { az: 'Fəvvarələr meydanı səhnəsi' }, lat: 40.3706, lng: 49.8378, districtSlug: 'sabail' })
      .expect(201);
    placeId = res.body.id;
    // Far place: ~20 km away (Mardakan area)
    await ctx
      .http()
      .post('/v1/admin/places')
      .set(curator)
      .send({ name: { az: 'Uzaq məkan' }, lat: 40.4925, lng: 50.1435, districtSlug: 'khazar' })
      .expect(201)
      .then((r) =>
        ctx
          .http()
          .post('/v1/admin/events')
          .set(curator)
          .send({
            placeId: r.body.id,
            title: { en: 'Far away concert' },
            occurrences: [{ date, startTime: '20:00' }],
            categorySlugs: ['music'],
            sourceUrl: 'https://example.org/far',
          })
          .expect(201),
      );
  });
  afterAll(() => ctx.app.close());

  it('the database refuses a published but unverified event', async () => {
    const [city] = await ctx.db.select().from(cities);
    const [ds1] = await ctx.db.select().from(sources).where(eq(sources.code, 'DS-001'));
    await expect(
      ctx.db.insert(events).values({
        cityId: city!.id,
        primaryPlaceId: placeId,
        title: { az: 'X' },
        originalLocale: 'az',
        titleNormalized: 'x',
        trustTier: 'T5_ai_extracted',
        verificationStatus: 'pending_review',
        sourceId: ds1!.id,
        publishedAt: new Date(),
      }),
    ).rejects.toThrow();
  });

  it('manual entry requires an official source link', async () => {
    const res = await ctx
      .http()
      .post('/v1/admin/events')
      .set(curator)
      .send({ placeId, title: { az: 'Linksiz' }, occurrences: [{ date }] })
      .expect(400);
    expect(res.body.code).toBe('VALIDATION_FAILED');
  });

  it('unknown start time is flagged as unconfirmed, and no price is invented', async () => {
    await ctx
      .http()
      .post('/v1/admin/events')
      .set(curator)
      .send({
        placeId,
        title: { az: 'Saatsız sərgi', en: 'Exhibition, time TBC' },
        occurrences: [{ date }],
        categorySlugs: ['exhibition_culture'],
        sourceUrl: 'https://example.org/expo',
      })
      .expect(201);
    const res = await ctx.http().get(`/v1/discover?lens=date&date=${date}&category=exhibition_culture`).set('Accept-Language', 'en').expect(200);
    expect(res.body.items).toHaveLength(1);
    const item = res.body.items[0];
    expect(item.event.title).toBe('Exhibition, time TBC');
    expect(item.timeUnknown).toBe(true);
    expect(item.trust.unconfirmedFields).toContain('start_time');
    expect(item.event.price).toBeUndefined();
    expect(item.attribution.url).toBe('https://example.org/expo');
  });

  it('falls back to the original language when a translation is missing', async () => {
    const res = await ctx.http().get(`/v1/discover?lens=date&date=${date}&category=exhibition_culture`).set('Accept-Language', 'ru').expect(200);
    expect(res.body.items[0].event.title).toBe('Saatsız sərgi');
    expect(res.body.items[0].event.translated).toBe(false);
  });

  it('approximate area filters by radius without storing location', async () => {
    // geohash "tp5my" ≈ central Baku (5 chars ≈ 2.4 km cell)
    const near = await ctx.http().get(`/v1/discover?lens=date&date=${date}&radiusKm=5`).set('X-Approx-Area', 'tp5my').expect(200);
    const titles = near.body.items.map((i: { event: { title: string } }) => i.event.title);
    expect(titles).not.toContain('Far away concert');
    expect(near.body.items.length).toBeGreaterThan(0);

    const wide = await ctx.http().get(`/v1/discover?lens=date&date=${date}&radiusKm=50`).set('X-Approx-Area', 'tp5my').expect(200);
    expect(wide.body.items.map((i: { event: { title: string } }) => i.event.title)).toContain('Far away concert');
  });

  it('rejects precise locations (privacy, D-28)', async () => {
    const res = await ctx.http().get(`/v1/discover?lens=date&date=${date}`).set('X-Approx-Area', 'tp5myk2b').expect(400);
    expect(res.body.code).toBe('AREA_TOO_PRECISE');
  });

  it('district filter works', async () => {
    const res = await ctx.http().get(`/v1/discover?lens=date&date=${date}&district=khazar`).expect(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].event.title).toBe('Far away concert');
  });

  it('admin endpoints require identity; problem+json on errors', async () => {
    const res = await ctx.http().get('/v1/admin/events').expect(401);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    await ctx.http().get('/v1/admin/events').set({ 'x-dev-user-id': 'u', 'x-dev-role': 'user' }).expect(403);
  });

  it('lens=date without date is a 400', async () => {
    const res = await ctx.http().get('/v1/discover?lens=date').expect(400);
    expect(res.body.code).toBe('DATE_REQUIRED');
  });

  it('DEV_AUTH can never be enabled in production', () => {
    expect(() => loadConfig({ NODE_ENV: 'production', DATABASE_URL: 'postgres://x@y/z', DEV_AUTH: 'true' })).toThrow(/DEV_AUTH/);
  });

  it('places search uses trigram similarity', async () => {
    const res = await ctx.http().get(`/v1/admin/places/search?q=${encodeURIComponent('fəvvarə')}`).set(curator).expect(200);
    expect(res.body.map((p: { id: string }) => p.id)).toContain(placeId);
    const [p] = await ctx.db.select().from(places).where(eq(places.id, placeId));
    expect(p!.verificationStatus).toBe('staff_verified');
  });
});
