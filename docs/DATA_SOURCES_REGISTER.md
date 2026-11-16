# Data Sources Register

Status: Draft 0.2 · 2026-11-16 (Phase 1.1 corrections) · Related: [INTEGRATION_RESEARCH.md](./INTEGRATION_RESEARCH.md), [AI_CITY_INTELLIGENCE.md](./AI_CITY_INTELLIGENCE.md), [CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md)

## 1. Purpose and rule

This register is the **legal and operational gate** for every information source. **No connector may run against a source that does not have an `Approved` record here.** The register is mirrored in the database (`sources` table, see [DATABASE_DESIGN.md](./DATABASE_DESIGN.md)) and editable in the admin console (F-073); this document holds the initial entries and the template.

## 2. Record template

| Field | Description |
|---|---|
| `DS-id` | Stable identifier |
| Name | Human-readable name |
| Owner / publisher | Who controls the source |
| Connector type | One of the types in [AI_CITY_INTELLIGENCE.md](./AI_CITY_INTELLIGENCE.md#4-connector-types) |
| Integration class | Type 1–5 |
| Legal basis | Owner consent / partner agreement / published terms permit / open licence |
| Evidence | Link or document reference (consent record, agreement, terms URL + date read) |
| Allowed frequency | Max collection frequency permitted (and chosen) |
| Rate limits | Known provider limits |
| Content allowed to store | e.g. text only / text + image / metadata only |
| Retention | How long raw items may be stored |
| Display rules | What may be shown; attribution text; link-back requirement |
| Default trust tier | T1–T5 ([GLOSSARY.md](./GLOSSARY.md#status-model-two-independent-axes--availability)) |
| Automation level | L0–L4 ([CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md#5-progressive-automation-ladder)) |
| Personal data? | Whether the source may contain personal data; handling notes |
| Removal procedure | How the owner can withdraw; SLA |
| Status | `Proposed` · `Under review` · `Approved` · `Suspended` · `Retired` |
| Reviewed by / date | Who approved and when |

## 3. Initial entries

**Automation levels:** through MVP-1 every source operates at L0/L1, with every item human-approved (D-25). "L1 → L2" means the source may become eligible after MVP-1 if it meets the statistical evidence rules in [CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md#5-progressive-automation-ladder).

| DS-id | Name | Connector type | Class | Legal basis | Trust | Auto level (start) | Status |
|---|---|---|---|---|---|---|---|
| DS-001 | Curator manual entry | `manual_entry` | — | Curator verifies facts from public information; attribution to original source | T1–T4 per evidence | n/a (human) | Approved (internal) |
| DS-002 | Organizer portal submissions | `organizer_portal` | — | Organizer terms + rights confirmation for images | T3 | L1 | Proposed (needs organizer terms, QL-07) |
| DS-003 | Synthetic seed data | `manual_entry` | — | Internal, non-public | — | — | Approved (MVP-0 only, never shown publicly) |
| DS-010 | Organizer-connected Instagram professional accounts | `instagram_owned_account` | Type 1 | Owner OAuth consent + Meta terms | T1 | L1 → L2 per account | Proposed (needs Meta App Review; QL-07) |
| DS-011 | Instagram Business Discovery (unconnected accounts) | `instagram_business_discovery` | Type 1 (gated) | Meta terms — **not established** | T5 | L0 | **Not approved** — pending legal review |
| DS-020 | Telegram channels (bot added by channel owner) | `telegram_channel_bot` | Type 1 | Owner adds bot = consent [ASSUMPTION] | T1 | L1 | Proposed — research mechanics/terms |
| DS-030 | Official cultural-venue calendars (ICS/RSS/JSON-LD) | `ics_feed` / `rss_feed` / `structured_web` | Type 3 | Per-site terms & robots — case by case | T1 | L1 → L2 | Proposed — one record per venue |
| DS-040 | Cinema showtimes — curated | `manual_entry` | Type 4 | Facts verified from public pages; link-out | T1 | n/a | Proposed — confirm site terms (QL-07) |
| DS-041 | Cinema showtime feed (partner) | `partner_feed` | Type 2 | Agreement | T2 | L2 | Future |
| DS-050 | iTicket.az feed (partner) | `partner_feed` | Type 2 | Agreement | T2 | L2 | Future |
| DS-060 | OpenStreetMap places (Azerbaijan extract) | `osm_import` | Type 3 | ODbL | T4 (base data) | L0 for publication (curator confirms) | Proposed — QL-09 |
| DS-070 | Weather | `weather_api` | Type 1 | Provider licence [UNVERIFIED] | n/a | n/a | Proposed |
| DS-080 | Organizer email forwarding inbox | `email_ingest` | — | Organizer sends voluntarily | T3 | L1 | Next |
| DS-090 | Community submissions (users) | `user_submission` | — | User terms | T4 | L0 | Later |

## 4. Approval checklist (per new source)

1. Owner/publisher identified; contact recorded.
2. Terms of service / robots / licence read; URL and date recorded; summary of permitted use.
3. Personal-data assessment: does content include people's data (faces, names of private persons)? Minimisation plan.
4. Retention and display rules set; attribution text written in az/ru/en.
5. Allowed frequency set ≤ permitted; rate limits configured in connector.
6. Removal procedure defined (owner can request takedown; SLA 72 h for MVP).
7. Default trust tier and starting automation level set (L0 or L1).
8. Founder approves; date recorded. For partner agreements: counsel-reviewed template.

## 5. Suspension triggers

- Owner withdraws consent or requests removal → suspend immediately; purge raw items; unpublish or detach content per agreement.
- Terms change → suspend until re-review.
- Audit precision below threshold → demote automation level ([CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md#5-progressive-automation-ladder)).
- Repeated collection errors (≥5 consecutive) → auto-pause, alert founder.
