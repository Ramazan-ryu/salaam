# Product Decisions Log

Status: Draft 0.2 · 2026-11-16 · Related: [DOCUMENTATION_REVIEW.md](./DOCUMENTATION_REVIEW.md), [adr/README.md](./adr/README.md), [RISKS_AND_OPEN_QUESTIONS.md](./RISKS_AND_OPEN_QUESTIONS.md)

Each decision lists why it matters, the options, a recommended default, consequences, and whether **owner approval** is required. Architectural decisions also have ADRs.

**Status values:** **Confirmed** (by the founder) · **Recommended** (our default, awaiting approval) · **Proposed** (new in 0.2, awaiting approval) · **Open** (needs evidence first) · **Blocked — legal** (needs counsel) · **Blocked — spike** (needs a technical spike).

## Summary

| ID | Decision | Status | Owner approval | Default / current position | Needed by |
|---|---|---|---|---|---|
| D-01 | Product name & domain | Recommended | **Yes** | "Salaam" stays the working name (confirmed); cheap generic domain for development; `.az` deferred | P-6 |
| D-02 | Hosting jurisdiction | **Blocked — legal** | Yes (after counsel) | Portable architecture; synthetic data until decided | G6 |
| D-03 | Minimum user age | **Blocked — legal** | Yes (after counsel) | 18+ recommended | G6 |
| D-04 | Initial validation segment | Recommended | **Yes** | Young adults 18–30 in Baku + 2–3 comparison interviews | P-0 week 1 |
| D-05 | Sign-in methods / implementation | Methods: Recommended · Implementation: **Blocked — spike (S-AUTH)** | **Yes** | Email code + Google (+ Apple at S3); phone deferred | G1 |
| D-06 | Home layout (A vs C) | Open (P-0 test) | **Yes** | Concept A default unless test thresholds fail; avatar-first is **Confirmed** | G0/G1 |
| D-07 | Platform sequence | **Confirmed** (2026-11-16) | — | Admin/organizer web → Android beta → iOS TestFlight → public web pages | — |
| D-08 | Avatar art production path | Recommended | **Yes** | v0 founder-made simple style; v1 freelance later | G1 |
| D-09 | Instagram integration path | Recommended; Business Discovery **Blocked — legal** | **Yes** | Owned-account connection after Meta App Review, post-MVP-1 under D-21 | MVP-2 |
| D-10 | Founder content-ops budget | Proposed (revised) | **Yes** | ≤5 h/week in private beta (was ≤8 h) | MVP-1 |
| D-11 | Social scope | **Confirmed** (architecture covers profiles, friendships, sharing, invitations, privacy, community expansion; no full feed in MVP) | Details via D-21/D-24 | Friends, going/interested, invites, follows, block/report | — |
| D-12 | Monetization | **Confirmed** deferred | — | None in MVP; sponsored-content policy pre-defined | — |
| D-13 | Claude plan for development | Recommended | **Yes** | Pro; Max 5x only if limits block progress | P-1 |
| D-14 | Map tiles | **Blocked — spike (S-MAP)** | Yes | Self-hosted PMTiles if spike passes; MapTiler Flex ($30/month, official) fallback | G1 |
| D-15 | LLM provider(s) | Recommended | **Yes** | Claude Haiku 5.5 primary + one fallback | P-5 |
| D-16 | AI assistant in MVP | Recommended | **Yes** | Not in MVP | — |
| D-17 | Translation policy | Recommended | **Yes** | Machine translation of verified content, labelled; never structured fields | P-5 |
| D-18 | Location precision | Superseded by D-28 | — | — | — |
| D-19 | Deals module | Recommended (postponed) | No | Postponed until an authorized source exists | — |
| D-20 | Legal entity & store accounts | Open; partly **Blocked — legal** (QL-13) | **Yes** | Decide before Android closed testing (affects the 12-tester rule) | P-6 |
| **D-21** | **Lean MVP-1 slice** | **Proposed** | **Yes** | Ship S1+S2 slice first; rest to MVP-2 | G0/G1 |
| **D-22** | Keep the P-0 pilot running during the build | **Proposed** | **Yes** | Yes, at 1 post/week (~1.5 h/week) | G0 |
| **D-23** | Pilot channel & languages | **Proposed** | **Yes** | Telegram; az + ru per item, one English line; confirm after week-2 interviews | P-0 week 2 |
| **D-24** | Attendance visibility options in MVP | **Proposed** | **Yes** | only_me / friends (no public) | MVP-2 |
| **D-25** | Human approval before every publication through MVP-1 | **Confirmed** (2026-11-16) | — | All sources L0/L1 | — |
| **D-26** | Cinema in Lean MVP-1 | **Proposed** | **Yes** | "Now showing" + link to the cinema's own showtime page | P-3 |
| **D-27** | Early read-only public web catalogue | **Proposed** (changes the confirmed platform order) | **Yes** | Optional: publish "This week in Baku" pages after P-3, no accounts | G3 |
| **D-28** | Minimum location data | Recommended | **Yes** | Optional home district + per-request cell; no location in analytics | P-2 |
| **D-29** | Planning basis | **Confirmed** (2026-11-16) | — | 10–15 h/week; 1 dev-day = 6 h | — |
| **D-30** | P-0 thresholds | **Proposed** | **Yes** | Thresholds in [VALIDATION_METRICS.md](./VALIDATION_METRICS.md); frozen by week 3 | P-0 week 1–3 |

---

## Details (new or changed in 0.2)

### D-05 Sign-in methods and implementation
- **Why:** conversion, cost, compliance and security. App Store guideline 4.8 requires an equivalent privacy-focused login (Sign in with Apple) when Google is offered on iOS; apps with account creation must support in-app deletion.
- **Options (implementation):** managed authentication, library-based NestJS module, or self-hosted identity server; compared in [SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md#31-implementation-approaches-decision-open--blocked-by-spike-s-auth).
- **Default:** methods as listed; implementation decided by spike S-AUTH. No custom cryptography or protocols in any option.
- **Consequences:** the managed option speeds P-2 but depends on D-02; the library option is portable but needs strong tests.

### D-06 Home layout
- **Why:** core identity bet vs speed to task.
- **Options:** Concept A (Companion Stage), Concept C (Docked Companion), B later.
- **Default:** A, unless the P-0 test shows VM-44 > 50% or VM-42 > 1.3× (then C). The first visual mockups exist on the design canvas "Salaam — First Look: Home Concepts A & C".
- **Consequences:** affects avatar art priority and home widget design.

### D-07 Platform sequence — Confirmed
Admin & organizer web → Android beta → iOS TestFlight → public web pages. Acceptance criteria are per stage ([MVP_SCOPE.md](./MVP_SCOPE.md#4-acceptance-criteria-by-platform-stage)). Google Play rule (official, checked 2026-11-16): new personal accounts need ≥12 testers opted in for 14 continuous days before production access.

### D-10 Founder content-ops budget (revised)
- **Why:** total capacity is 10–15 h/week for everything; 8 h/week of curation would leave almost nothing for development.
- **Default:** ≤5 h/week in private beta, supporting ~60–80 verified events/week depending on source mix ([CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md#8-solo-founder-workload-model)).
- **Consequences:** MVP-1 supply target lowered to min 40 / target 60.

### D-20 Legal entity & store accounts
- **Why:** store developer names; Apple organization enrollment requires a D-U-N-S number (secondary); Google organization accounts are reported exempt from the 12-tester rule (secondary, https://extendsclass.com/blog/?p=2302); partners may require an entity.
- **Options:** individual accounts now; register an entity before Android closed testing; register before public listing.
- **Default:** decide before P-6 with counsel's answer to QL-13.

### D-21 Lean MVP-1 slice
- **Why:** at 10–15 h/week the full specified MVP is an estimated 19–60 months away including P-0 (expected ~35 months). Lean MVP-1 is an estimated 12–38 months (expected ~23) ([IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md#5-calendar-estimates)).
- **Options:** (a) full MVP-1 as specified; (b) Lean MVP-1 (S1+S2, share links instead of friends graph, drafts-only AI, cinema link-out, digests later); (c) Lean MVP-1 + D-27.
- **Default:** (b), revisited at G1 with spike results.
- **Consequences:** earlier real-user evidence. Friends graph, digests, iOS and the Instagram connector arrive in MVP-2. No confirmed scope item is dropped.

### D-22 Keep the pilot running during the build
- **Default:** yes, 1 post/week (~1.5 h/week). Keeps the audience, the supply learning and the organizer relationships alive.
- **Consequence:** about 1.5 h/week less development (already in roadmap capacity).

### D-23 Pilot channel & languages
- **Default:** Telegram; each item in Azerbaijani + Russian, one English line. Switch if the week-2 interviews show the target segment doesn't use Telegram for this. Telegram's local importance is [UNVERIFIED].

### D-24 Attendance visibility
- **Why:** "going to venue X at time Y" reveals future whereabouts; public visibility adds stalking risk and possible minors-law exposure.
- **Default:** only_me / friends in MVP; public reconsidered after legal review.

### D-26 Cinema in Lean MVP-1
- **Why:** curated per-showtime data is labour-intensive without a partner feed.
- **Default:** list films now showing per cinema with a link to the cinema's own showtime page; full showtimes only with a partner feed or after measuring effort.

### D-27 Early read-only public web catalogue
- **Why:** a read-only catalogue has no accounts and no personal data, so it needs no legal answers before launch. It could reach users about 40–60 weeks earlier (expected scenario) and replace the Telegram pilot's role.
- **Consequence:** changes the confirmed order (public pages are stage 4) and adds ~3–5 dd to P-3. **Owner decision.**

### D-28 Minimum location data
See [SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md#54-minimum-location-data-for-mvp-recommended-d-28): optional home district (stored), per-request approximate cell (never stored, header not URL), no location in analytics.

### D-30 P-0 thresholds
Thresholds are set before data exists, may be adjusted once before week 3 with a written reason, and are then frozen to avoid moving the goalposts.

---

## Unchanged details from 0.1

- **D-01:** `.az` registrations via international registrars from ~$243/year (secondary); trademark search before public beta.
- **D-02:** options are Azerbaijan, international or hybrid hosting ([LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md)).
- **D-03:** the August 2026 amendments reportedly bar under-16 accounts on in-scope social platforms and require guardian consent for 16–18 (QL-01).
- **D-08:** [AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md#10-production-scenarios).
- **D-09:** [INTEGRATION_RESEARCH.md](./INTEGRATION_RESEARCH.md#21-instagram--meta).
- **D-12:** sponsored items always labelled; never alter trust badges; no push without opt-in.
- **D-13:** Pro $20/month or $17/month annually; Max from $100 (secondary).
- **D-14:** MapTiler Free is for "testing, PoC, prototyping, personal, or non-commercial use"; Flex $30/month (official, 2026-11-16). [ADR-0013](./adr/ADR-0013-maps-maplibre-osm.md).
- **D-15:** [ADR-0014](./adr/ADR-0014-ai-model-gateway.md).
- **D-16:** [AI_CITY_INTELLIGENCE.md](./AI_CITY_INTELLIGENCE.md#12-ai-city-assistant-post-mvp).
- **D-17:** never translate prices/times (structured fields).
