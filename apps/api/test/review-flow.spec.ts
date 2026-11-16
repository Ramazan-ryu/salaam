import { eq } from 'drizzle-orm';
import { events, fieldProvenance, sources } from '../src/db/schema';
import { admin, bakuDate, bootTestApp, curator, organizerUser, sabailPlace, stranger, type TestCtx } from './helpers';

describe('Organizer submission → human review → publication', () => {
  let ctx: TestCtx;
  let orgId: string;
  const date = bakuDate(2);

  const submission = (title = 'Akustik axşam') => ({
    title: { az: title },
    placeName: 'Test Səhnə',
    occurrences: [{ date, startTime: '19:30', endTime: '21:30' }],
    price: { isFree: false, min: 10, currency: 'AZN' },
    categorySlugs: ['music'],
    rightsConfirmed: true,
  });

  const discoverOn = () => ctx.http().get(`/v1/discover?lens=date&date=${date}`).set('Accept-Language', 'az');

  beforeAll(async () => {
    ctx = await bootTestApp();
    const res = await ctx
      .http()
      .post('/v1/admin/organizers')
      .set(curator)
      .send({ name: { az: 'Test Təşkilatçı' }, memberUserIds: ['org-user-1'] })
      .expect(201);
    orgId = res.body.id;
  });
  afterAll(() => ctx.app.close());

  it('rejects submissions without rights confirmation', async () => {
    const res = await ctx
      .http()
      .post(`/v1/organizer/${orgId}/submissions`)
      .set(organizerUser)
      .send({ ...submission(), rightsConfirmed: false })
      .expect(400);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.code).toBe('VALIDATION_FAILED');
  });

  it('forbids non-members from submitting for an organizer', async () => {
    const res = await ctx.http().post(`/v1/organizer/${orgId}/submissions`).set(stranger).send(submission()).expect(403);
    expect(res.body.code).toBe('NOT_ORGANIZER_MEMBER');
  });

  let taskId: string;

  it('a submission creates a pending review task and is NOT public', async () => {
    const res = await ctx.http().post(`/v1/organizer/${orgId}/submissions`).set(organizerUser).send(submission()).expect(201);
    expect(res.body.status).toBe('pending_review');
    taskId = res.body.reviewTaskId;

    const pub = await discoverOn().expect(200);
    expect(pub.body.items).toHaveLength(0);
    const published = await ctx.db.select().from(events);
    expect(published).toHaveLength(0);
  });

  it('rejects an exact duplicate submission', async () => {
    const res = await ctx.http().post(`/v1/organizer/${orgId}/submissions`).set(organizerUser).send(submission()).expect(409);
    expect(res.body.code).toBe('DUPLICATE_SUBMISSION');
  });

  it('approval requires the place to be resolved', async () => {
    const res = await ctx.http().post(`/v1/admin/review-tasks/${taskId}/decision`).set(curator).send({ decision: 'approve' }).expect(400);
    expect(res.body.code).toBe('PLACE_REQUIRED');
  });

  it('organizers cannot decide review tasks', async () => {
    await ctx.http().post(`/v1/admin/review-tasks/${taskId}/decision`).set(organizerUser).send({ decision: 'approve' }).expect(403);
  });

  it('curator approval publishes with T3 trust, provenance and stated price', async () => {
    const res = await ctx
      .http()
      .post(`/v1/admin/review-tasks/${taskId}/decision`)
      .set(curator)
      .send({ decision: 'approve', newPlace: sabailPlace })
      .expect(201);
    expect(res.body.eventId).toBeDefined();

    const pub = await discoverOn().expect(200);
    expect(pub.body.items).toHaveLength(1);
    const item = pub.body.items[0];
    expect(item.event.title).toBe('Akustik axşam');
    expect(item.trust.tier).toBe('T3_organizer_submitted');
    expect(item.trust.verification).toBe('staff_verified');
    expect(item.event.price).toMatchObject({ min: 10, currency: 'AZN' });
    // 19:30 Baku = 15:30 UTC
    expect(new Date(item.startsAt).toISOString()).toBe(`${date}T15:30:00.000Z`);

    const prov = await ctx.db.select().from(fieldProvenance).where(eq(fieldProvenance.entityId, res.body.eventId));
    expect(prov.length).toBeGreaterThan(0);
    expect(prov.every((p) => p.method === 'human' && p.verified)).toBe(true);

    const list = await ctx.http().get(`/v1/organizer/${orgId}/submissions`).set(organizerUser).expect(200);
    expect(list.body[0].status).toBe('published');
  });

  it('a decided task cannot be decided twice', async () => {
    const res = await ctx
      .http()
      .post(`/v1/admin/review-tasks/${taskId}/decision`)
      .set(curator)
      .send({ decision: 'reject', reasonCode: 'duplicate' })
      .expect(409);
    expect(res.body.code).toBe('TASK_CLOSED');
  });

  it('rejected submissions never become public', async () => {
    const sub = await ctx
      .http()
      .post(`/v1/organizer/${orgId}/submissions`)
      .set(organizerUser)
      .send(submission('Rədd ediləcək'))
      .expect(201);
    await ctx
      .http()
      .post(`/v1/admin/review-tasks/${sub.body.reviewTaskId}/decision`)
      .set(curator)
      .send({ decision: 'reject', reasonCode: 'insufficient_info' })
      .expect(201);
    const pub = await discoverOn().expect(200);
    expect(pub.body.items.map((i: { event: { title: string } }) => i.event.title)).not.toContain('Rədd ediləcək');
  });

  it('cancellation is a human, audited lifecycle change and leaves the public feed', async () => {
    const pub = await discoverOn().expect(200);
    const occId = pub.body.items[0].id;
    await ctx
      .http()
      .patch(`/v1/admin/occurrences/${occId}/lifecycle`)
      .set(curator)
      .send({ lifecycleStatus: 'cancelled', reason: 'Organizer announced cancellation' })
      .expect(200);
    const after = await discoverOn().expect(200);
    expect(after.body.items).toHaveLength(0);
    const detail = await ctx.http().get(`/v1/occurrences/${occId}`).expect(200);
    expect(detail.body.lifecycle).toBe('cancelled');
  });

  it('submissions are refused when the organizer portal source is not approved', async () => {
    await ctx.db.update(sources).set({ status: 'suspended' }).where(eq(sources.code, 'DS-002'));
    const res = await ctx
      .http()
      .post(`/v1/organizer/${orgId}/submissions`)
      .set(organizerUser)
      .send(submission('Dayandırılmış mənbə'))
      .expect(409);
    expect(res.body.code).toBe('SOURCE_NOT_APPROVED');
    await ctx.db.update(sources).set({ status: 'approved' }).where(eq(sources.code, 'DS-002'));
  });

  it('D-25: automation above L1 cannot be enabled, even by an admin', async () => {
    const [ds2] = await ctx.db.select().from(sources).where(eq(sources.code, 'DS-002'));
    const res = await ctx
      .http()
      .patch(`/v1/admin/sources/${ds2!.id}/automation-level`)
      .set(admin)
      .send({ level: 'L2', reason: 'Try to enable auto-approval' })
      .expect(409);
    expect(res.body.code).toBe('AUTOMATION_DISABLED');
    await ctx.http().patch(`/v1/admin/sources/${ds2!.id}/automation-level`).set(curator).send({ level: 'L1', reason: 'Curator attempt' }).expect(403);
  });
});
