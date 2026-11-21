# Test Results

Only results that were actually executed are recorded here.

## 2026-11-17 (TB-05 API contract)

| Suite / check | Result |
|---|---|
| API tests (real PostGIS) | ✅ 38/38 — new `openapi.spec` (6): served routes = documented routes, documented access = `@Roles`/`@Public` for all 23 routes, committed spec up to date, docs served in dev, strict public response schemas, no internal columns leaked, RFC 9457 errors; `synthetic.spec` +1: docs are 404 in production |
| Typecheck + build (web uses generated API types) | ✅ |
| Swagger UI renders all routes | ✅ `design/screenshots/09-api-docs-swagger.png` |

## 2026-11-17 (M-VS1)

| Suite / check | Command | Result |
|---|---|---|
| API integration (real PostgreSQL 16 + PostGIS) | `pnpm --filter @salaam/api test` | ✅ 31/31 (review-flow 12, invariants 11, time/geo/i18n 6, synthetic isolation 2) |
| Typecheck all packages | `pnpm typecheck` | ✅ |
| Build all packages (incl. Next.js standalone) | `pnpm build` | ✅ |
| Compose config (core, full, tools, storage, full+tools) | `docker compose … config` | ✅ valid |
| API image runtime set: migrate + seed + serve + HEALTHCHECK | executed natively from the copied runtime files | ✅ |
| Web image runtime set: standalone server, `/`, `/discover`, `/staff/review` | executed natively | ✅ 200 |
| Backup → restore into fresh DB | `make backup`, `infra/scripts/restore.sh` | ✅ identical row counts |
| Visual check (Playwright + Chrome), mobile 390×844 and desktop 1366×860 | `design/screenshots/01–07` | ✅ no console errors |
| `docker compose --profile full up --wait` on a real Docker engine | GitHub Actions job `docker-images` | ✅ db healthy → migrate exited 0 → api healthy → web up; health, home and discover smoke checks pass |
| GitHub Actions CI (typecheck, migrate, 31 tests, build, compose config) | job `check`, run 43959151498 | ✅ |

First CI run failed: Turborepo strict env mode hid `TEST_DATABASE_URL` from jest (local runs read `.env`). Reproduced locally without `.env` (25 failed), fixed via `passThroughEnv` (31 passed).

### What the tests prove
- Pending or rejected submissions are never public; only a curator decision publishes (D-25), backed by a DB CHECK.
- Automation above L1 is refused even for admins.
- Cancellation is human, audited, and removes the item from the feed.
- Location: precise geohashes rejected; radius filter works; location answers are `private, no-store`.
- No invented prices; unknown start time is flagged; language fallback works.
- Synthetic data is invisible in production; staff endpoints are closed without real auth.

## 2026-11-17 — Universe v1
`pnpm typecheck` ✓ · `pnpm test` ✓ (API 38/38) · `pnpm build` ✓ · visual captures: docs/design/VISUAL_TEST_RESULTS.md (8 screens, 0 page errors).

## 2026-11-21 — visual update

- Automated tests were not run. The local database, API, and web app were started natively; the event route rendered HTTP 200 and mobile/desktop screenshots were captured in `design/screenshots/after/28-event-details-*`. The full Docker build was not verified because Corepack could not validate npm registry TLS inside the container.
