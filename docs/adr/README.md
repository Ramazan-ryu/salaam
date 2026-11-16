# Architecture Decision Records — Index

Status tracking: `Proposed` → `Accepted` / `Rejected` → `Superseded by ADR-nnnn`. All ADRs below are **Proposed** (2026-11-14) and become Accepted only with product-owner approval. Some are additionally gated by a spike (noted).

| ADR | Title | Status | Gate | Related decision |
|---|---|---|---|---|
| [ADR-0001](./ADR-0001-modular-monolith.md) | Modular monolith | Proposed | — | — |
| [ADR-0002](./ADR-0002-monorepo-pnpm-turborepo.md) | TypeScript monorepo (pnpm + Turborepo) | Proposed | — | — |
| [ADR-0003](./ADR-0003-mobile-expo-react-native.md) | Mobile: Expo / React Native with dev builds | Proposed | Spike S-AV1, S-MAP | D-07 |
| [ADR-0004](./ADR-0004-web-nextjs-single-app.md) | Web: single Next.js app (public, app, organizer, admin) | Proposed | — | D-07 |
| [ADR-0005](./ADR-0005-backend-nestjs.md) | Backend: NestJS API + worker | Proposed | — | — |
| [ADR-0006](./ADR-0006-postgresql-postgis.md) | PostgreSQL + PostGIS as system of record | Proposed | — | — |
| [ADR-0007](./ADR-0007-search-postgres-fts-trgm.md) | Search: Postgres full-text + pg_trgm | Proposed | Q-09 | — |
| [ADR-0008](./ADR-0008-pgvector-deferred.md) | pgvector deferred | Proposed | P-5 metrics | — |
| [ADR-0009](./ADR-0009-background-jobs-pg-boss.md) | Background jobs: pg-boss (no Redis initially) | Proposed | — | — |
| [ADR-0010](./ADR-0010-authentication-approach.md) | Authentication approach (managed vs library vs self-hosted) | Proposed — **open, blocked by S-AUTH** | Spike S-AUTH | D-05 |
| [ADR-0011](./ADR-0011-object-storage-s3-compatible.md) | Object storage: S3-compatible API | Proposed | D-02 | D-02 |
| [ADR-0012](./ADR-0012-avatar-rive-and-avatar-as-data.md) | Avatar: Rive renderer, avatar-as-data | Proposed | Spike S-AV1 | D-08 |
| [ADR-0013](./ADR-0013-maps-maplibre-osm.md) | Maps: MapLibre + OSM data, self-hosted tiles first | Proposed | Spike S-MAP | D-14 |
| [ADR-0014](./ADR-0014-ai-model-gateway.md) | AI model gateway | Proposed | — | D-15 |
| [ADR-0015](./ADR-0015-source-connector-architecture.md) | Source-independent connector architecture | Proposed | — | D-09 |
| [ADR-0016](./ADR-0016-push-notifications-expo.md) | Push via Expo Push Service behind provider interface | Proposed | — | — |
| [ADR-0017](./ADR-0017-hosting-portable-deferred.md) | Portable hosting; jurisdiction deferred | Proposed | QL-04/05 | D-02 |
| [ADR-0018](./ADR-0018-localization-strategy.md) | Localization strategy (az/ru/en) | Proposed | — | D-17 |
| [ADR-0019](./ADR-0019-status-model-two-axes.md) | Content status model (trust, verification, lifecycle, availability) | Proposed | — | — |
| [ADR-0020](./ADR-0020-api-rest-openapi-contract-first.md) | REST + OpenAPI, contract-first | Proposed | — | — |

## Template

```
# ADR-nnnn: Title
Status · Date · Deciders
## Context
## Decision
## Alternatives considered
## Consequences
## Solo-founder notes (cost · ops · when to introduce · what to postpone)
## Related
```
