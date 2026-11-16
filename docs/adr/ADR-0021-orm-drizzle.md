# ADR-0021: Drizzle ORM for PostgreSQL access

Status: Proposed (reversible) · 2026-11-17

## Context
Implementation of stage S1 started (founder instruction "Start building the app", 2026-11-17). The API needs typed
access to PostgreSQL 16 + PostGIS, generated SQL migrations that can be hand-edited, and raw SQL for spatial and
full-text queries. ADR-0003 fixed PostgreSQL/PostGIS but left the data-access layer open.

## Decision
Use **Drizzle ORM** (`drizzle-orm` + `drizzle-kit`, `node-postgres` driver) in `apps/api`:
- schema in `apps/api/src/db/schema.ts` is the single source for table types;
- migrations are generated into `apps/api/drizzle/` as plain SQL, reviewed and committed; hand edits are allowed
  (PostGIS extension creation, generated `geography` column, CHECK constraints);
- spatial/discovery queries use the `sql` template (parameterised), not the query builder.

## Alternatives considered
- **Prisma** — mature tooling; weak PostGIS support (unsupported types, raw SQL for every spatial query), heavier runtime.
- **TypeORM** — decorator entities fit NestJS; weaker type inference, migration drift issues.
- **Kysely / raw `pg`** — maximal control; more hand-written types and no schema-to-migration generation.

## Consequences
+ Types follow the schema; migrations are readable SQL; PostGIS works through raw SQL without fighting the ORM.
− drizzle-kit quotes custom types (`"geography(Point,4326)"`); every generated migration that touches such a column must
  be checked and unquoted by hand (noted in CLAUDE.md).
− Pre-1.0 library: pin minor versions; the data layer is confined to `src/db` and services so a swap stays local.

## Related
ADR-0003 (PostgreSQL/PostGIS), [DATABASE_DESIGN.md](../DATABASE_DESIGN.md)
