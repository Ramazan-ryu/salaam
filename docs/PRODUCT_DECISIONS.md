# Product Decisions Log

Status: Draft 0.1 · 2026-11-14 · Related: [DOCUMENTATION_REVIEW.md](./DOCUMENTATION_REVIEW.md), [adr/README.md](./adr/README.md), [RISKS_AND_OPEN_QUESTIONS.md](./RISKS_AND_OPEN_QUESTIONS.md)

Each decision lists why it matters, options, a recommended default, consequences, and whether **owner approval is required**. Nothing here is final until approved. Architectural decisions are additionally recorded as ADRs.

| ID | Decision | Owner approval | Recommended default | Blocking phase |
|---|---|---|---|---|
| D-01 | Product name & domain | **Yes** | Keep "Salaam" as working name; register an inexpensive generic TLD for development; defer `.az` | P-6 |
| D-02 | Hosting jurisdiction | **Yes** (after counsel) | Defer; build portable; no real personal data until decided | MVP-1 |
| D-03 | Minimum user age | **Yes** (after counsel) | 18+ for MVP | MVP-1 |
| D-04 | Initial validation segment | **Yes** | Young adults 18–30 in Baku | P-0 |
| D-05 | Sign-in methods | **Yes** | Email OTP + Google + Apple; phone OTP deferred | P-2 |
| D-06 | Home layout | **Yes** (after test) | Concept A (Companion Stage), Concept C behind flag | P-4 |
| D-07 | Platform sequence | **Yes** | Admin web → Android beta → iOS TestFlight → public web pages | P-2 |
| D-08 | Avatar art production path | **Yes** | v0 by founder in Rive (simple style); v1 freelance when budget allows | P-4 |
| D-09 | Instagram integration path | **Yes** | Owned-account connection only, after Meta App Review; no Business Discovery until legal review | P-5 |
| D-10 | Founder curation time budget | **Yes** | ≤8 h/week in private beta | MVP-1 |
| D-11 | Social scope for MVP | Confirmed in brief; details need approval | Friends, going/interested, invites, follows, block/report | P-7 |
| D-12 | Monetization | No (deferred) | None in MVP; sponsored content policy pre-defined | — |
| D-13 | Claude plan for development | **Yes** | Start on Pro; upgrade to Max 5x only if limits block progress | P-2 |
| D-14 | Map tiles provider | **Yes** | Self-hosted Protomaps/PMTiles extract on object storage (spike first); MapTiler paid plan as fallback | P-4 |
| D-15 | LLM provider(s) | **Yes** | Anthropic Claude Haiku 5.5 primary; one alternative provider configured as fallback | P-5 |
| D-16 | AI assistant in MVP | **Yes** | Not in MVP; optional flagged experiment only after MVP-1 | — |
| D-17 | Translation policy | **Yes** | Machine translation of verified content, labelled "translated"; organizer-provided text preferred | P-5 |
| D-18 | Location precision | Recommended; approval advised | Coarse (≈1 km cell), request-scoped, never stored | P-4 |
| D-19 | Deals module | No (deferred) | Postponed until an authorized source exists | — |
| D-20 | Legal entity & store accounts | **Yes** | Decide individual vs organization developer accounts before store submission | P-6 |

---

### D-01 Product name & domain
- **Why:** Brand, store listings, domain cost. `.az` registrations through international registrars start around $243/year (checked 2026-11-14, https://domainoffer.net/tld/az); local registrars may differ [UNVERIFIED].
- **Options:** (a) keep "Salaam" + `.az` now; (b) keep working name + cheap generic TLD; (c) rename before launch.
- **Default:** (b). Trademark search before public beta.
- **Consequences:** Rename later costs store-listing changes and links; mitigated by keeping a neutral bundle ID.

### D-02 Hosting jurisdiction
- **Why:** Azerbaijani personal-data rules on cross-border transfer may affect where user data can live. Details in [LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md).
- **Options:** Azerbaijan hosting; international region; hybrid (personal data local, public content/CDN global).
- **Default:** decide after counsel; MVP-0 runs with synthetic users only.
- **Consequences:** Architecture must stay portable ([ADR-0017](./adr/ADR-0017-hosting-portable-deferred.md)).

### D-03 Minimum user age
- **Why:** In August 2026 Azerbaijan adopted amendments restricting social-network accounts for under-16s and requiring parental consent for 16–18 [VERIFIED 2026-11-14 via news and law-firm summaries; see LEGAL doc]. Whether Salaam is in scope is a legal question (QL-01). Apple/Google age ratings also apply.
- **Options:** 18+; 16+ with parental consent flow; 13+ (platform minimum).
- **Default:** 18+ for MVP (simplest, lowest risk).
- **Consequences:** Excludes some students; revisit with counsel.

### D-04 Initial validation segment — see [PRODUCT_DISCOVERY.md](./PRODUCT_DISCOVERY.md#2-user-segments).

### D-05 Sign-in methods
- **Why:** Conversion vs cost vs compliance. App Store guideline 4.8 requires an equivalent privacy-focused login option (Sign in with Apple satisfies it) when a third-party login like Google is offered; account deletion is required for apps with account creation (guideline 5.1.1(v)).
- **Options compared:** see [SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md#3-authentication-options-compared).
- **Default:** Email OTP + Google + Apple. Phone OTP deferred: SMS to Azerbaijani networks costs roughly $0.25–$0.47 per message on one major provider (Plivo, checked 2026-11-14).
- **Consequences:** Need an email delivery provider; Apple Developer membership needed before iOS testing.

### D-06 Home layout — Concept A vs C, decided by prototype test (A4). See [UX_UI_SPECIFICATION.md](./UX_UI_SPECIFICATION.md#3-avatar-first-home--alternative-layouts).

### D-07 Platform sequence
- **Why:** Solo capacity; store requirements. Google Play personal developer accounts created after 13 Nov 2023 must run a closed test with at least 12 testers for 14 consecutive days before production (reported by https://ilab.md, checked 2026-11-14 — confirm in Play Console).
- **Default:** (1) web admin + organizer portal first (needed to curate), (2) Android internal/closed testing, (3) iOS TestFlight, (4) public web event pages before public beta.
- **Consequences:** Recruit ≥12 Android testers early (fits P-0 interviewees).

### D-08 Avatar art production path — see [AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md#10-production-scenarios).

### D-09 Instagram integration path — see [INTEGRATION_RESEARCH.md](./INTEGRATION_RESEARCH.md#21-instagram--meta).

### D-10 Founder curation time
- **Why:** Human verification is accepted ([CONFIRMED]) but must be sustainable.
- **Default:** ≤8 h/week in MVP-1; automation ladder targets ≤6 h by MVP-2 ([CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md#8-solo-founder-workload-model)).

### D-11 Social scope — friends, invites, going/interested (default visibility **friends**), follows, block/report. Data model reserves extension points for groups ([DATABASE_DESIGN.md](./DATABASE_DESIGN.md#6-social-extension-points)).

### D-12 Monetization (deferred)
- **Policy now:** any future sponsored item must be visibly labelled "Sponsored", never alter trust badges, and never be sent as a push without explicit opt-in.
- Options for later: sponsored placements, organizer subscriptions/analytics, affiliate links (only with provider programmes), premium avatar items. Each needs legal review (advertising/consumer law).

### D-13 Claude plan for development
- Pro is $20/month ($17/month billed annually) and includes Claude Code; Max is $100 (5x) or $200 (20x) per month (secondary sources, checked 2026-11-14). Default: start on Pro, upgrade if limits block weekly progress.

### D-14 Map tiles — see [ADR-0013](./adr/ADR-0013-maps-maplibre-osm.md). MapTiler's free plan is limited to non-commercial use and R&D for commercial products (MapTiler Cloud terms, checked 2026-11-14).

### D-15 LLM providers — see [ADR-0014](./adr/ADR-0014-ai-model-gateway.md) and cost table.

### D-16 AI assistant — deferred; reasons in [AI_CITY_INTELLIGENCE.md](./AI_CITY_INTELLIGENCE.md#12-ai-city-assistant-post-mvp).

### D-17 Translation policy — machine translation only for verified content, labelled; never translate prices/times (structured fields).

### D-18 Location precision — see [SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md#5-location-privacy).

### D-19 Deals — postponed.

### D-20 Legal entity & store accounts
- **Why:** Store listings show the developer name; organization accounts (Apple) may need a D-U-N-S number; partners and payment providers may require a legal entity [ASSUMPTION — confirm with counsel].
- **Options:** individual accounts now, migrate later; register a local entity before beta.
- **Default:** individual accounts for MVP-0/1 testing; decide before public listing.
