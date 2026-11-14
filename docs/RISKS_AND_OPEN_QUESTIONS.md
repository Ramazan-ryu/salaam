# Risks and Open Questions

Status: Draft 0.1 · 2026-11-14 · Related: [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md), [LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md), [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md#3-architectural-risks)

## 1. Risk register

Scale: Likelihood/Impact = Low / Medium / High.

| ID | Risk | L | I | Mitigation | Owner | Trigger to act |
|---|---|---|---|---|---|---|
| R-01 | Insufficient verified supply in Baku | M | H | P-0 curation sprint; organizer portal; owned-account connections; narrow categories | Founder | A1 fails |
| R-02 | Founder curation workload unsustainable | M | H | Automation ladder; category limits; part-time curator (Scenario C) | Founder | >10 h/week for 3 weeks |
| R-03 | Meta App Review rejected or terms restrict display | M | M | Product works without Instagram; portal/email/Telegram routes | Founder | Rejection |
| R-04 | Legal: Salaam in scope of 2026 social-platform rules | M | H | Counsel (QL-01); 18+ default; limit social features if needed | Founder + counsel | Counsel answer |
| R-05 | Legal: cross-border transfer constraints | M | H | Portable architecture; synthetic data until decided; hybrid option | Founder + counsel | Counsel answer |
| R-06 | Avatar performance/customisation not feasible as specified | M | H | Spike S-AV1; reduce slots; static fallback | Founder | Spike fails |
| R-07 | Avatar art quality insufficient (v0) | M | M | Simple deliberate style; freelance v1 when budget allows | Founder | Test feedback |
| R-08 | Users prefer Instagram habits | H | H | "Tonight near me", verification, friends; share back to Instagram/Telegram | Founder | W4 retention <10% |
| R-09 | Partners decline | H | M | Type 4 fallbacks everywhere | Founder | — |
| R-10 | Scope creep across modules | H | M | Feature catalog gate; ADR/decision log | Founder | Any unplanned feature |
| R-11 | AI extraction errors published | M | H | Evidence spans, policy engine, audits, demotion | Founder | Audit precision <98% |
| R-12 | Security incident (auth, admin takeover) | L | H | 2FA, library-based auth, tests, reviews | Founder | — |
| R-13 | Vendor price/availability changes (hosting, LLM, maps) | M | M | Abstractions; documented alternatives | Founder | Price change |
| R-14 | Store review issues (4.8, 5.1.1(v), age rating) | M | M | Apple sign-in, in-app deletion, accurate questionnaires | Founder | Rejection |
| R-15 | Google Play closed-testing requirement delays launch | M | L | Recruit 12+ testers in P-0 | Founder | — |
| R-16 | Founder capacity lower than assumed | M | M | Re-plan at each gate; cut scope not quality | Founder | Velocity <70% plan |
| R-17 | Translation errors mislead users | M | M | Label translations; never translate structured fields; spot checks | Founder | Reports |
| R-18 | Harmful/spam organizer submissions | M | M | Organizer verification; review; rate limits | Founder | Spam observed |

## 2. Open questions (product & technical)

| ID | Question | Resolve by | How |
|---|---|---|---|
| Q-01 | Real founder weekly capacity? | Before P-2 | Owner input |
| Q-02 | Which categories matter most to the target segment? | P-0 | Interviews + sprint |
| Q-03 | Is Telegram a significant announcement channel; can a channel-owner bot be used per Telegram terms? | P-0/P-1 | Research |
| Q-04 | Android vs iOS share in Azerbaijan (citable)? | P-1 | Research |
| Q-05 | Best email delivery & error tracking providers (free tiers, data location)? | P-2 | ADR |
| Q-06 | Auth library choice | P-2 | Spike S-AUTH |
| Q-07 | ORM/query builder choice | P-2 | ADR |
| Q-08 | PMTiles extract size and RN MapLibre behaviour | P-1 | Spike S-MAP |
| Q-09 | Azerbaijani full-text search quality with `simple` + trigram | P-3 | Test on gold set titles |
| Q-10 | Weather source licence for commercial use | P-4 | Research |
| Q-AV1–3 | Avatar technique questions | P-1 | [AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md#14-open-questions) |
| QL-01–13 | Legal questions | Before MVP-1 | [LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md#3-questions-for-azerbaijani-legal-counsel) |

## 3. Blockers (current)

| Blocker | Blocks | Status |
|---|---|---|
| Owner approval of documentation | All implementation | Waiting |
| Legal answers QL-01–QL-04 | MVP-1 (real user data) — **not** MVP-0 | Not started |
| Meta App Review | F-062 only | Not started |

## 4. External dependencies

| Dependency | Used for | Fallback |
|---|---|---|
| Apple (Developer Program, APNs, Sign in with Apple, App Review) | iOS | Web + Android first |
| Google (Play Console, FCM, Google Sign-In) | Android | Email OTP |
| Expo (SDK, EAS, Push relay) | Mobile build/push | Local builds; direct APNs/FCM |
| Rive (editor exports, runtimes) | Avatar | Static avatar; Lottie for simple states |
| LLM providers | Extraction, translation | Second provider; manual curation |
| Meta (Instagram API) | Owned-account connector | Portal, other sources |
| Map data/tiles (OSM, tile hosting) | Maps | Provider plan |
| Object storage provider | Media, backups | Any S3-compatible |
| Hosting provider | Everything | Portable containers |
| Legal counsel | Compliance | — (required) |
