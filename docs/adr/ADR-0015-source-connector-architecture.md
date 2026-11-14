# ADR-0015: Source-independent connector architecture

Status: Proposed · 2026-11-14 · Decision D-09

## Context
The owner requires that AI City Intelligence be source-independent and extensible; Instagram must not be the only source, and its access is restricted.

## Decision
A connector contract (`describe`, `validateConfig`, `collect`, `toRawItem`, `health`) produces a common raw-item shape. Sources are data (DS records in the `sources` table) bound to a connector type, with schedule, permitted frequency, retention, attribution, trust tier and automation level. All later stages (processing, extraction, matching, verification, publication) are independent of the source type. A connector cannot be enabled for a source without an `Approved` register record.

## Alternatives considered
- **Per-source custom pipelines** — fast for the first source; unmaintainable.
- **Generic web scraping** — rejected (legal/ethical rules).

## Consequences
+ New sources by configuration; new source types by one connector.
− Up-front design of the raw-item shape and policy fields.

## Solo-founder notes
Introduce P-3 with `manual_entry`, `organizer_portal`, `ics_feed`, `rss_feed`, `osm_import`; `instagram_owned_account` in P-5 if Meta approves.

## Related
[AI_CITY_INTELLIGENCE.md](../AI_CITY_INTELLIGENCE.md#4-connector-types), [DATA_SOURCES_REGISTER.md](../DATA_SOURCES_REGISTER.md)
