# Salaam

Working name for a city companion app for Azerbaijan (pilot: Baku): verified events, places and cinema, an avatar-first experience, and light social features. The app supports Azerbaijani, Russian and English.

**Current stage:** implementation stage S1 (staff/organizer web + API), started 2026-11-17 on the founder's instruction. Product validation (P-0) was skipped by choice; its kit remains in `docs/`.

## What exists

| Path | What |
|---|---|
| `apps/api` | NestJS 11 API: catalog, source register, organizer submissions, review queue, human-approved publication, public discovery (`/v1/discover`) |
| `apps/web` | Next.js staff web: review queue, manual entry, events list, organizer submission form |
| `packages/domain` | Shared enums, zod schemas, localization fallback |
| `apps/api/test` | Integration tests against a real PostGIS database (29 tests) |

Rules enforced in code: nothing is public without a human decision (D-25, also a DB CHECK); automation above L1 is refused; lifecycle changes are human and audited; price is shown only when stated; approximate location is accepted only as a ≤6-char geohash header and never stored.

## Run locally

Requires Node 22+, pnpm 10, and PostgreSQL 16 with PostGIS (or `docker compose up -d db`).

```bash
cp .env.example .env          # local only, never committed
pnpm install
pnpm --filter @salaam/domain build
pnpm db:migrate && pnpm db:seed
pnpm dev:api                  # http://localhost:4000/v1/health
pnpm dev:web                  # http://localhost:3000
pnpm test                     # needs TEST_DATABASE_URL (a *_test database, migrated)
```

Sign-in is a **development stand-in** (`x-dev-user-id` / `x-dev-role` headers, switcher in the web header) until spike S-AUTH (ADR-0010). The API refuses to start with `DEV_AUTH=true` in production.

Start here: [docs/README.md](./docs/README.md) (document index) and [docs/DOCUMENTATION_REVIEW.md](./docs/DOCUMENTATION_REVIEW.md) (summary and decisions awaiting approval).
