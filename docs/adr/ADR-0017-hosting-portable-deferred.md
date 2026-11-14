# ADR-0017: Portable hosting; jurisdiction deferred

Status: Proposed · 2026-11-14 · Depends on QL-04, QL-05 · Decision D-02

## Context
[CONFIRMED] Hosting provider and location must not be finalized yet. Azerbaijani rules on cross-border transfer may require in-country storage of personal data; public pricing for local cloud was not found.

## Decision
- Everything runs in containers on any Linux host; database is plain PostgreSQL (+PostGIS); storage via S3 API; no proprietary BaaS dependencies in core flows.
- MVP-0 uses **synthetic users only**; real personal data is processed only after the hosting decision (gate G6).
- Code separates public city data from personal data at module/schema level to keep a hybrid deployment possible.

## Alternatives considered
- Choose a cloud now — faster setup; risk of forced migration.
- Fully managed BaaS — fastest; lock-in and residency uncertainty.

## Consequences
+ Decision can be made with legal facts; migration cost minimal.
− Slightly more self-managed work (backups, TLS, updates).

## Related
[LEGAL_AND_HOSTING_OPTIONS.md](../LEGAL_AND_HOSTING_OPTIONS.md)
