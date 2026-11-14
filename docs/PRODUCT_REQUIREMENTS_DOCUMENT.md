# Product Requirements Document (PRD)

Status: Draft 0.1 · 2026-11-14 · Related: [FEATURE_CATALOG.md](./FEATURE_CATALOG.md), [MVP_SCOPE.md](./MVP_SCOPE.md), [UX_UI_SPECIFICATION.md](./UX_UI_SPECIFICATION.md), [API_SPECIFICATION.md](./API_SPECIFICATION.md)

## 1. Purpose

Defines what Salaam must do (functional requirements, FR) and how well (non-functional requirements, NFR). Priority: **M** = MVP (private/public beta), **N** = Next (post-MVP), **L** = Later. Feature IDs (`F-nnn`) link to [FEATURE_CATALOG.md](./FEATURE_CATALOG.md).

## 2. Confirmed constraints

[CONFIRMED 2026-11-14] Solo founder; Claude Code as primary development tool; small budget; no team; Baku pilot; Azerbaijan market; az/ru/en from start; Web + Android + iOS; mobile-first implementation acceptable; human verification initially with progressive automation; partnerships non-blocking; hosting jurisdiction undecided; no full social feed, communities, payments, 3D avatar or transactional integrations in the first MVP.

## 3. Goals and non-goals

**Goals (MVP):** G1 verified discovery of events/places/cinema in Baku; G2 avatar-first identity and home; G3 save, remind, invite; G4 light social (friends, going); G5 organizer submission; G6 admin + review pipeline with measurable accuracy; G7 respectful notifications.

**Non-goals (MVP):** full social feed, communities, chat; payments/booking; deals module; AI chat assistant (beyond optional experiment); 3D; cities other than Baku; live location sharing with friends.

## 4. Functional requirements

### 4.1 Account, onboarding, profile

| ID | Requirement | Pri | Feature |
|---|---|---|---|
| FR-001 | Users can sign up / sign in with email one-time code, Google, and Sign in with Apple (iOS requirement when Google is offered). Phone OTP is optional and deferred (D-05). | M | F-001 |
| FR-002 | Onboarding collects: UI language, interests (fixed taxonomy), optional "things I have" (bike, car, camera), optional approximate area. All optional except language. | M | F-002 |
| FR-003 | Onboarding includes age confirmation per the approved age policy (D-03, default 18+). | M | F-001 |
| FR-004 | Explicit, versioned consent records are captured for terms, privacy policy, and each optional processing purpose (location-based recommendations, personalised notifications, social visibility). | M | F-003 |
| FR-005 | Users have a profile: display name, username, avatar, optional short bio, interests; each field has an audience setting (only me / friends / public). | M | F-004 |
| FR-006 | Users can delete their account in-app; deletion completes within 30 days, revoking third-party tokens (Apple). | M | F-005 |
| FR-007 | Users can export their data (JSON) on request. | N | F-005 |

### 4.2 Avatar

| ID | Requirement | Pri | Feature |
|---|---|---|---|
| FR-020 | Users create an avatar in ≤90 s from a slot-based editor (body, skin tone, hair+colour, face, outfit, accessories); a "randomise" and a default are available. | M | F-010 |
| FR-021 | The avatar is shown animated on the home screen with state-driven animations (idle, greet, happy, thinking, pointing, celebrate, sorry, sleepy). | M | F-011 |
| FR-022 | The avatar reacts to user actions (save → celebrate; empty results → sorry; loading → thinking). | M | F-011 |
| FR-023 | A static avatar render (PNG/WebP) is available for lists, notifications, social cards, low-end devices and reduced-motion mode. | M | F-012 |
| FR-024 | Avatar config is stored as versioned data independent of the renderer. | M | F-010 |
| FR-025 | Users unlock additional items (non-monetary) through activity (e.g. first event attended). | N | F-013 |
| FR-026 | "Things I have" can appear as avatar items (bike, camera, backpack) and influence recommendations. | N | F-014 |

### 4.3 Discover, events, places, cinema

| ID | Requirement | Pri | Feature |
|---|---|---|---|
| FR-040 | Discover offers time lenses: Now (next 3 h), Tonight, This weekend, Pick a date. | M | F-020 |
| FR-041 | Users filter by category, price (free / paid / unknown), distance (if location granted or area chosen), language of event if known. | M | F-020 |
| FR-042 | List and map views of the same result set. | M | F-021 |
| FR-043 | Full-text search across events and places in az/ru/en with typo tolerance. | M | F-022 |
| FR-044 | Event detail shows title, occurrence(s), place with map, description, organizer, price (only if stated by source), ticket/external link, trust badge, source attribution, last verified time, and field-level "unconfirmed" markers. | M | F-023 |
| FR-045 | Place detail shows name, category, address, map, opening hours if known, upcoming occurrences, source attribution. | M | F-024 |
| FR-046 | Cinema: films now showing with showtimes by cinema and date; format/language if known; booking link-out. | M | F-025 |
| FR-047 | Cancelled/ended items are hidden from discovery but reachable by direct link with clear status. | M | F-023 |
| FR-048 | Recommendations on home explain "why" (e.g. "near your area", "matches: jazz", "2 friends going"). | M | F-026 |
| FR-049 | Directions hand-off to the user's maps app; mobility hand-off links (Bolt, APAR) where permitted. | M | F-027 |
| FR-050 | Public web pages for events and places (shareable, indexable, no login required). | M | F-028 |

### 4.4 Save, remind, plan

| ID | Requirement | Pri | Feature |
|---|---|---|---|
| FR-080 | Save any occurrence or place. | M | F-030 |
| FR-081 | Reminders for saved occurrences at T−24 h and T−2 h (user-configurable). | M | F-031 |
| FR-082 | If a saved occurrence is cancelled/changed, the user is notified (transactional). | M | F-031 |
| FR-083 | Shared plans (group lists) with friends. | N | F-032 |

### 4.5 Social (light, MVP)

| ID | Requirement | Pri | Feature |
|---|---|---|---|
| FR-090 | Friend requests (send/accept/decline), friend list, unfriend, block. | M | F-040 |
| FR-091 | Invite links (deep links) to the app and to a specific occurrence; works for non-users via web page. | M | F-041 |
| FR-092 | Going / Interested on occurrences with visibility (only me / friends / public); default **friends**. | M | F-042 |
| FR-093 | "Friends going" shown on occurrences and as a home widget, respecting visibility and blocks. | M | F-042 |
| FR-094 | Follow places and organizers. | M | F-043 |
| FR-095 | Report a user, event or place; block a user. | M | F-044 |
| FR-096 | Groups/communities, posts, comments, reactions. | L | F-045 |
| FR-097 | Friends-only coarse location sharing ("in Old City now"). | L | F-046 |

### 4.6 Notifications

See [NOTIFICATION_ARCHITECTURE.md](./NOTIFICATION_ARCHITECTURE.md).

| ID | Requirement | Pri | Feature |
|---|---|---|---|
| FR-110 | Push (Android/iOS), web push (optional), and in-app inbox. | M | F-050 |
| FR-111 | Per-category toggles, quiet hours (default 22:00–09:00 Asia/Baku), daily budget (default 2 non-transactional). | M | F-051 |
| FR-112 | Types in MVP: reminders, change/cancel alerts, friend requests/invites, weekend digest (Thu), optional tonight digest. | M | F-052 |
| FR-113 | Location-based and AI-personalised alerts are off by default and require separate consent. | M | F-051 |
| FR-114 | Every notification deep-links to its content. | M | F-053 |

### 4.7 Organizer portal (web)

| ID | Requirement | Pri | Feature |
|---|---|---|---|
| FR-130 | Organizer registration and claim of a place/organizer profile (verified manually by curator). | M | F-060 |
| FR-131 | Event submission form (multilingual fields, occurrences, place, price, ticket link, image with rights confirmation). | M | F-061 |
| FR-132 | Connect organizer's own professional Instagram account (after Meta App Review approval) to import posts as drafts. | M | F-062 |
| FR-133 | Organizer sees status of submissions (pending, published, rejected with reason). | M | F-061 |
| FR-134 | Basic stats (views, saves) for their events. | N | F-063 |

### 4.8 Admin and content operations

See [CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md).

| ID | Requirement | Pri | Feature |
|---|---|---|---|
| FR-150 | Role-based admin (admin, curator, moderator). | M | F-070 |
| FR-151 | CRUD for places, organizers, events, occurrences, films, categories, translations. | M | F-071 |
| FR-152 | Review queue with side-by-side source evidence and extracted fields; approve / edit / merge / reject; keyboard shortcuts. | M | F-072 |
| FR-153 | Source registry management (DS records, connector config, schedules, automation level). | M | F-073 |
| FR-154 | Job monitor (runs, failures, retries) and data-freshness dashboard. | M | F-074 |
| FR-155 | Quality dashboard: field accuracy, auto-approval precision (audit), curator minutes/item, queue age. | M | F-075 |
| FR-156 | Moderation of reports; user suspension; audit log of all admin actions. | M | F-076 |

### 4.9 AI city intelligence

See [AI_CITY_INTELLIGENCE.md](./AI_CITY_INTELLIGENCE.md).

| ID | Requirement | Pri | Feature |
|---|---|---|---|
| FR-170 | Connector framework supports new source types without pipeline changes. | M | F-080 |
| FR-171 | Scheduled collection per source policy; on-demand re-check by curator. | M | F-081 |
| FR-172 | Structured extraction with per-field evidence and confidence; nothing invented. | M | F-082 |
| FR-173 | Entity resolution and duplicate suggestion. | M | F-083 |
| FR-174 | Source-specific auto-approval policies with audit sampling. | M | F-084 |
| FR-175 | Pre-event re-verification job for occurrences with saves. | M | F-085 |
| FR-176 | Machine translation of verified content, labelled as such. | M | F-086 |
| FR-177 | AI city assistant over verified data (read-only tools). | N | F-090 |

### 4.10 Localization

| ID | Requirement | Pri |
|---|---|---|
| FR-210 | UI fully localized in az, ru, en; language switch at any time. | M |
| FR-211 | Content fields stored per locale with fallback chain (user locale → original → az → ru → en). | M |
| FR-212 | Dates, times, numbers formatted per locale; all times displayed in Asia/Baku unless stated. | M |

## 5. Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-001 | Performance | Home screen interactive ≤2.5 s on a mid-range Android device on 4G (cold start excluded); avatar loads lazily after first paint. |
| NFR-002 | Performance | Discover API p95 ≤400 ms at beta load. |
| NFR-003 | Availability | Beta target 99.5% monthly for public API (single-region, single-node acceptable). |
| NFR-004 | Data quality | ≥95% critical-field correctness on weekly audit sample of published items. |
| NFR-005 | Freshness | Occurrences with saves re-verified within 24 h before start (where the source allows). |
| NFR-006 | Privacy | Precise location never persisted; coarse area only, request-scoped (see [SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md#5-location-privacy)). |
| NFR-007 | Security | OWASP ASVS L1 baseline; object-level authorization tested on every endpoint. |
| NFR-008 | Accessibility | WCAG 2.2 AA for web; platform accessibility APIs on mobile; reduced-motion respected. |
| NFR-009 | Localization | No hard-coded strings; RU text expansion (+30%) tolerated in layouts. |
| NFR-010 | Cost | Monthly running cost within the approved scenario in [COST_AND_RESOURCE_ESTIMATE.md](./COST_AND_RESOURCE_ESTIMATE.md); LLM spend capped per day. |
| NFR-011 | Operability | One person can deploy, back up, restore and roll back using documented scripts; restore tested quarterly. |
| NFR-012 | Portability | No hard dependency on a single cloud vendor; Postgres + S3-compatible storage + containers ([ADR-0017](./adr/ADR-0017-hosting-portable-deferred.md)). |
| NFR-013 | Observability | Errors and job failures alert the founder; structured logs retained 14–30 days. |
| NFR-014 | Compliance | Legal requirements confirmed by counsel are traced to controls before public beta. |

## 6. Acceptance

Per-epic acceptance criteria are in [MVP_SCOPE.md](./MVP_SCOPE.md#4-acceptance-criteria-by-epic).
