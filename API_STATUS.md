# API & Integration Status

Integration statuses: CONNECTED · VERIFIED · AVAILABLE_WITH_CREDENTIALS · PARTNER_ACCESS_REQUIRED · FIRST_PARTY · MOCK_ONLY · BLOCKED · UNAVAILABLE.

## SALAAM-owned endpoints (all FIRST_PARTY)

| Endpoint | Auth | Status | Tests |
|---|---|---|---|
| `GET /v1/health` | public | TESTED | smoke |
| `GET /v1/discover` (lens, date, category, district, radiusKm; `X-Approx-Area`) | public | TESTED | invariants, review-flow |
| `GET /v1/occurrences/:id` | public | TESTED | review-flow |
| `GET /v1/categories`, `GET /v1/cities/:slug/districts`, `GET /v1/places/:id` | public | IMPLEMENTED | indirect |
| `GET/POST /v1/admin/places…` | curator | TESTED | invariants |
| `GET/POST /v1/admin/sources`, `PATCH …/status`, `PATCH …/automation-level` | curator / admin | TESTED (L2+ refused) | review-flow |
| `GET/POST /v1/admin/events` | curator | TESTED | invariants |
| `PATCH /v1/admin/occurrences/:id/lifecycle` | curator | TESTED | review-flow |
| `POST /v1/admin/organizers` | curator | TESTED | review-flow |
| `POST/GET /v1/organizer/:orgId/submissions` | organizer member | TESTED | review-flow |
| `GET /v1/admin/review-tasks`, `GET :id`, `POST :id/decision` | curator | TESTED | review-flow |
| `/v1/auth`, `/v1/me`, saved items, reports | — | NOT_STARTED | — |
| `/v1/openapi.json`, Swagger UI | — | NOT_STARTED (TB-05) | — |

## Data sources / external providers

| Source | Status | Notes |
|---|---|---|
| DS-001 Curator manual entry from official links | FIRST_PARTY | Every item has a source URL |
| DS-002 Organizer portal | FIRST_PARTY | Approved in dev seed only; production needs organizer terms (BL-04) |
| DS-003 Synthetic seed | MOCK_ONLY | `is_synthetic`, hidden in production, labelled "Nümunə" |
| Maps (OSM tiles / MapLibre) | UNAVAILABLE (not integrated) | Spike S-MAP (TB-07); event page links out to openstreetmap.org |
| Cinema, iTicket, Wolt, Bolt, retailers | not integrated | Per docs/INTEGRATION_RESEARCH.md; no public APIs verified → partner access or first-party submissions |
