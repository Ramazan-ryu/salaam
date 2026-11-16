# Feature Catalog

Status: Draft 0.2 · 2026-11-16 (Phase 1.1 corrections) · Related: [PRODUCT_REQUIREMENTS_DOCUMENT.md](./PRODUCT_REQUIREMENTS_DOCUMENT.md), [MVP_SCOPE.md](./MVP_SCOPE.md), [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)

Priority: **MVP** (in first beta) · **Next** (after MVP, evidence-driven) · **Later** · **Rejected** (with reason). Phase = roadmap phase in which it is built.

## Module A — Accounts & identity

| ID | Feature | Priority | Depends on | Phase |
|---|---|---|---|---|
| F-001 | Sign-in: email OTP, Google, Apple; age confirmation | MVP | ADR-0010, D-03, D-05 | P-2 |
| F-002 | Onboarding: language, interests, "things I have", area | MVP | F-001 | P-4 |
| F-003 | Consent records (versioned) | MVP | F-001 | P-2 |
| F-004 | Profile with per-field audience | MVP | F-001 | P-4 |
| F-005 | Account deletion (MVP) / data export (Next) | MVP / Next | F-001 | P-2 / later |
| F-006 | Phone OTP sign-in | Next | Budget, D-05 | — |

## Module H — Avatar (central identity)

| ID | Feature | Priority | Depends on | Phase |
|---|---|---|---|---|
| F-010 | Avatar editor (slot-based) + versioned config | MVP | ADR-0012, art v0 | P-4 |
| F-011 | Animated avatar with state machine on home | MVP | F-010 | P-4 |
| F-012 | Static avatar renders (fallback, cards, notifications) | MVP | F-010 | P-4 |
| F-013 | Unlockable items (non-monetary progression) | Next | F-010 | — |
| F-014 | Inventory items on avatar (bike, camera…) | Next | F-002, art v1 | — |
| F-015 | 3D environment objects | Later | Spike | — |

## Module A/B/C — Discover, events, places, cinema

| ID | Feature | Priority | Depends on | Phase |
|---|---|---|---|---|
| F-020 | Time lenses + filters | MVP | Data model | P-4 |
| F-021 | List + map views | MVP | ADR-0013 | P-4 |
| F-022 | Multilingual search | MVP | ADR-0007 | P-4 |
| F-023 | Event detail with trust badges & provenance | MVP | Status model | P-3/P-4 |
| F-024 | Place detail | MVP | — | P-3/P-4 |
| F-025 | Cinema showtimes (curated or partner); Lean MVP-1: "now showing" + link-out (D-26) | MVP | DS records | P-3 |
| F-026 | Rule-based recommendations with "why" | MVP | F-002, F-020 | P-4 |
| F-027 | Directions & mobility hand-off links | MVP | — | P-4 |
| F-028 | Public web event/place pages (SEO, share) — platform stage S4 | MVP | ADR-0004 | P-3 basic, P-4 polish (earlier only if D-27 approved) |

## Module — Save & plan

| ID | Feature | Priority | Depends on | Phase |
|---|---|---|---|---|
| F-030 | Save occurrences/places | MVP | F-001 | P-4 |
| F-031 | Reminders + change/cancel alerts | MVP | F-050 | P-6 |
| F-032 | Shared plans with friends | Next | F-040 | — |

## Module G — Social & community

| ID | Feature | Priority | Depends on | Phase |
|---|---|---|---|---|
| F-040 | Friends (request/accept/block) | MVP | F-004 | P-7 |
| F-041 | Invite deep links (app + web) | MVP (in Lean MVP-1) | F-028 landing page | P-7 |
| F-042 | Going/Interested with visibility; friends going | MVP | F-040 | P-7 |
| F-043 | Follow places/organizers | MVP | — | P-7 |
| F-044 | Report & block | MVP | F-076 | P-7 |
| F-045 | Groups/communities, posts, comments | Later | Moderation capacity | — |
| F-046 | Friends-only coarse location sharing | Later | Legal review | — |
| F-047 | Direct messaging | Rejected (MVP) | High moderation + legal burden; use external messengers via share | — |

## Module — Notifications

| ID | Feature | Priority | Depends on | Phase |
|---|---|---|---|---|
| F-050 | Push + in-app inbox (+ web push optional) | MVP | ADR-0016 | P-6 |
| F-051 | Preferences, quiet hours, budgets, consent-gated types | MVP | F-003 | P-6 |
| F-052 | Digests (weekend, optional tonight) | MVP | F-026 | P-6 |
| F-053 | Deep links | MVP | — | P-6 |

## Organizer portal

| ID | Feature | Priority | Depends on | Phase |
|---|---|---|---|---|
| F-060 | Organizer registration & claim | MVP | F-070 | P-3 |
| F-061 | Event submission & status | MVP | F-060 | P-3 |
| F-062 | Connect owned Instagram account | MVP (if Meta App Review approved) | DS-010, external | P-5 |
| F-063 | Organizer stats | Next | Analytics | — |

## Admin & content operations

| ID | Feature | Priority | Depends on | Phase |
|---|---|---|---|---|
| F-070 | RBAC admin (web) | MVP | ADR-0010 | P-3 |
| F-071 | Content CRUD + translations | MVP | — | P-3 |
| F-072 | Review queue | MVP | F-082 | P-3 (manual) / P-5 (AI) |
| F-073 | Source registry & connector config | MVP | ADR-0015 | P-3 |
| F-074 | Job monitor & freshness | MVP | ADR-0009 | P-3 |
| F-075 | Quality & workload dashboard | MVP | F-072 | P-5 |
| F-076 | Moderation & audit log | MVP | — | P-3 |

## Module — AI city intelligence

| ID | Feature | Priority | Depends on | Phase |
|---|---|---|---|---|
| F-080 | Connector framework | MVP | ADR-0015 | P-3 |
| F-081 | Scheduler & re-check | MVP | ADR-0009 | P-3 |
| F-082 | LLM structured extraction with evidence | MVP | ADR-0014 | P-5 |
| F-083 | Entity resolution & dedup suggestions | MVP | ADR-0007 | P-5 |
| F-084 | Auto-approval policies + audit sampling | MVP | F-075 | P-5 |
| F-085 | Pre-event re-verification | MVP | F-081 | P-5 |
| F-086 | Machine translation (labelled) | MVP | ADR-0014 | P-5 |
| F-087 | Embedding-assisted dedup | Next | ADR-0008 | — |

## Module J — AI city assistant

| ID | Feature | Priority | Depends on | Phase |
|---|---|---|---|---|
| F-090 | "Plan my evening" assistant over verified data | Next (optional experiment flag in beta) | Data density, ADR-0014 | — |

## Module F — Deals & shopping

| ID | Feature | Priority | Depends on | Phase |
|---|---|---|---|---|
| F-100 | Retail offers with validity dates | Later | Authorized sources | — |

## Module E/D — Mobility & food

| ID | Feature | Priority | Depends on | Phase |
|---|---|---|---|---|
| F-110 | Food venue discovery (as places) + external links | MVP (as places) | — | P-3 |
| F-111 | In-app ordering / ride booking | Rejected until provider authorization | Partnerships | — |
| F-112 | Bike-friendly routes / APAR stations as places | Next | DS records | — |

## Module I — Digital inventory

| ID | Feature | Priority | Depends on | Phase |
|---|---|---|---|---|
| F-120 | "Things I have" preference (bike/car/camera) | MVP (part of F-002) | — | P-4 |
| F-121 | Inventory as avatar items | Next | F-014 | — |

## Monetization

| ID | Feature | Priority | Note |
|---|---|---|---|
| F-130 | Sponsored placements (always labelled) | Later | D-12 |
| F-131 | Organizer subscriptions/analytics | Later | D-12 |
