# ADR-0006: PostgreSQL + PostGIS as system of record

Status: Proposed · 2026-11-14

## Context
Relational data with strong integrity (provenance, statuses, social graph), geospatial queries ("near", map viewports), and a desire to avoid extra services.

## Decision
PostgreSQL (current supported major version) with PostGIS and pg_trgm. The same database hosts the job queue (pg-boss schema). Self-hosted on the application VM for MVP-0/1 with automated encrypted backups; managed Postgres considered once hosting is decided.

## Alternatives considered
- **Supabase** (managed Postgres + extras) — convenient; free plan pauses after 1 week inactivity; Pro from $25/month (reported, 2026-11-14); hosting regions vs data residency question.
- **MySQL** — weaker geospatial tooling.
- **MongoDB** — weaker relational guarantees for this model.
- **SQLite/libSQL** — simple; weaker geo and concurrency for the pipeline.

## Consequences
+ One database for content, geo, search, jobs.
− Self-hosting requires backup/restore discipline (NFR-011).

## Solo-founder notes
Cost $0 software. Ops: medium (scripted). Introduce P-2. Postpone replicas, partitioning (except audit logs).

## Related
[DATABASE_DESIGN.md](../DATABASE_DESIGN.md)
