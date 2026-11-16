/**
 * The SALAAM API contract (OpenAPI 3.1), built from the same zod schemas the controllers validate with.
 * Committed copy: docs/openapi.json — regenerate with `pnpm --filter @salaam/api openapi:generate`; CI fails on drift.
 */
import { OpenApiGeneratorV31, OpenAPIRegistry, type RouteConfig } from '@asteasolutions/zod-to-openapi';
import { organizerSubmissionSchema } from '@salaam/domain';
import { z } from 'zod';
import { newPlaceSchema } from '../modules/catalog/catalog.module';
import { discoverSchema, lifecycleSchema, manualEventSchema } from '../modules/events/events.module';
import { createOrganizerSchema } from '../modules/organizer/organizer.module';
import { decisionSchema } from '../modules/review/review.module';
import { automationSchema, createSourceSchema, statusSchema } from '../modules/sources/sources.module';
import * as S from './schemas';

type Access = 'public' | 'curator' | 'admin' | 'organizer';

const json = (schema: z.ZodTypeAny, description = 'OK') => ({ description, content: { 'application/json': { schema } } });
const problem = (description: string) => ({ description, content: { 'application/problem+json': { schema: S.problemSchema } } });
const idParam = (name = 'id') => z.object({ [name]: z.string().uuid() });
const acceptLanguage = z.object({
  'accept-language': z.string().optional().openapi({ description: 'az (default), ru or en. Content falls back: requested → original → az → ru → en.' }),
});

export function buildOpenApiDocument() {
  const r = new OpenAPIRegistry();
  r.registerComponent('securitySchemes', 'devAuth', {
    type: 'apiKey',
    in: 'header',
    name: 'x-dev-user-id',
    description:
      'DEVELOPMENT STAND-IN ONLY (ADR-0010, spike S-AUTH): any user id, e.g. curator-1. Refused in production.',
  });
  r.registerComponent('securitySchemes', 'devRole', {
    type: 'apiKey',
    in: 'header',
    name: 'x-dev-role',
    description: 'DEVELOPMENT STAND-IN ONLY: organizer | curator | moderator | admin.',
  });
  r.register('Problem', S.problemSchema);

  const route = (access: Access, cfg: Omit<RouteConfig, 'responses' | 'security'> & { ok: RouteConfig['responses'][string]; status?: number; errors?: Record<number, string> }) => {
    const { ok, status = 200, errors = {}, ...rest } = cfg;
    const responses: RouteConfig['responses'] = { [status]: ok, 400: problem('Validation failed') };
    if (access !== 'public') {
      responses[401] = problem('Not authenticated');
      responses[403] = problem(`Requires role: ${access} (admin always allowed)`);
    }
    for (const [code, d] of Object.entries(errors)) responses[Number(code)] = problem(d);
    r.registerPath({
      ...rest,
      // Machine-checked against @Roles/@Public in test/openapi.spec.ts.
      'x-salaam-access': access,
      ...(access === 'public' ? {} : { security: [{ devAuth: [], devRole: [] }] }),
      tags: rest.tags ?? [access === 'public' ? 'Public' : 'Staff'],
      responses,
    });
  };

  // ---------- Public ----------
  route('public', { method: 'get', path: '/v1/health', summary: 'Liveness + database check', ok: json(S.healthSchema) });
  route('public', {
    method: 'get',
    path: '/v1/discover',
    summary: 'Verified, scheduled events in a time window (Asia/Baku), optionally near an approximate area',
    description:
      'Location privacy (D-28): the approximate area travels only in the X-Approx-Area header as a geohash of at most 6 characters. ' +
      'Responses that used an area are `Cache-Control: private, no-store`.',
    request: {
      query: discoverSchema,
      headers: acceptLanguage.extend({
        'x-approx-area': z.string().max(6).optional().openapi({ description: 'Geohash ≤ 6 chars (clients use 5 ≈ 5 km).', example: 'tp5my' }),
      }),
    },
    ok: json(S.discoverResponseSchema),
    errors: { 400: 'Validation failed, DATE_REQUIRED, AREA_TOO_PRECISE or AREA_INVALID' },
  });
  route('public', {
    method: 'get',
    path: '/v1/occurrences/{id}',
    summary: 'One public occurrence with event, place, trust and source',
    request: { params: idParam(), headers: acceptLanguage },
    ok: json(S.occurrenceItemSchema),
    errors: { 404: 'Not found or not public' },
  });
  route('public', { method: 'get', path: '/v1/categories', summary: 'Event categories', ok: json(z.array(S.categorySchema)) });
  route('public', {
    method: 'get',
    path: '/v1/cities/{slug}/districts',
    summary: 'Districts of a city',
    request: { params: z.object({ slug: z.string().openapi({ example: 'baku' }) }) },
    ok: json(z.array(S.districtSchema)),
  });
  route('public', {
    method: 'get',
    path: '/v1/places/{id}',
    summary: 'A verified place',
    request: { params: idParam() },
    ok: json(S.publicPlaceSchema),
    errors: { 404: 'Not found or not verified' },
  });

  // ---------- Staff: catalog ----------
  route('curator', {
    method: 'get',
    path: '/v1/admin/places/search',
    summary: 'Fuzzy place search (trigram)',
    request: { query: z.object({ q: z.string().min(2) }) },
    ok: json(z.array(S.placeHitSchema)),
  });
  route('curator', {
    method: 'post',
    path: '/v1/admin/places',
    summary: 'Create a staff-verified place',
    request: { body: { content: { 'application/json': { schema: newPlaceSchema } } } },
    status: 201,
    ok: json(S.genericRecordSchema, 'Created'),
  });

  // ---------- Staff: sources ----------
  route('curator', { method: 'get', path: '/v1/admin/sources', summary: 'Source register', ok: json(z.array(S.genericRecordSchema)) });
  route('admin', {
    method: 'post',
    path: '/v1/admin/sources',
    summary: 'Propose a source (starts as proposed, automation L1)',
    request: { body: { content: { 'application/json': { schema: createSourceSchema } } } },
    status: 201,
    ok: json(S.genericRecordSchema, 'Created'),
  });
  route('admin', {
    method: 'patch',
    path: '/v1/admin/sources/{id}/status',
    summary: 'Change source status (audited)',
    request: { params: idParam(), body: { content: { 'application/json': { schema: statusSchema } } } },
    ok: json(S.genericRecordSchema),
    errors: { 404: 'Source not found' },
  });
  route('admin', {
    method: 'patch',
    path: '/v1/admin/sources/{id}/automation-level',
    summary: 'Change automation level — L2+ refused through MVP-1 (D-25)',
    request: { params: idParam(), body: { content: { 'application/json': { schema: automationSchema } } } },
    ok: json(S.genericRecordSchema),
    errors: { 404: 'Source not found', 409: 'AUTOMATION_DISABLED' },
  });

  // ---------- Staff: events ----------
  route('curator', {
    method: 'get',
    path: '/v1/admin/events',
    summary: 'Latest events (any status)',
    request: { query: z.object({ status: z.string().optional() }) },
    ok: json(z.array(S.adminEventRowSchema)),
  });
  route('curator', {
    method: 'post',
    path: '/v1/admin/events',
    summary: 'Manual entry from an official source link (DS-001); publishes as staff_verified',
    request: { body: { content: { 'application/json': { schema: manualEventSchema } } } },
    status: 201,
    ok: json(S.publishResultSchema, 'Published'),
    errors: { 404: 'Place not found', 409: 'SOURCE_NOT_APPROVED' },
  });
  route('curator', {
    method: 'patch',
    path: '/v1/admin/occurrences/{id}/lifecycle',
    summary: 'Human-only lifecycle/availability change (audited, provenance)',
    request: { params: idParam(), body: { content: { 'application/json': { schema: lifecycleSchema } } } },
    ok: json(S.genericRecordSchema),
    errors: { 404: 'Occurrence not found' },
  });

  // ---------- Organizers ----------
  route('curator', {
    method: 'post',
    path: '/v1/admin/organizers',
    summary: 'Create an organizer and its members',
    tags: ['Staff'],
    request: { body: { content: { 'application/json': { schema: createOrganizerSchema } } } },
    status: 201,
    ok: json(S.genericRecordSchema, 'Created'),
  });
  route('organizer', {
    method: 'post',
    path: '/v1/organizer/{orgId}/submissions',
    summary: 'Submit an event — always goes to human review, never published directly',
    tags: ['Organizer'],
    request: { params: idParam('orgId'), body: { content: { 'application/json': { schema: organizerSubmissionSchema } } } },
    status: 201,
    ok: json(S.submissionReceiptSchema, 'Received for review'),
    errors: { 404: 'Organizer not found', 409: 'DUPLICATE_SUBMISSION or SOURCE_NOT_APPROVED' },
  });
  route('organizer', {
    method: 'get',
    path: '/v1/organizer/{orgId}/submissions',
    summary: "The organizer's submissions and their review status",
    tags: ['Organizer'],
    request: { params: idParam('orgId') },
    ok: json(z.array(S.submissionRowSchema)),
    errors: { 404: 'Organizer not found' },
  });

  // ---------- Review ----------
  route('curator', {
    method: 'get',
    path: '/v1/admin/review-tasks',
    summary: 'Review queue (≤72 h items first)',
    tags: ['Review'],
    request: { query: z.object({ status: z.enum(['open', 'done', 'skipped']).optional() }) },
    ok: json(z.array(S.reviewTaskRowSchema)),
  });
  route('curator', {
    method: 'get',
    path: '/v1/admin/review-tasks/{id}',
    summary: 'Task with source and evidence',
    tags: ['Review'],
    request: { params: idParam() },
    ok: json(S.reviewTaskDetailSchema),
    errors: { 404: 'Task not found' },
  });
  route('curator', {
    method: 'post',
    path: '/v1/admin/review-tasks/{id}/decision',
    summary: 'Approve (publishes, D-25) or reject with a reason',
    tags: ['Review'],
    request: { params: idParam(), body: { content: { 'application/json': { schema: decisionSchema } } } },
    status: 201,
    ok: json(S.decisionResultSchema),
    errors: { 404: 'Task or place not found', 409: 'TASK_CLOSED or SOURCE_NOT_APPROVED', 422: 'UNSUPPORTED_TASK' },
  });

  return new OpenApiGeneratorV31(r.definitions).generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Salaam API',
      version: '0.1.0',
      description:
        'SALAAM-owned API for the Baku pilot. Not an API of any external provider. Errors follow RFC 9457. ' +
        'Nothing is public without a human decision (D-25).',
    },
    servers: [{ url: 'http://localhost:4000', description: 'Local development' }],
  });
}
