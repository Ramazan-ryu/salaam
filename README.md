# Salaam

Working name for a city companion app for Azerbaijan (pilot: Baku): verified events, places and cinema, an avatar-first experience, and light social features. The app supports Azerbaijani, Russian and English.

**Current stage:** first working vertical slice (M-VS1). Status at a glance: [PROJECT_STATE.md](./PROJECT_STATE.md) · [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) · [FOUNDER_ACTIONS.md](./FOUNDER_ACTIONS.md).

## Start it (one command)

```bash
docker compose --profile full up --build -d
```

Then open http://localhost:3000 (app) and http://localhost:3000/staff (staff portal). Full guide for non-programmers:
[docs/LOCAL_DEVELOPMENT.md](./docs/LOCAL_DEVELOPMENT.md). Screenshots of the running app: [`design/screenshots/`](./design/screenshots/).

## What exists

| Path | What |
|---|---|
| `apps/web` | Public app (avatar-first home, Discover with "near me", event pages, az/ru/en) and staff portal (`/staff`) |
| `apps/api` | NestJS API: catalog, source register, organizer submissions, review queue, human-approved publication, discovery |
| `packages/domain` | Shared enums, zod schemas, localization fallback |
| `compose.yaml`, `infra/` | Docker environment (profiles core/full/tools/storage), Dockerfiles, backup/restore |
| `docs/` | Product, architecture, ADRs; how a feature goes from design to code: [FEATURE_TRACEABILITY_MATRIX.md](./docs/FEATURE_TRACEABILITY_MATRIX.md) |

Rules enforced in code: nothing is public without a human decision (D-25, also a DB CHECK); automation above L1 is refused; lifecycle changes are human and audited; price is shown only when stated; approximate location is a coarse area computed in the browser, never stored; sample data is labelled and hidden in production.

## Developer mode (native)

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
