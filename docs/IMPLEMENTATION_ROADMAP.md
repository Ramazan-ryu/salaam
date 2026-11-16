# Implementation Roadmap (Solo Founder)

Status: Draft 0.2 · 2026-11-16 (recalculated for 10–15 h/week) · Supersedes 0.1 (20 h/week assumption) · Related: [P0_VALIDATION_PLAN.md](./P0_VALIDATION_PLAN.md), [WEEKLY_FOUNDER_PLAN.md](./WEEKLY_FOUNDER_PLAN.md), [MVP_SCOPE.md](./MVP_SCOPE.md), [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md), [COST_AND_RESOURCE_ESTIMATE.md](./COST_AND_RESOURCE_ESTIMATE.md)

> Every date in this document is an **estimate, not a promise**. Estimates are re-calculated at each gate from measured velocity.

## 1. Planning basis

| Item | Value | Status |
|---|---|---|
| Founder capacity | **10–15 focused hours/week** | [CONFIRMED 2026-11-16] |
| Dev-day (dd) | **6 focused founder hours** (used everywhere in this package) | [CONFIRMED definition] |
| What an effort estimate measures | Founder hours to produce a **reviewed, tested, merged** increment with Claude Code assisting | [RECOMMENDED rule] |
| AI-generated output | Counts as progress **only** after the founder has reviewed it, tests pass, and it runs on the target platform. Generated-but-unreviewed code counts as zero. | [CONFIRMED rule, brief §3.1] |
| Founder technical proficiency | Assumed comfortable reading/reviewing TypeScript and debugging. If not, multiply effort by 1.5–2.0 (Q-11). | [ASSUMPTION] |
| Earliest Week 1 | Monday 2026-11-23, after approval of this package | [ASSUMPTION] |

## 2. Five kinds of time (kept separate)

| Kind | Consumes founder hours? | On critical path? | How it is planned |
|---|---|---|---|
| **Founder working hours** | Yes — the only constrained resource | Yes | Weekly allocation (§3) |
| **AI-assisted development time** | Partly: prompting, reviewing, testing and fixing happen inside founder hours. Background agent runs may happen outside, but their review is inside. | Through review | Included in dd estimates (no separate "AI capacity") |
| **Waiting for third parties** (store reviews, Google closed test, Meta App Review, account verification) | No (calendar only) | Sometimes | Started early, run in parallel (§7) |
| **Legal and partnership delays** | Small (briefing, follow-ups) | Legal: yes before real user data (G6). Partnerships: **never** | Engage counsel in P-0; partnerships are upside only |
| **Content operations** | Yes | Yes during validation and beta | Fixed weekly budget (§8, [CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md#8-solo-founder-workload-model)) |

## 3. Weekly capacity scenarios

| Scenario | Hours/week | Non-dev hours/week (content ops + outreach/legal/admin) | Availability (weeks lost to illness, holidays, interruptions) | **Effective dev hours/week** | Risk buffer |
|---|---|---|---|---|---|
| **Optimistic** | 15 | 3 (2 + 1) | 100% | **12.0** | +10% |
| **Expected** | 12.5 | 3.5 (2.5 + 1) | 92% (≈4 weeks lost/year) | **8.3** | +20% |
| **Conservative** | 10 | 3 (2 + 1) | 85% (≈8 weeks lost/year) + extra research | **6.0** | +25% |

Short sessions (3–4 per week) carry warm-up overhead (re-loading context, re-running the app). This is included in the effort figures below, not in the capacity numbers.

## 4. Effort re-estimate (not a rescaling)

The 0.1 estimates were reviewed phase by phase for a solo founder using Claude Code. AI assistance shortens scaffolding, CRUD, boilerplate, tests and documentation. It does **not** materially shorten native-module debugging (Rive, MapLibre), device testing, store processes, art work, security review, data-model decisions, or the founder's review time.

| Phase | 0.1 estimate (dd) | **0.2 full MVP (dd)** min / exp / max | **0.2 Lean MVP-1 (dd)** min / exp / max | Why it changed |
|---|---|---|---|---|
| P-1 Design & spikes | 10–15 | 12 / 15 / 18 | 8 / 10 / 12 | Spike scope made explicit (S-AV1, S-MAP, S-AUTH); prototype testing moved into P-0 |
| P-2 Foundation | 12–18 | 14 / 17 / 20 | 12 / 14 / 16 | Expo + Next.js + NestJS monorepo setup and CI on a part-time cadence |
| P-3 City data, admin, portal | 20–30 | 22 / 27 / 32 | 16 / 19 / 22 | Lean: manual entry + organizer form + ICS/RSS only |
| P-4 Mobile, avatar, discover | 30–45 | 35 / 42 / 50 | 25 / 30 / 35 | Native-module risk; lean = Android only, avatar v0 |
| P-5 AI extraction | 15–25 | 15 / 18 / 22 | 6 / 8 / 10 | Lean = extraction drafts + gold-set eval; no auto-approval |
| P-6 Notifications & beta prep | 12–18 | 14 / 17 / 20 | 8 / 10 / 12 | Store processes, legal docs integration, production setup |
| P-7 Light social | 10–15 | 10 / 12 / 15 | 3 / 5 / 7 | Lean = share/invite links + profile; friends graph in MVP-2 |
| P-8 Hardening | 15–20 | 15 / 18 / 22 | 6 / 8 / 10 | Lean = private-beta hardening only |
| **Total P-1…P-8** | ~125–200 | **137 / 166 / 199** | **84 / 104 / 124** | |

## 5. Calendar estimates

Formula: weeks = (dd × 6 h) ÷ effective dev hours/week × (1 + buffer), plus P-0 duration (6 / 8 / 10 weeks). Scenarios pair optimistic effort with optimistic capacity, and so on. Calculated 2026-11-16.

| Target | Optimistic | **Expected** | Conservative |
|---|---|---|---|
| **Lean MVP-1 private beta** (Android + admin web) | ~52 weeks (~12 months) → around **Nov 2027** | ~98 weeks (~23 months) → around **Q4 2028** | ~166 weeks (~38 months) → around **Q1 2030** |
| **Full MVP (MVP-1 + MVP-2 as specified)** | ~81 weeks (~19 months) → around **mid-2028** | ~152 weeks (~35 months) → around **late 2029** | ~261 weeks (~60 months) → around **late 2031** |

**Conclusion [RECOMMENDED]:** at 10–15 h/week the full specified MVP is a 1.5–5-year effort. That is too long to wait for first real-user evidence. The documentation therefore proposes:

1. **D-21 Lean MVP-1** as the first release of the confirmed MVP scope. It is the same product direction, delivered in a smaller first slice. Nothing is removed from the vision; items move to MVP-2. **Owner approval required.**
2. **D-27 Early public web catalogue:** a read-only "This week in Baku" web catalogue fed by the admin at the end of P-3, with no accounts and no personal data. It would put real value in front of users about 40–60 weeks earlier (expected scenario). This changes the confirmed platform order (public pages are stage 4), so it is **proposed only** and needs owner approval.
3. **D-22 Keep the P-0 pilot channel running** at low cadence during the build, so evidence and audience keep growing.

## 6. Lean MVP-1 slice (proposed, D-21)

| Included in Lean MVP-1 | Moved to MVP-2 (still in confirmed scope) |
|---|---|
| Admin + organizer web (manual entry, organizer form, ICS/RSS connectors, review queue, audit log) | iOS TestFlight (platform stage 3; may start once Android beta is stable) |
| Android app: onboarding, avatar v0 (reduced slots, 5 states), avatar-first home (Concept A or C per test), discover list + map, detail with trust badges | Friends graph, going/interested visibility, friends going, follows (F-040, F-042, F-043) |
| Save, reminders, change/cancel alerts (push on Android + in-app inbox) | Weekend/tonight digests (F-052) |
| Email code + Google sign-in; consent records; account deletion; az/ru/en | Instagram owned-account connector (needs Meta App Review) |
| Share and invite links (no friend graph) | Public web pages with SEO polish (stage 4) — unless D-27 approved |
| LLM extraction producing **drafts only**; 100% human approval | Automation L2+; quality dashboard beyond basic counts |
| Cinema: "now showing" list per cinema with link to the cinema's own showtime page (D-26) | Full per-showtime data (partner feed or curated) |

## 7. Phase plan (Lean path, expected scenario)

| Phase | Objective | Key deliverables | Depends on | Waiting / external items (calendar, parallel) | Gate | Effort (dd) | Expected weeks |
|---|---|---|---|---|---|---|---|
| **P-0** | Validate demand, supply, avatar value | See [P0_VALIDATION_PLAN.md](./P0_VALIDATION_PLAN.md) | Approval of this package | Counsel quotes; organizer replies | **G0** | ~90 founder hours (non-dev) | 8 (6–10) |
| **P-1** | Remove technical unknowns | S-AV1, S-AUTH, S-MAP spikes; style board; OpenAPI v1 draft; ADR updates | G0 | Counsel engaged with QL brief | **G1** | 10 | ~9 |
| **P-2** | Foundation | Monorepo, CI, Compose, auth (per S-AUTH), consent, i18n, backups | G1 | — | **G2** | 14 | ~12 |
| **P-3** | Supply side | City data modules, status model, admin, review queue, organizer form, ICS/RSS | G2 | Organizer pilot participants (non-blocking) | **G3** | 19 | ~17 |
| **P-4** | Consumer Android app | Onboarding, avatar v0, home, discover, detail, save | G3 (and S-AV1) | Rive Cadet plan needed for exports | **G4** | 30 | ~26 |
| **P-5** | Extraction assist | Model gateway, draft extraction, gold-set CI eval | G3 (can overlap P-4) | — | **G5** | 8 | ~7 |
| **P-6** | Beta prep | Push + inbox, reminders, change alerts, production env, store listing, legal docs | G4, G5 | **Google Play account verification; 12+ testers opted in for 14 continuous days** (Google Play rule for new personal accounts, official, checked 2026-11-16); **counsel answers QL-01–QL-04, QL-10** | **G6** | 10 | ~9 |
| **P-7** | Sharing | Share/invite links, profile | G6 | — | **G7** | 5 | ~4 |
| **P-8** | Private-beta hardening | ASVS L1 checklist, restore drill, fixes | G7 | — | **G8 → Lean MVP-1 private beta** | 8 | ~7 |

The Google Play closed-test requirement applies to personal developer accounts created after 13 Nov 2023. Secondary sources report that organization accounts are exempt; see D-20.

## 8. Founder workload by period (expected scenario, 12.5 h/week)

| Period | Dev | Content ops | Research/validation | Outreach, legal, admin | Notes |
|---|---|---|---|---|---|
| P-0 (weeks 1–8) | 0 | 3.5 | 7 | 2 | See [WEEKLY_FOUNDER_PLAN.md](./WEEKLY_FOUNDER_PLAN.md) |
| P-1 – P-2 | 9 | 1.5 (pilot upkeep, D-22) | 0.5 | 1.5 | Legal brief follow-up |
| P-3 – P-5 | 9 | 2.5 | 0 | 1 | Curation moves into the admin |
| P-6 – P-8 | 7 | 3.5 | 0.5 | 1.5 | Store processes, tester recruiting |
| Private beta operation | 5 | **5** | 1 (feedback) | 1.5 (support, admin) | Content ops cap ([CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md#8-solo-founder-workload-model)) |

## 9. Gates

| Gate | Hard requirement | Outcome options |
|---|---|---|
| **G0** | Validation evidence per [P0_VALIDATION_PLAN.md](./P0_VALIDATION_PLAN.md#8-g0-decision-framework) | Proceed / reduced MVP / extend / change audience / change content strategy / stop |
| G1 | S-AV1 meets exit criteria (or avatar plan revised); S-AUTH decision recorded; D-03, D-05, D-06, D-08, D-14, D-15, D-21 decided | Proceed / revise |
| G2 | Clone-to-running ≤30 min; CI green; restore test passes; sign-in works on web admin | — |
| G3 | Founder publishes ≥40 verified events/week via admin for 2 consecutive weeks; new ICS/RSS source needs configuration only | If not met: narrow categories |
| G4 | Stage-2 acceptance criteria ([MVP_SCOPE.md](./MVP_SCOPE.md#4-acceptance-criteria-by-platform-stage)) on reference Android device | — |
| G5 | Extraction critical-field precision ≥90% on gold set (drafts only) | If not met: extraction stays optional |
| G6 | Legal prerequisites answered; hosting decided; **no real user data before G6** | — |
| G7 | Share/invite flows; privacy tests green | — |
| G8 | No critical security findings; restore drill passed | → Lean MVP-1 private beta |

## 10. Re-planning rules

- At every gate: velocity = completed dd ÷ founder hours spent × 6. If velocity is below 70% of plan for two consecutive phases, cut scope using the D-21 list. Never cut tests, privacy or verification.
- Keep a simple weekly time log (template in [WEEKLY_FOUNDER_PLAN.md](./WEEKLY_FOUNDER_PLAN.md#5-weekly-time-log-template)); calendar estimates are recomputed from it.
- MVP-2 is re-planned after Lean MVP-1 metrics ([MVP_SCOPE.md](./MVP_SCOPE.md#5-success-metrics)).

## 11. Post-MVP candidates (evidence-driven)

AI assistant (F-090), shared plans (F-032), avatar unlockables & inventory items (F-013/F-014/F-121), partner feeds, more cities (Sumgait, Ganja), deals (F-100), passkeys, phone OTP, groups/communities (F-045).
