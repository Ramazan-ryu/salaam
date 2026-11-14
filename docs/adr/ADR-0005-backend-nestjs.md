# ADR-0005: Backend — NestJS API + worker

Status: Proposed · 2026-11-14

## Context
Need a structured TypeScript backend with clear module boundaries, OpenAPI support, and a long-running worker sharing domain code.

## Decision
NestJS for the API and worker (two entrypoints over the same domain modules). Keep modules thin; avoid unnecessary abstraction layers.

## Alternatives considered
- **Fastify/Hono + own structure** — lighter and faster to learn; conventions must be invented and enforced manually (riskier with AI-assisted code).
- **Next.js route handlers as the only backend** — fewer apps; no natural home for long-running jobs; couples mobile API to web deployment.
- **Other languages (Go, Elixir, Python)** — viable; lose type sharing with clients.

## Consequences
+ Consistent structure; DI aids testing; OpenAPI generation.
− Boilerplate; decorator-heavy code. Mitigated by guidelines.

## Solo-founder notes
Cost $0. Introduce P-2. Postpone GraphQL, CQRS, event sourcing.

## Related
[ARCHITECTURE_REVIEW.md](../ARCHITECTURE_REVIEW.md#23-nestjs-api--worker)
