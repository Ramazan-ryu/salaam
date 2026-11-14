# ADR-0001: Modular monolith

Status: Proposed · 2026-11-14 · Deciders: product owner

## Context
One developer, small budget, many domains (identity, city data, AI pipeline, social, notifications). Microservices would multiply deployment, monitoring and data-consistency work.

## Decision
Build one backend codebase deployed as two processes (API and worker) with strictly separated internal modules (bounded contexts). Modules own their tables, expose service interfaces, and communicate side effects through an outbox of domain events. Import boundaries are enforced by lint rules.

## Alternatives considered
- **Microservices** — independent scaling; far too much operational work now.
- **Unstructured monolith** — fastest start; becomes hard to change and to extract later.
- **Serverless functions** — low idle cost; poor fit for long-running pipeline jobs and local development.

## Consequences
+ Simple deployment, transactions within one database, easy local setup.
+ Later extraction of a module (e.g. intelligence pipeline) is possible.
− Discipline required to keep boundaries; one database is a shared failure point.

## Solo-founder notes
Cost $0 beyond hosting. Ops: one image, two processes. Introduce: P-2. Postpone: service extraction until a module has clearly different scaling or isolation needs.

## Related
[SYSTEM_ARCHITECTURE.md](../SYSTEM_ARCHITECTURE.md#4-c4-level-3--apiworker-modules-bounded-contexts)
