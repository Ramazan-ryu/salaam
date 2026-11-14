# ADR-0018: Localization strategy (az / ru / en)

Status: Proposed · 2026-11-14 · Decision D-17

## Context
[CONFIRMED] Azerbaijani, Russian and English from the beginning. Content arrives in one language (often az or ru, sometimes mixed); UI must be fully localized.

## Decision
- **UI:** ICU message catalogs in a shared `i18n` package for mobile and web; no hard-coded strings; pseudo-locale testing.
- **Content:** localized fields stored as JSONB keyed by locale with `original_locale` and per-locale translation metadata (method, model, time). Fallback chain: requested → original → az → ru → en.
- **Machine translation** only for verified content; labelled "translated" in UI; structured fields (times, prices, places) never translated as text.
- Organizer-provided translations preferred over machine translation.

## Alternatives considered
- Separate translations table per entity — more normalized; heavier queries for few fields.
- Translate at request time — latency and cost; caching complexity.

## Consequences
+ Simple reads; clear provenance of translations.
− Adding many more locales later may justify a translations table.

## Related
[UX_UI_SPECIFICATION.md](../UX_UI_SPECIFICATION.md#8-localization), [DATABASE_DESIGN.md](../DATABASE_DESIGN.md#1-conventions)
