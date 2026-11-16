import fs from 'node:fs';
import path from 'node:path';
import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { MetadataScanner, ModulesContainer, Reflector } from '@nestjs/core';
import { eq } from 'drizzle-orm';
import { PUBLIC_KEY, ROLES_KEY } from '../src/common/auth';
import { places } from '../src/db/schema';
import { buildOpenApiDocument } from '../src/openapi/document';
import * as S from '../src/openapi/schemas';
import { bakuDate, bootTestApp, curator, sabailPlace, type TestCtx } from './helpers';

type Op = { 'x-salaam-access'?: string };
const doc = buildOpenApiDocument() as unknown as { paths: Record<string, Record<string, Op>> };

/** Every route Nest actually serves, with the access its decorators enforce. */
function servedRoutes(ctx: TestCtx) {
  const scanner = new MetadataScanner();
  const reflector = new Reflector();
  const out = new Map<string, string>();
  const wrappers = [...ctx.app.get(ModulesContainer).values()].flatMap((m) => [...m.controllers.values()]);
  for (const wrapper of wrappers) {
    const instance = wrapper.instance as object | undefined;
    if (!instance) continue;
    const proto = Object.getPrototypeOf(instance);
    const base = String(Reflect.getMetadata(PATH_METADATA, wrapper.metatype as object) ?? '');
    for (const name of scanner.getAllMethodNames(proto)) {
      const handler = proto[name];
      const sub = Reflect.getMetadata(PATH_METADATA, handler);
      if (sub === undefined) continue;
      const method = RequestMethod[Reflect.getMetadata(METHOD_METADATA, handler) as number]!.toLowerCase();
      const full = ('/' + [base, sub].filter((p) => p && p !== '/').join('/')).replace(/\/+/g, '/').replace(/:(\w+)/g, '{$1}');
      const isPublic = reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [handler, wrapper.metatype as object]);
      const roles = reflector.getAllAndOverride<string[]>(ROLES_KEY, [handler, wrapper.metatype as object]) ?? [];
      out.set(`${method} ${full}`, isPublic ? 'public' : roles[0] ?? 'authenticated');
    }
  }
  return out;
}

describe('API contract (OpenAPI)', () => {
  let ctx: TestCtx;
  let occurrenceId: string;
  let placeId: string;
  const date = bakuDate(2);

  beforeAll(async () => {
    ctx = await bootTestApp();
    const place = await ctx.http().post('/v1/admin/places').set(curator).send(sabailPlace).expect(201);
    placeId = place.body.id;
    const ev = await ctx
      .http()
      .post('/v1/admin/events')
      .set(curator)
      .send({
        placeId,
        title: { az: 'Kontrakt testi', en: 'Contract test' },
        occurrences: [{ date, startTime: '19:00' }],
        categorySlugs: ['music'],
        price: { isFree: true, currency: 'AZN' },
        sourceUrl: 'https://example.org/contract',
      })
      .expect(201);
    occurrenceId = ev.body.occurrences[0].id;
  });
  afterAll(() => ctx.app.close());

  it('documents exactly the routes the API serves, with the same access rules', () => {
    const served = servedRoutes(ctx);
    const documented = new Map<string, string>();
    for (const [p, ops] of Object.entries(doc.paths)) for (const [m, op] of Object.entries(ops)) documented.set(`${m} ${p}`, op['x-salaam-access']!);
    expect([...documented.keys()].sort()).toEqual([...served.keys()].sort());
    for (const [key, access] of served) expect(`${key} → ${documented.get(key)}`).toBe(`${key} → ${access}`);
  });

  it('the committed docs/openapi.json is up to date (run: pnpm --filter @salaam/api openapi:generate)', () => {
    const committed = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../docs/openapi.json'), 'utf8'));
    expect(committed).toEqual(JSON.parse(JSON.stringify(buildOpenApiDocument())));
  });

  it('serves the spec and Swagger UI outside production', async () => {
    const spec = await ctx.http().get('/v1/openapi.json').expect(200);
    expect(spec.body.openapi).toBe('3.1.0');
    const ui = await ctx.http().get('/v1/docs').expect(200);
    expect(ui.text).toContain('swagger-ui-bundle.js');
  });

  it('public responses match their strict schemas', async () => {
    const health = await ctx.http().get('/v1/health').expect(200);
    S.healthSchema.parse(health.body);

    const plain = await ctx.http().get(`/v1/discover?lens=date&date=${date}`).set('Accept-Language', 'en').expect(200);
    const parsed = S.discoverResponseSchema.parse(plain.body);
    expect(parsed.items.length).toBeGreaterThan(0);

    const near = await ctx.http().get(`/v1/discover?lens=date&date=${date}`).set('X-Approx-Area', 'tp5my').expect(200);
    const nearParsed = S.discoverResponseSchema.parse(near.body);
    expect(nearParsed.items[0]!.place.distanceKm).toEqual(expect.any(Number));

    const occ = await ctx.http().get(`/v1/occurrences/${occurrenceId}`).expect(200);
    expect(S.occurrenceItemSchema.parse(occ.body).event.price).toEqual({ isFree: true, min: null, max: null, currency: null });

    S.categorySchema.array().parse((await ctx.http().get('/v1/categories').expect(200)).body);
    S.districtSchema.array().parse((await ctx.http().get('/v1/cities/baku/districts').expect(200)).body);
    S.publicPlaceSchema.parse((await ctx.http().get(`/v1/places/${placeId}`).expect(200)).body);
  });

  it('the public place response never leaks internal columns', async () => {
    const res = await ctx.http().get(`/v1/places/${placeId}`).expect(200);
    for (const k of ['nameNormalized', 'location_geog', 'createdAt', 'updatedAt', 'cityId', 'districtId']) expect(res.body).not.toHaveProperty(k);
    const [row] = await ctx.db.select().from(places).where(eq(places.id, placeId));
    expect(res.body.location).toEqual({ lat: row!.lat, lng: row!.lng });
  });

  it('errors are RFC 9457 problem documents', async () => {
    const res = await ctx.http().get('/v1/discover?lens=date').expect(400);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    S.problemSchema.parse(res.body);
  });
});
