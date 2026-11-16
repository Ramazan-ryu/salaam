# Salaam — notes for AI-assisted development

Read `docs/README.md` first. Decisions live in `docs/PRODUCT_DECISIONS.md` (D-xx) and `docs/adr/`.

## Non-negotiables
- Nothing becomes public without a human decision (D-25). The only publish path is
  `PublicationService.publishHumanVerified`; the DB CHECK `events_published_requires_verification` backs it.
- Automation above L1 stays disabled (`ALLOW_AUTOMATION_ABOVE_L1=false`). Do not add auto-approve paths.
- Lifecycle/availability (cancelled, sold out…) are set only by people via the audited endpoint.
- Never infer prices or times. Unknown start time → `timeUnknown` + `unconfirmedFields`.
- Location: only `X-Approx-Area` geohash ≤6 chars; never store or log it; no request-logging middleware.
- No scraping without an approved source record; no secrets in git (`.env` is ignored).
- DEV_AUTH is a stand-in; keep `AuthGuard`/`Actor`/`@Roles` as the interface the real auth will implement.

## Conventions
- Validation with zod at the controller edge; errors via `ProblemError` → RFC 9457 `application/problem+json`.
- Every state change writes `audit_logs` in the same transaction.
- Times: store UTC; convert with `src/common/time.ts` (Asia/Baku, no DST).
- Migrations: `pnpm --filter @salaam/api db:generate`, then review the SQL. drizzle-kit quotes
  `"geography(Point,4326)"` — unquote it by hand.
- Tests hit a real PostGIS `*_test` database; do not mock the DB.

## Commands
`pnpm db:migrate` · `pnpm db:seed` · `pnpm dev:api` · `pnpm dev:web` · `pnpm test` · `pnpm typecheck`
