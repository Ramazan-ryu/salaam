# Documentation Review — Phase 1.1

Status: Draft 0.2 · 2026-11-16 · Supersedes the 0.1 review (2026-11-14) · Related: [README.md](./README.md), [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md)

## 1. Summary of corrections (0.1 → 0.2)

All findings were checked against the documents themselves, not against the earlier review.

| # | Area (brief §) | Problem found in 0.1 | Correction in 0.2 | Documents |
|---|---|---|---|---|
| 1 | Roadmap (3.1) | Assumed ~20 h/week; calendar of 9–14 months | Re-estimated effort per phase; three capacity scenarios (15 / 12.5 / 10 h); five kinds of time separated; buffers; AI output counts only when reviewed and tested. Full MVP ≈ 19–60 months, Lean MVP-1 ≈ 12–38 months (expected ≈ 23) incl. P-0 | IMPLEMENTATION_ROADMAP |
| 2 | P-0 scope (3.2) | ~150+ hours of work packed into 4 weeks; 100 events/week target; 12 testers recruited a year early | 8-week plan (~90 h); every metric has minimum/target/stretch, a measurement method and the decision it informs; interest separated from demand; G0 framework with 6 outcomes | P0_VALIDATION_PLAN, VALIDATION_METRICS, WEEKLY_FOUNDER_PLAN |
| 3 | Authentication (3.3) | ADR-0010 chose an in-house module before evidence | Three approaches compared (managed / library / self-hosted); no custom crypto; decision **blocked by spike S-AUTH**; ADR renamed to `ADR-0010-authentication-approach.md` | ADR-0010, SECURITY_AND_PRIVACY, ARCHITECTURE_REVIEW |
| 4 | Privacy (3.4) | `home_area_geohash5` stored; `interaction_events` stored a coarse geohash for 12 months (a **location history**); `ip_hash` (reversible for IPv4); `near` in URL query (lands in logs); public attendance | Home = chosen district; current area only in a header, never stored or logged; no location in analytics; raw interactions 90 days; no IP in consents; attendance only_me/friends (D-24); coarse location explicitly treated as personal data | SECURITY_AND_PRIVACY, DATABASE_DESIGN, API_SPECIFICATION, PRD |
| 5 | Platform & acceptance (3.5) | Acceptance required sign-up "on Android, iOS and web" at once | Stage-based acceptance S1 (admin/organizer web) → S2 (Android) → S3 (iOS) → S4 (public web); D-07 now Confirmed | MVP_SCOPE, PRD, PRODUCT_DECISIONS |
| 6 | AI verification (3.6) | L2 after 30 items at "98%", which only supports ≤~10% error statistically | Ladder rebuilt on rule-of-three / binomial sample sizes, pooled per connector class + per-source sanity; human approval for every item through MVP-1 (D-25, Confirmed); derived dates, lifecycle, availability never automated; demotion and rollback rules | CONTENT_OPERATIONS, AI_CITY_INTELLIGENCE, DATABASE_DESIGN, DATA_SOURCES_REGISTER |
| 7 | Content ops (3.7) | 8 h/week curation inside a 10–15 h total | Budget per phase (1.5–5 h); throughput model (~75 items in 5 h with a mixed source set); MVP-1 supply target min 40 / target 60; sustainable source strategy | CONTENT_OPERATIONS, MVP_SCOPE, D-10 |
| 8 | Costs (3.8) | Mixed categories; most prices "reported" | Separated into 12 categories; re-verified official prices: Apple $99/yr, Google Play $25 one-time, the Play closed-testing rule, Supabase (Pro includes 100,000 MAU), MapTiler Flex $30/month, Rive Cadet $9/month annual; one-time / recurring / usage separated; P-0 budget ≈ $17–20/month | COST_AND_RESOURCE_ESTIMATE |
| 9 | Minor | Public-pages phase mismatch (C-4 of 0.1) | Feature catalog aligned: F-028 = stage S4, P-3 basic / P-4 polish | FEATURE_CATALOG |

## 2. Required files check (scripted, 2026-11-16)

| Check | Result |
|---|---|
| All documents required by the Phase 1 and Phase 1.1 briefs exist | ✓ (incl. 6 new P-0 documents + 6 CSV templates) |
| Internal links and section anchors | ✓ 0 broken |
| IDs defined where referenced (F, FR, D, QL, R, Q, DS, ADR, VM) | ✓ 0 undefined |
| Stale values (20 h/week, ≥100/week, ≤8 h/week, geohash5, `near=` in URL) | Only in sentences that describe the 0.1 → 0.2 change |

## 3. Contradictions found and resolved

| Finding | Resolution |
|---|---|
| Content-ops budget (8 h) + development needs > total capacity | D-10 revised to ≤5 h/week in beta; roadmap capacity model includes it |
| G3 required 100 events/week while P-0 targeted 30–50 | G3 now ≥40/week for 2 weeks |
| "Precise location never stored" vs geohash in interaction events | Location removed from analytics |
| FR-174 (auto-approval in MVP) vs the confirmed "human approval in early MVP" | FR-174 = capability only; all sources L0/L1 through MVP-1 |
| Roadmap recruited Android testers in P-0, but they are needed at P-6 | P-0 builds an interest list; recruitment in P-6 with a buffer (15–20) |
| Acceptance criteria vs platform sequence | Stage-based criteria |

**Remaining tensions (need founder decisions, not silently resolved):**
1. Confirmed platform order puts public web pages last, but a read-only web catalogue (no personal data) is the fastest way to real users → **D-27 proposed**.
2. Confirmed MVP scope vs 10–15 h/week calendar → **D-21 Lean MVP-1 proposed**. No scope item is removed; items move to MVP-2.

## 4. Missing architectural decisions (unchanged list + additions)

Auth approach (S-AUTH) · ORM/query builder · email provider · error tracking · CI provider · reverse proxy/TLS & backups · static avatar render location (S-AV1) · map tiles (S-MAP) · analytics approach (DB-derived aggregates recommended) · hosting (after counsel).

## 5. Reviews

- **MVP scope:** preserved; Lean MVP-1 offered as a delivery slice. No payments, feeds, communities, 3D or transactional integrations added.
- **Costs:** P-0 needs no new spending. Lean MVP-1 ≈ $35–175/month + $25 one-time + legal (quote). Founder time is the dominant cost.
- **Security & privacy:** location minimised; IP handling corrected; research-data handling added (QL-15); analytics legal basis added (QL-14). Still open before G6: counsel answers, privacy policy, terms.
- **Avatar:** the avatar-first direction is unchanged. P-0 tests layout A vs C with placeholder art only. First mockups are on the design canvas "Salaam — First Look: Home Concepts A & C".

## 6. Remaining open decisions

Requiring founder approval (ordered by impact). Full details: [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md).

| Priority | ID | Decision | Default |
|---|---|---|---|
| 1 | D-21 | Lean MVP-1 slice | Approve (S1 + S2 first) |
| 2 | D-30 | P-0 thresholds | Approve; freeze by week 3 |
| 3 | D-04 | Initial segment | 18–30 Baku + 2–3 comparison interviews |
| 4 | D-23 | Pilot channel & languages | Telegram; az + ru + English line (confirm week 2) |
| 5 | D-22 | Keep pilot during build | Yes, 1 post/week |
| 6 | D-27 | Early read-only web catalogue | Founder's call (changes confirmed order) |
| 7 | D-10 | Content-ops budget | ≤5 h/week in beta |
| 8 | D-24, D-28 | Attendance visibility; minimum location data | only_me/friends; district + per-request cell |
| 9 | D-26 | Cinema in Lean MVP-1 | Now showing + link-out |
| 10 | D-13 | Claude plan | Pro |
| Blocked — spike | D-05 (implementation), D-14, D-06 (test) | Decided at G1 / G0 | — |
| Blocked — legal | D-02, D-03, D-20 (partly), D-09 (Business Discovery) | Before G6 / P-6 | — |

## 7. Key risks and assumptions

Top risks: R-16 long timeline, R-02 content ops vs development, R-08 habit (Instagram), R-19 founder proficiency (Q-11), R-20 false-positive validation, R-23 location re-identification, R-25 leaked token. Key assumptions AS-1…AS-6 in [RISKS_AND_OPEN_QUESTIONS.md](./RISKS_AND_OPEN_QUESTIONS.md#3-assumptions-register-key-02).

## 8. Founder actions required for Week 1

See [WEEKLY_FOUNDER_PLAN.md](./WEEKLY_FOUNDER_PLAN.md#2-week-1-founder-checklist-actions-only-the-founder-can-take).

## 9. Stop condition

Documentation and validation preparation are complete. **No implementation has started**, and no external contact, publication, account registration or subscription has been made. Waiting for founder approval.
