import type { INestApplication } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import request from 'supertest';
import { loadDotEnv } from '../src/env';
import { DB, type Db } from '../src/db/client';
import { seedReference } from '../src/db/seed';

export interface TestCtx {
  app: INestApplication;
  db: Db;
  http: () => ReturnType<typeof request>;
}

export const curator = { 'x-dev-user-id': 'curator-1', 'x-dev-role': 'curator' };
export const admin = { 'x-dev-user-id': 'admin-1', 'x-dev-role': 'admin' };
export const organizerUser = { 'x-dev-user-id': 'org-user-1', 'x-dev-role': 'organizer' };
export const stranger = { 'x-dev-user-id': 'org-user-2', 'x-dev-role': 'organizer' };

/** Boots the real app against the real PostGIS test database (never mocks the DB). */
export async function bootTestApp(env: Record<string, string> = {}): Promise<TestCtx> {
  loadDotEnv();
  const testUrl = process.env.TEST_DATABASE_URL;
  if (!testUrl || !/_test\b/.test(testUrl)) throw new Error('TEST_DATABASE_URL must point to a *_test database');
  Object.assign(process.env, {
    NODE_ENV: 'test',
    DATABASE_URL: testUrl,
    DEV_AUTH: 'true',
    ALLOW_AUTOMATION_ABOVE_L1: 'false',
    ...env,
  });
  const { createApp } = await import('../src/main');
  const app = await createApp();
  await app.init();
  const db = app.get<Db>(DB);
  await db.execute(sql`TRUNCATE audit_logs, review_decisions, review_tasks, field_provenance, occurrences,
    event_categories, events, source_items, sources, organizer_members, organizers, places, categories,
    districts, cities RESTART IDENTITY CASCADE`);
  await seedReference(db, { approveOrganizerPortal: true });
  return { app, db, http: () => request(app.getHttpServer()) };
}

/** A Baku-local date N days from today, YYYY-MM-DD. */
export function bakuDate(offsetDays: number): string {
  const d = new Date(Date.now() + 4 * 3600_000 + offsetDays * 86400_000);
  return d.toISOString().slice(0, 10);
}

export const sabailPlace = { name: { az: 'Test Səhnə' }, lat: 40.3667, lng: 49.8352, districtSlug: 'sabail' };
