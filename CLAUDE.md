# Salaam — instructions for AI-assisted development

Salaam is an avatar-first, location-aware city companion for Baku (az/ru/en): verified events and places,
a personal companion on the home screen, later social plans. Solo founder, 10–15 h/week, low budget.

## Start every session here
1. Read `PROJECT_STATE.md`, `NEXT_ACTIONS.md`, `TASK_BOARD.md`, `BLOCKERS.md`, `FOUNDER_ACTIONS.md`.
2. Verify the checkpoint (`pnpm typecheck && pnpm test`) before changing anything.
3. Continue from NEXT_ACTIONS. Do not restart or re-architect working modules.
4. Before ending: update PROJECT_STATE, TASK_BOARD, TEST_RESULTS, BLOCKERS, DECISION_LOG, DEVELOPMENT_LOG,
   NEXT_ACTIONS, and `docs/FEATURE_TRACEABILITY_MATRIX.md`; commit.

## Autonomy (founder directive, 2026-11-17)
Make ordinary engineering decisions without asking (libraries, structure, fixes, next module); record them in
DECISION_LOG.md. Contact the founder only for: accounts, credentials, payments, legal terms, production access,
irreversible actions on real data, or product decisions that cannot be inferred — add them to FOUNDER_ACTIONS.md
once and continue with other work. Never spend money, publish code, contact real people, or bypass permissions.

## Non-negotiables
- Nothing becomes public without a human decision (D-25). Only publish path: `PublicationService.publishHumanVerified`;
  DB CHECK `events_published_requires_verification` backs it. Automation above L1 stays disabled.
- Lifecycle/availability (cancelled, sold out…) are changed only by people via the audited endpoint.
- Never invent prices, times, schedules, availability or real-world facts. Unknown → explicit unknown state.
- Synthetic data only from sources with `is_synthetic = true`; labelled "Nümunə"; hidden in production.
- Location: browser computes a ≤6-char geohash (we use 5); only via `X-Approx-Area`; never stored or logged;
  responses `Cache-Control: private, no-store`. No request-logging middleware.
- No scraping without an approved source record. No secrets in git. DEV_AUTH is a stand-in, refused in production.
- Never present a mockup as a working feature; only implemented destinations appear in navigation.

## Stack and layout
pnpm workspaces + Turborepo · TypeScript strict.
- `apps/api` — NestJS 11, Drizzle ORM, PostgreSQL 16 + PostGIS + pg_trgm, zod, RFC 9457 errors.
- `apps/web` — Next.js 15: public app in `src/app/(public)` (`/`, `/discover`, `/e/[id]`), staff portal in `src/app/staff`.
- `packages/domain` — shared enums, zod schemas, localization fallback.
- `compose.yaml`, `infra/docker/*`, `infra/scripts/*`, `Makefile` — local environment (docs/DOCKER_ARCHITECTURE.md).
- `docs/` — product, architecture, ADRs; `design/screenshots/` — real captures only.

## Conventions
- Validate with zod at the controller edge; errors via `ProblemError`.
- Every state change writes `audit_logs` in the same transaction.
- Times stored UTC; Baku conversion in `apps/api/src/common/time.ts`; az dates formatted by hand in `apps/web/src/lib/i18n.ts`.
- Migrations: `pnpm --filter @salaam/api db:generate`, review the SQL; drizzle-kit quotes `"geography(Point,4326)"` — unquote by hand.
- Tests hit a real PostGIS `*_test` database; do not mock the DB.

## Commands
`make up` (all in Docker) · `make db` · `pnpm dev:api` · `pnpm dev:web` · `pnpm db:migrate` · `pnpm db:seed` ·
`pnpm test` · `pnpm typecheck` · `pnpm build` · `make backup` / `make restore FILE=…`

## Definition of done
Requirement + journey documented · visual design · API contract · backend with authorization and validation ·
migration · loading/empty/error states · az/ru/en · tests executed · screenshot captured · docs + traceability
matrix updated · security reviewed. Statuses: NOT_STARTED, DESIGNED, IN_PROGRESS, IMPLEMENTED, TESTED, BLOCKED, RELEASE_READY.
