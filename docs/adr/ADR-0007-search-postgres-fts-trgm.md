# ADR-0007: Search — PostgreSQL full-text + pg_trgm

Status: Proposed · 2026-11-14 · Gate: Q-09 (Azerbaijani search quality)

## Context
Users search in Azerbaijani, Russian and English with typos and mixed scripts; matching also needs fuzzy comparison of titles and place names.

## Decision
Generated `tsvector` columns combining `russian`, `english` and `simple` (for Azerbaijani) configurations, plus trigram (pg_trgm) indexes on normalized names/titles (lower-cased, diacritics folded for matching, e.g. ə→e as an *additional* key). Ranking blends text rank, trigram similarity, time proximity and verification status.

## Alternatives considered
- **Meilisearch / Typesense** — better relevance tuning and typo tolerance; one more service to run and sync.
- **OpenSearch/Elasticsearch** — powerful; heavy for a laptop and a small VM.

## Consequences
+ No extra infrastructure; transactional consistency.
− Azerbaijani has no stemmer in core PostgreSQL [ASSUMPTION — verify]; quality measured on gold-set titles in P-3.

## Solo-founder notes
Cost $0. Introduce P-3. Revisit when search quality complaints or volume require a dedicated engine.

## Related
[DATABASE_DESIGN.md](../DATABASE_DESIGN.md#7-key-queries-and-indexes)
