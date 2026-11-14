# ADR-0002: TypeScript monorepo (pnpm + Turborepo)

Status: Proposed · 2026-11-14

## Context
Mobile, web, API and worker share types (API client, avatar schema, i18n catalogs, design tokens). A solo developer benefits from one repository, one CI and atomic changes.

## Decision
Single repository with `apps/` (mobile, web, api, worker) and `packages/` (domain, api-client, ui-tokens, i18n, avatar-schema, config). pnpm workspaces for dependencies; Turborepo for task orchestration and caching.

## Alternatives considered
- **Polyrepo** — isolation; painful cross-repo changes for one person.
- **Nx** — powerful; heavier configuration than needed.
- **npm/yarn workspaces without task runner** — simpler; slower CI without caching.

## Consequences
+ Shared types end-to-end; one PR can update API contract and clients.
− Expo/React Native monorepo setup needs care (Metro configuration); validated in P-2.

## Solo-founder notes
Cost $0 (local caching; remote cache optional). Introduce: P-2. Postpone: remote build cache.

## Related
[SYSTEM_ARCHITECTURE.md](../SYSTEM_ARCHITECTURE.md#5-repository--module-structure-planned)
