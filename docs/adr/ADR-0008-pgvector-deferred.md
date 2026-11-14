# ADR-0008: pgvector deferred

Status: Proposed · 2026-11-14 · Gate: P-5 dedup metrics

## Context
Embeddings could help cross-language duplicate detection and future recommendations, but add cost, pipeline steps and evaluation work.

## Decision
Do not use embeddings in the MVP initially. Rely on deterministic matching (place, time window, trigram titles across all locale variants). Introduce pgvector (inside the same PostgreSQL) only if P-5 measurements show duplicate recall/precision below target (e.g. recall <90% on labelled duplicate pairs).

## Alternatives considered
- **pgvector from day one** — ready capability; premature.
- **External vector database** — unnecessary for this scale.

## Consequences
+ Simpler pipeline, lower cost.
− Some cross-language duplicates may need manual merge initially.

## Solo-founder notes
Cost $0 until used. Introduce: only on evidence.

## Related
[AI_CITY_INTELLIGENCE.md](../AI_CITY_INTELLIGENCE.md#7-matching-and-deduplication)
