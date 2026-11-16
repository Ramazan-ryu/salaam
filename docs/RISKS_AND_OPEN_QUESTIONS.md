# Risks and Open Questions

Status: Draft 0.2 · 2026-11-16 · Related: [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md), [LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md), [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md#3-architectural-risks), [P0_VALIDATION_PLAN.md](./P0_VALIDATION_PLAN.md)

## 1. Risk register

Scale: Likelihood/Impact = Low / Medium / High. New or changed in 0.2 marked ★.

| ID | Risk | L | I | Mitigation | Trigger to act |
|---|---|---|---|---|---|
| R-01 | Insufficient verified supply in Baku | M | H | P-0 curation; organizer-first; narrow categories | VM-01 < 30 |
| R-02 ★ | Content ops consume development time (10–15 h/week total) | H | H | Fixed content-ops budget per phase; structured sources first; human approval but faster tooling | Content ops > 6 h/week for 3 weeks |
| R-03 | Meta App Review rejected or terms restrict display | M | M | Product works without Instagram; connector post-MVP-1 | Rejection |
| R-04 | Legal: Salaam in scope of 2026 social-platform rules | M | H | Counsel (QL-01); 18+; limit social features | Counsel answer |
| R-05 | Legal: cross-border transfer constraints | M | H | Portable architecture; synthetic data until G6 | Counsel answer |
| R-06 | Avatar performance/customisation not feasible as specified | M | H | Spike S-AV1; reduced v0 slots; static fallback | Spike fails |
| R-07 | Avatar art quality insufficient (v0) | M | M | Simple deliberate style; freelance v1 later | Test feedback |
| R-08 | Users prefer Instagram habits | H | H | "Tonight", verification, sharing; pilot measures repeat use | VM-11/VM-13 below minimum |
| R-09 | Partners decline | H | M | Type 4 fallbacks everywhere | — |
| R-10 | Scope creep across modules | H | M | Feature catalog gate; D-21 | Any unplanned feature |
| R-11 | AI extraction errors published | L (MVP: all human-approved) | H | D-25; evidence spans; L2+ only with statistical evidence | Audit error |
| R-12 | Security incident (auth, admin takeover) | L | H | Vetted auth (S-AUTH), 2FA, tests, review | — |
| R-13 | Vendor price/availability changes | M | M | Abstractions; alternatives documented | Price change |
| R-14 | Store review issues (4.8, 5.1.1(v), age rating) | M | M | Apple sign-in at S3; in-app deletion | Rejection |
| R-15 ★ | Google Play 12-tester / 14-day rule delays Android beta | M | M | Tester interest list from P-0 (target 20); recruit 15–20 for buffer; or organization account (D-20) | <15 committed testers at P-6 start |
| R-16 ★ | Long timeline (Lean MVP-1 expected ~23 months) erodes motivation or relevance | H | H | Lean slice (D-21); pilot keeps users engaged (D-22); optional early web catalogue (D-27); visible milestones | Velocity <70% of plan for 2 phases |
| R-17 | Translation errors mislead users | M | M | Label; never translate structured fields | Reports |
| R-18 | Harmful/spam organizer submissions | M | M | Verification; review; rate limits | Spam observed |
| R-19 ★ | Founder technical proficiency lower than assumed | M | H | Q-11; effort ×1.5–2 rule; early spikes reveal it | P-1 spikes take >1.5× estimate |
| R-20 ★ | Validation false positive (interest mistaken for demand) | M | H | Behavioural metrics only for pass criteria; thresholds frozen by week 3 (D-30) | — |
| R-21 ★ | Wrong pilot channel or language for the segment | M | M | Decide after week-2 interviews (D-23) | Interviews show low Telegram use |
| R-22 ★ | Research and pilot data handled improperly | L | M | Anonymised notes; deletion schedule; QL-15 | — |
| R-23 ★ | Coarse location or attendance data re-identifies users | M | H | D-28 minimum data; no location in analytics; D-24 | Any new location feature |
| R-24 ★ | Small samples make automation thresholds unreachable for small sources | H | L | Pooled evidence by connector class; human approval remains | — |
| R-25 ★ | Leaked credentials (GitHub token pasted in chat 2026-11-14) | M | M | Founder revokes token; secret scanning; never paste secrets | Not yet confirmed revoked |

## 2. Open questions (product & technical)

| ID | Question | Resolve by | How |
|---|---|---|---|
| Q-01 | Founder weekly capacity | **Resolved 2026-11-16: 10–15 h/week** | — |
| Q-02 | Which categories matter most to the target segment? | P-0 week 2–3 | Interviews + workbook |
| Q-03 | Is Telegram significant for discovery; can a channel-owner bot be used per Telegram terms? | P-0 / P-1 | Interviews; research |
| Q-04 | Android vs iOS share in Azerbaijan (citable)? | P-1 | Research |
| Q-05 | Email delivery & error tracking providers | P-2 | ADR |
| Q-06 | Auth approach | G1 | Spike S-AUTH |
| Q-07 | ORM/query builder | P-2 | ADR |
| Q-08 | PMTiles extract size; RN MapLibre behaviour | P-1 | Spike S-MAP |
| Q-09 | Azerbaijani search quality with `simple` + trigram | P-3 | Gold-set titles |
| Q-10 | Weather source licence | P-4 | Research |
| Q-11 ★ | Founder's coding/review experience with TypeScript, React Native, backend | Before P-1 | Founder input; P-1 spike timing |
| Q-12 ★ | Telegram channel statistics available at small subscriber counts? | P-0 week 3 | Observe |
| Q-13 ★ | Does the target segment accept a placeholder avatar, or is art quality decisive? | P-0 | Prototype test comments |
| Q-AV1–3 | Avatar technique questions | P-1 | [AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md#14-open-questions) |
| QL-01–15 | Legal questions | Before G6 | [LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md#3-questions-for-azerbaijani-legal-counsel) |

## 3. Assumptions register (key, 0.2)

| ID | Assumption | Validation |
|---|---|---|
| AS-1 | Founder can review TypeScript code effectively | Q-11, P-1 spikes |
| AS-2 | 6 dd per phase-week ratios hold at 8.3 dev h/week | Weekly time log |
| AS-3 | Counsel answers arrive within 4–8 weeks of engagement | Engagement in P-0 week 7 |
| AS-4 | Telegram is a usable pilot channel for 18–30 in Baku | Week-2 interviews |
| AS-5 | ~75 items/week is achievable in 5 h with a mixed source set | Measured in P-3/P-0 |
| AS-6 | Placeholder avatar art is enough to test layout value | P-0 test comments |

## 4. Blockers (current)

| Blocker | Blocks | Status |
|---|---|---|
| Founder approval of Phase 1.1 package and P-0 decisions | P-0 start | Waiting |
| Legal answers QL-01–QL-04, QL-10, QL-14 | Real user data (G6) — not P-0 to P-5 | Not started |
| Spike S-AUTH, S-AV1, S-MAP | D-05 implementation, avatar plan, D-14 | P-1 |
| Meta App Review | F-062 only (MVP-2) | Not started |

## 5. External dependencies

| Dependency | Used for | Fallback |
|---|---|---|
| Apple (Developer Program $99/year, APNs, Sign in with Apple, App Review) | iOS (S3) | Android + web first |
| Google (Play Console $25, FCM, Google Sign-In, closed-testing rule) | Android (S2) | Email code |
| Expo (SDK, EAS, Push relay) | Mobile build/push | Local builds; direct APNs/FCM |
| Rive (exports via paid plan; MIT runtimes) | Avatar | Static avatar; Lottie for simple states |
| LLM providers | Extraction drafts, translation | Second provider; manual curation |
| Meta (Instagram API) | Owned-account connector (MVP-2) | Portal, other sources |
| Map data/tiles | Maps | MapTiler Flex |
| Object storage provider | Media, backups | Any S3-compatible |
| Hosting provider | Everything | Portable containers |
| Legal counsel | Compliance | — (required) |
| Telegram | P-0 pilot channel | Another channel per D-23 |
