# Glossary

Status: Draft 0.1 · 2026-11-14 · Related: [AI_CITY_INTELLIGENCE.md](./AI_CITY_INTELLIGENCE.md), [DATABASE_DESIGN.md](./DATABASE_DESIGN.md)

## Product terms

| Term | Definition |
|---|---|
| **Salaam** | Working product name (provisional, not final branding). |
| **Avatar** | The user's customizable animated 2D character; the central identity and interface companion. Not a profile picture. See [AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md). |
| **Avatar config** | Versioned, renderer-independent data describing an avatar (body, skin tone, hair, outfit, accessories). Rendered by Rive today, possibly 3D later. |
| **Companion Stage** | Home layout where the avatar occupies the top of the screen and delivers suggestions (Concept A). |
| **Docked Companion** | Home layout with a content-first feed and the avatar docked in a corner (Concept C). |
| **Place** | Any physical location: venue, cinema, café, park, bike station, landmark. One table, typed by `kind`. |
| **Event** | A canonical happening (concert, exhibition, screening series). Has one or more **occurrences**. |
| **Occurrence** | A specific date/time instance of an event (e.g. one cinema showtime, one concert night). |
| **Organizer** | A business or person that publishes events (venue, promoter, gallery). May have a verified organizer account. |
| **Curator** | A human (initially the founder) who reviews and approves content in the admin console. |
| **Plan** | A user's saved set of occurrences, possibly shared with friends (post-MVP). |
| **Going / Interested** | Attendance intents a user can set on an occurrence, with a visibility setting. |
| **Digest** | A batched notification (e.g. "Tonight in Baku") sent at most once per configured window. |
| **Notification budget** | Maximum non-transactional notifications per user per day (default 2). |

## Data and pipeline terms

| Term | Definition |
|---|---|
| **Source** | A registered origin of information (e.g. a venue's own Instagram account, an organizer portal, a partner feed). Each has a `DS-nnn` record in [DATA_SOURCES_REGISTER.md](./DATA_SOURCES_REGISTER.md). |
| **Connector** | A pluggable adapter that collects items from one *type* of source (e.g. `rss_feed`, `instagram_owned_account`). |
| **Source item** | One raw unit collected from a source (a post, a feed entry, a form submission). Stored temporarily with retention limits. |
| **Extraction** | Turning a source item into structured candidate fields (title, start time, venue…). Done by deterministic parsers and/or an LLM. |
| **Field provenance** | Per-field record of where a value came from, the evidence span, method and confidence. |
| **Resolution / matching** | Linking extracted entities to existing places/organizers/events; finding duplicates. |
| **Review task** | A unit of human work in the review queue (approve, edit, merge, reject). |
| **Auto-approval policy** | Source-specific rule that publishes items without human review when conditions are met. |
| **Automation level (L0–L4)** | Per-source autonomy level; see [CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md#5-progressive-automation-ladder). |
| **Audit sample** | Random share of auto-approved items re-checked by a human to measure real precision. |
| **Gold set** | Hand-labelled dataset of real announcements used to evaluate extraction quality. |
| **Critical fields** | Fields whose errors harm users: title, start date/time, place, lifecycle (e.g. cancelled), ticket URL, price (if shown). |
| **Model gateway** | Thin internal interface through which all LLM calls pass (routing, budgets, logging, fallback). |

## Status model (two independent axes + availability)

Phase 0 identified that the originally proposed status list mixed different dimensions. Salaam stores them separately:

| Axis | Field | Values |
|---|---|---|
| **Trust tier** (best evidence source) | `trust_tier` | `T1_official` (organizer/venue's own channel or site) · `T2_partner` (authorized feed) · `T3_organizer_submitted` · `T4_community_submitted` · `T5_ai_extracted` |
| **Verification status** | `verification_status` | `pending_review` · `auto_approved` · `staff_verified` · `rejected` |
| **Lifecycle** | `lifecycle_status` | `scheduled` · `postponed` · `cancelled` · `ended` |
| **Availability** | `availability` | `unknown` · `available` · `sold_out` · `unavailable` |

Mapping from the owner's original status list:

| Original status | Salaam representation |
|---|---|
| Officially verified | `trust_tier=T1_official` + `verification_status ∈ {auto_approved, staff_verified}` |
| Provider sourced | `trust_tier=T2_partner` |
| Community submitted | `trust_tier=T4_community_submitted` |
| AI extracted — pending verification | `trust_tier=T5_ai_extracted` + `verification_status=pending_review` (never public) |
| Partially verified | Event published, but one or more non-critical fields carry `field_verified=false` (UI shows field-level "unconfirmed") |
| Expired | `lifecycle_status=ended` |
| Cancelled | `lifecycle_status=cancelled` |
| Unavailable | `availability=unavailable` (or `sold_out`) |

**Public badge rules** (UI): "Verified" = staff_verified or auto_approved from T1/T2; "From organizer" = T3 approved; "Unconfirmed details" = any critical field not verified. Items with `pending_review` are never shown to users.

## Integration classification (from the original brief)

| Type | Meaning |
|---|---|
| Type 1 | Official API integration |
| Type 2 | Authorized partner integration |
| Type 3 | Permitted public information aggregation |
| Type 4 | External link / user handoff |
| Type 5 | Not currently feasible |

## Technical terms

| Term | Definition |
|---|---|
| **Modular monolith** | One deployable backend with strictly separated internal modules. |
| **PostGIS** | PostgreSQL extension for geospatial data and queries. |
| **pg_trgm** | PostgreSQL extension for trigram fuzzy text matching. |
| **pgvector** | PostgreSQL extension for vector embeddings (deferred, [ADR-0008](./adr/ADR-0008-pgvector-deferred.md)). |
| **pg-boss** | Job queue library that stores jobs in PostgreSQL ([ADR-0009](./adr/ADR-0009-background-jobs-pg-boss.md)). |
| **Rive** | Interactive animation tool and open-source runtimes ([ADR-0012](./adr/ADR-0012-avatar-rive-and-avatar-as-data.md)). |
| **MapLibre** | Open-source map rendering library ([ADR-0013](./adr/ADR-0013-maps-maplibre-osm.md)). |
| **PMTiles** | Single-file map tile archive that can be served from object storage. |
| **Dev build (Expo)** | A custom native build of the app, required for native modules not in Expo Go. |
| **EAS** | Expo Application Services (cloud builds/updates). |
| **Geohash** | Encoding of a location into a grid cell string; precision controls cell size. Used to coarsen location. |
| **OIDC** | OpenID Connect — standard protocol used by Google/Apple sign-in. |
| **RFC 9457** | "Problem Details for HTTP APIs" error format. |
