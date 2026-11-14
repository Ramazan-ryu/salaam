# ADR-0020: REST + OpenAPI, contract-first

Status: Proposed · 2026-11-14

## Context
Mobile and web clients need a stable, typed API; AI-assisted development benefits from an explicit contract.

## Decision
REST/JSON API versioned under `/v1`, specified in OpenAPI before implementation of each endpoint; TypeScript client generated into `packages/api-client`; RFC 9457 error format; cursor pagination; contract tests in CI.

## Alternatives considered
- **GraphQL** — flexible client queries; more complexity in authorization and caching.
- **tRPC** — excellent DX for TS-only; weaker for public/web/third-party consumers and versioning.

## Consequences
+ Clear contracts, cacheable public endpoints, generated clients.
− Some endpoint proliferation; mitigated by the home widget descriptor endpoint.

## Related
[API_SPECIFICATION.md](../API_SPECIFICATION.md)
