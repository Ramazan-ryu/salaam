# ADR-0020: REST + OpenAPI, contract-first

Status: Accepted (implemented 2026-11-17) · 2026-11-14

Implementation: OpenAPI 3.1 generated from zod (`@asteasolutions/zod-to-openapi`), committed as `docs/openapi.json`; web types via `openapi-typescript`; drift and route/access/response contract tests in CI. Clients are type-generated rather than full generated SDKs (lighter for a solo team).

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
