# MVP Scope

Status: Draft 0.1 · 2026-11-14 · Related: [FEATURE_CATALOG.md](./FEATURE_CATALOG.md), [PRODUCT_REQUIREMENTS_DOCUMENT.md](./PRODUCT_REQUIREMENTS_DOCUMENT.md), [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)

## 1. MVP definition

**"What's on in Baku" — verified events, places and cinema showtimes, delivered through an avatar-first home, with save, reminders, invites, light social features, an organizer portal and an admin review pipeline.**

The MVP is delivered in three increments so that **partnerships never block the technical prototype** ([CONFIRMED]):

| Increment | Audience | Data | Purpose |
|---|---|---|---|
| **MVP-0 Technical prototype** | Founder + a few testers | Manually curated + organizer form + permitted public feeds; **synthetic users only** | Prove the stack, pipeline, avatar runtime, admin workflow. No real personal data → hosting decision can wait. |
| **MVP-1 Private beta** | 50–200 invited users (target segment) | Curated + organizers + first automated sources | Validate value, accuracy, workload. Requires legal answers for consent, age, hosting. |
| **MVP-2 Public beta** | Open on stores + web | All approved sources | Validate retention and growth |

## 2. Included

| Area | Included features |
|---|---|
| Accounts | F-001 (email OTP, Google, Apple), F-002, F-003, F-004, F-005 (deletion) |
| Avatar | F-010, F-011, F-012 (v0 art style; see [AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md#10-production-scenarios)) |
| Discover | F-020 – F-028 |
| Save | F-030, F-031 |
| Social (light) | F-040 – F-044 |
| Notifications | F-050 – F-053 |
| Organizer | F-060, F-061, F-062 (conditional on Meta App Review) |
| Admin/ops | F-070 – F-076 |
| AI pipeline | F-080 – F-086 |
| Places for food & mobility | F-110 (places + links), F-120 |

## 3. Excluded (and why)

| Excluded | Reason | Revisit |
|---|---|---|
| Social feed, posts, comments, communities, DMs | [CONFIRMED] out of MVP; moderation burden for a solo founder | After MVP-2 metrics |
| Payments, ticketing, ordering, ride booking | [CONFIRMED] no authorized integrations | When a partner authorizes |
| 3D avatar/world | [CONFIRMED] | After 2D avatar validated |
| Deals/supermarket offers | No authorized feeds; validity dates unreliable | Partner-driven |
| AI chat assistant | Needs dense verified data; cost and safety work | Next (F-090) |
| Live/friend location sharing | Privacy & new minors law; low early value | Later, after legal review |
| Other cities | Focus | After Baku metrics |
| Phone OTP | SMS cost (see [COST_AND_RESOURCE_ESTIMATE.md](./COST_AND_RESOURCE_ESTIMATE.md#22-sms-one-time-codes)) | If email/social sign-in conversion is poor |

## 4. Acceptance criteria by epic

**E1 Accounts & consent**
- A new user can complete sign-up with each provider on Android, iOS and web.
- Consent versions are stored with timestamp and are retrievable per user.
- Account deletion removes personal data within 30 days and revokes Apple tokens; verified by test.

**E2 Avatar**
- Avatar creation completes in ≤90 s for 80% of test users.
- Home avatar runs ≥50 fps on the reference mid-range Android device; pauses when off-screen; static fallback appears when reduced motion is on or the device is in the low-end class.
- Avatar config round-trips (save → load → identical render) across platforms.

**E3 Discover & detail**
- "Tonight" returns only occurrences starting within the configured window with `lifecycle_status=scheduled` and `verification_status ∈ {auto_approved, staff_verified}`.
- Every published item shows trust badge, source attribution and last verified time.
- Search finds items by Azerbaijani, Russian and English title variants with one typo.
- Public web event page renders without login and has correct Open Graph metadata.

**E4 Save & reminders**
- Reminders fire at configured offsets ±5 min, never during quiet hours (except transactional change/cancel alerts, which respect user setting).
- A cancellation of a saved occurrence triggers an alert within 1 h of curator/source update.

**E5 Social**
- Friend visibility rules are enforced server-side (tests for only-me / friends / public / blocked).
- Invite link opens the app if installed, otherwise the web page.

**E6 Organizer portal**
- An organizer can submit an event in any of the three languages; it enters the review queue; status is visible to them.

**E7 Admin & pipeline**
- A curator can process a review task with keyboard-only flow; median handling time is measured.
- Adding a new RSS/ICS source requires configuration only (no code change).
- Auto-approval can be enabled per source with thresholds; audit samples are generated automatically.

**E8 Notifications**
- Daily budget and quiet hours are enforced server-side; duplicate suppression proven by test.

## 5. Success metrics

| Metric | MVP-1 private beta target | MVP-2 public beta target |
|---|---|---|
| Published verified occurrences per week (Baku) | ≥100 | ≥150 |
| Critical-field correctness (weekly audit) | ≥95% | ≥97% |
| Users who save or share ≥1 item per week (of WAU) | ≥30% | ≥35% |
| Week-4 retention | ≥20% | ≥20% |
| Push opt-in / monthly opt-out | ≥50% / <10% | ≥50% / <10% |
| Time to first save (new user, median) | <2 min | <2 min |
| Curator time per published item (median) | ≤3 min | ≤1.5 min |
| Founder curation hours per week | ≤8 h | ≤6 h |

Targets are hypotheses to be revised after P-0 ([PRODUCT_DISCOVERY.md](./PRODUCT_DISCOVERY.md#6-assumptions-and-validation-plan)).

## 6. What first users can do

Within 30 seconds of opening the app, find something worth doing tonight or this weekend near them; trust that it is really happening; save it, get reminded, and bring a friend — with an avatar that feels like theirs.
