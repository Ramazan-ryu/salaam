# Documentation Review — Phase 1

Status: Draft 0.1 · 2026-11-14 · Related: [README.md](./README.md), [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md)

## 1. Executive summary

Salaam is documented as a **trusted, avatar-first city companion for Baku**, built by one founder with Claude Code on a small budget. The package defines:

- **Product:** MVP "What's on in Baku" — verified events, places and cinema showtimes; avatar-first home (Companion Stage, with a Docked Companion fallback); save, reminders, invites; light social (friends, going/interested, follows); organizer portal; admin with a review queue. Feeds, communities, payments, 3D and transactional integrations stay out of the MVP, as you confirmed.
- **Delivery in three increments:** MVP-0 technical prototype with **synthetic users only**, so it needs no partnerships and no hosting decision; MVP-1 private beta (50–200 users); MVP-2 public beta.
- **AI City Intelligence:** a pipeline that works with any source. It has separate stages (collection, processing, extraction, matching, verification, publication, recommendation, notification) and a connector contract. Instagram is one connector: organizer-authorized accounts only, after Meta App Review. Evidence spans are mandatory, and a five-level automation ladder gives each source auto-approval only after it proves accurate, with audit sampling and automatic demotion on errors.
- **Avatar:** a full product and art spec: renderer-independent config, catalog, animation states, interaction model, Rive with a mandatory static fallback, a path to 3D, and production paths for solo v0 and freelance v1.
- **Architecture:** modular monolith (NestJS API + worker); one Next.js web app (public, app, organizer, admin); Expo mobile; PostgreSQL + PostGIS + pg_trgm; pg-boss jobs (no Redis); S3-compatible storage; MapLibre with self-hosted tiles first; AI model gateway; in-house auth (email code + Google + Apple). Hosting stays portable. Twenty ADRs are recorded as Proposed.
- **Costs:** Scenario A ≈ $20–35/month; B ≈ $45–190/month plus about $25 one-time plus legal; C ≈ $150–450/month excluding people and art. LLM usage is a few dollars a month. **Human curation time is the main cost**, budgeted at ≤8 h/week in the private beta.
- **Legal:** 13 questions for Azerbaijani counsel (QL-01–QL-13). The most important is whether Salaam falls under the social-network age rules adopted in August 2026. The default age policy is **18+** until counsel answers.
- **Roadmap:** P-0 (validation, no code) through P-8. Expected effort is ~150–170 dev-days, about 11–12 months at ~20 h/week (assumed capacity).

## 2. Required files check

| Check | Result |
|---|---|
| All 24 required documents exist | ✓ (checked by script 2026-11-14) |
| Additional documents | PRODUCT_DECISIONS, PARTNERSHIP_STRATEGY, LEGAL_AND_HOSTING_OPTIONS, DOCUMENTATION_REVIEW, README index |
| ADRs with index and status tracking | ✓ 20 ADRs + [adr/README.md](./adr/README.md) |
| Internal links & section anchors | ✓ 0 broken after this file was added |
| Identifiers (F, FR, NFR, D, QL, R, DS, ADR) defined wherever referenced | ✓ 0 undefined references |

## 3. Cross-document consistency — contradictions found

| # | Finding | Resolution |
|---|---|---|
| C-1 | Phase 0 proposed a separate admin app; Phase 1 uses one Next.js app | Resolved: documented as an explicit revision in [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md#1-changes-versus-the-phase-0-proposal) and ADR-0004 |
| C-2 | Phase 0 listed 6 skin tones; avatar spec now specifies 8 | Resolved: [AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md) is authoritative |
| C-3 | Original status list mixed trust and lifecycle | Resolved: ADR-0019 + mapping table in [GLOSSARY.md](./GLOSSARY.md) |
| C-4 | Public web pages appear in P-3 (basic) in the roadmap but P-4 in the feature catalog | Minor: P-3 delivers basic pages, P-4 polishes SEO/OG. **Open:** align the catalog phase column when approved |
| C-5 | Phase 0 success target was ≥150 events/week; Phase 1 sets ≥100 for MVP-1 and ≥150 for MVP-2 | Intentional: lower bar for the solo private beta |
| C-6 | Phase 0 proposed age 16+ as a possible default; Phase 1 recommends 18+ | Changed because of the August 2026 rules (D-03) |

No remaining contradictions affect scope, architecture or cost.

## 4. Missing architectural decisions (to resolve in P-1/P-2)

| Decision | Where to record | Phase |
|---|---|---|
| CI provider (GitHub Actions assumed, since the repository is on GitHub) | New ADR | P-2 |
| Auth library | ADR-0010 update after spike S-AUTH | P-2 |
| ORM / query builder | New ADR | P-2 |
| Email delivery provider | New ADR | P-2 |
| Error tracking and uptime monitoring | New ADR | P-2 |
| Reverse proxy / TLS and backup tooling | New ADR | P-2 |
| Static avatar render: on device or server | ADR-0012 update after spike S-AV1 | P-1 |
| Product analytics approach | New ADR | P-6 |
| Hosting provider and region | ADR-0017 → new ADR after counsel | Before MVP-1 |

## 5. MVP scope review

- The scope matches every confirmed constraint (solo, small budget, Baku, three languages, three platforms, human verification, no feed/payments/3D/transactions).
- The prototype (MVP-0) depends on no partnership and no real personal data, so partnerships don't block it.
- **Largest scope risks:** P-4 (mobile + avatar) is the biggest phase. If it overruns, reduce avatar slots (v0 already reduced) and postpone the map view polish before cutting trust features.
- **Candidates to cut first if capacity is lower:** web logged-in app parity, tonight digest, organizer stats, cinema module (keep cinemas as places with links).

## 6. Cost review

- Every price carries a source and the date checked. Most are from secondary sources and marked **Reported**. R2 limits and Expo plan details are from official docs, and the Rive export policy is from Rive's own blog.
- No number was given where no reliable price exists (Azerbaijani cloud, freelancers, counsel): marked **Quote needed**.
- No paid service is mandatory for Scenario A beyond the development tool. Apple's $99/year becomes necessary for iOS push and Sign in with Apple testing.
- Sensitivity: the hosting price rises reported in 2026 and the Claude subscription tier are the main swing factors. LLM spend is capped in the gateway.

## 7. Security & privacy review

- Covered: STRIDE threat model, auth options comparison, authorization matrix testing, location privacy (coarse geohash, never stored), consent records per purpose, data minimisation in LLM calls, AI-specific risks (prompt injection, hallucination, excessive permissions), retention table, incident response, moderation.
- **Gaps to close before MVP-1:** counsel answers QL-01–QL-04 and QL-10; privacy policy and terms; DPIA-style assessment (optional but recommended); provider terms review for no-training on API data; admin 2FA in place.
- **Repository hygiene:** the GitHub personal access token pasted in chat on 2026-11-14 must be revoked and regenerated. It was used only for the initial push and was not saved in the repository's configuration.

## 8. Decisions requiring your approval

Ordered by impact on architecture, MVP scope and cost. Details and options are in [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md).

| Priority | ID | Decision | Recommended default |
|---|---|---|---|
| 1 | — | Approve this documentation package as the Phase 1 baseline | Approve, with comments |
| 2 | D-04 | Initial segment | Young adults 18–30 in Baku; English completeness for expats/tourists via web |
| 3 | D-03 | Minimum age | 18+ until counsel answers QL-01 |
| 4 | D-02 | Hosting jurisdiction | Defer; synthetic data until counsel answers; request AZ cloud quotes in P-1 |
| 5 | D-05 | Sign-in methods | Email code + Google + Apple; phone OTP deferred |
| 6 | D-07 | Platform sequence | Web admin/portal → Android test → iOS TestFlight → public web pages |
| 7 | D-08 | Avatar art path | v0 founder-made simple style; v1 freelance later |
| 8 | D-06 | Home layout | Concept A (Companion Stage), Concept C behind a flag; confirm after prototype test |
| 9 | D-09 | Instagram path | Owned-account connector only, after Meta App Review |
| 10 | D-10 | Curation time budget | ≤8 h/week in private beta |
| 11 | D-13 | Claude plan | Pro, upgrade to Max 5x only if blocked |
| 12 | D-14 | Map tiles | Self-hosted PMTiles (spike), MapTiler paid as fallback |
| 13 | D-15 | LLM provider | Claude Haiku 5.5 primary + one fallback provider |
| 14 | D-16, D-17, D-18 | Assistant deferred; labelled machine translation; coarse location | As recommended |
| 15 | D-01, D-20 | Name/domain; legal entity & store accounts | Working name + generic domain; decide entity before public listing |
| 16 | ADR-0001…0020 | Architecture decisions | Accept as Proposed; spike-gated ADRs accepted after P-1 |
| — | Q-01 | Your real weekly capacity | Needed to recalibrate the roadmap |

## 9. Stop condition

Documentation and the architecture review are complete. **No implementation has started.** No code, packages, frameworks, migrations or external service configuration have been created. Waiting for your explicit approval.
