# Implementation Status (founder dashboard)

Status reflects acceptance criteria met, not files existing. No percentages on purpose.

| Area | Status | What works | What's missing |
|---|---|---|---|
| Overall | Vertical slice reached (local) | Visitor → home → discover → event; staff → review → publish | Real sign-in, mobile app, map, production hosting |
| Product design | DESIGNED (partial) | Concept A implemented; screen inventory + journeys in docs | Design-token package, component specs (TB-14), final avatar art |
| Frontend — web | TESTED | Public home/discover/details in az/ru/en, responsive; staff portal | Map view, saved items, profile (need auth) |
| Frontend — mobile | NOT_STARTED | — | Expo app (TB-10) |
| Backend | TESTED | Catalog, sources, submissions, review, publication, discovery, audit | Auth, reports, notifications |
| Database | TESTED | PostGIS schema, 2 migrations, invariants as constraints, backups | Users/sessions tables (with auth) |
| API & integrations | IMPLEMENTED | SALAAM-owned REST `/v1`; no external providers (all FIRST_PARTY or MOCK_ONLY) | OpenAPI file (TB-05); providers per INTEGRATION_RESEARCH |
| AI | NOT_STARTED (by decision) | Companion line is rule-based | AI ingestion after MVP-1 gates (D-25) |
| Docker | TESTED | Images build and the full stack starts healthy in CI with smoke tests | Run once on the founder's machine (optional) |
| Security | Partial | Validation, RBAC stand-in, audit, location privacy, synthetic isolation, 127.0.0.1 binds | Real auth, rate limits (TB-11), dependency scanning in CI |
| Testing | TESTED | 31 integration tests + visual screenshots | E2E assertions (TB-12) |
| Release readiness | NOT READY | — | Gate 7 items (see PROJECT_STATE.md) |
| Blockers | 4 open | — | see BLOCKERS.md |
