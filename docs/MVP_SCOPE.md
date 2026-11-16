# MVP Scope

Status: Draft 0.2 · 2026-11-16 (acceptance aligned to platform stages; targets recalibrated for 10–15 h/week) · Related: [FEATURE_CATALOG.md](./FEATURE_CATALOG.md), [PRODUCT_REQUIREMENTS_DOCUMENT.md](./PRODUCT_REQUIREMENTS_DOCUMENT.md#21-platform-stages-which-requirements-apply-where), [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)

## 1. MVP definition

**"What's on in Baku": verified events, places and cinema, delivered through an avatar-first home, with save, reminders, invites, light social features, an organizer portal and an admin review pipeline.** [Unchanged from 0.1; scope is preserved.]

The MVP is delivered in increments so that **partnerships never block the technical prototype** ([CONFIRMED]):

| Increment | Platform stages | Audience | Data | Purpose |
|---|---|---|---|---|
| **MVP-0 Technical prototype** | S1 + S2 (internal) | Founder + a few testers | Curated + organizer form + permitted feeds; **synthetic users only** | Prove stack, pipeline, avatar runtime, admin workflow |
| **MVP-1 Private beta** | S1 + S2 (+ S3 when ready) | 50–200 invited users (target segment) | Curated + organizers + structured feeds | Validate value, accuracy, workload. Requires legal answers (G6) |
| **MVP-2 Public beta** | S1–S4 | Open on stores + web | All approved sources | Validate retention and growth |

**[PROPOSED, D-21] Lean MVP-1:** the first private beta ships a smaller slice of the confirmed scope (see [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md#6-lean-mvp-1-slice-proposed-d-21)). The rest moves to MVP-2; nothing leaves the product scope. Needs owner approval.

## 2. Included (full MVP scope)

| Area | Included features | Lean MVP-1 (if D-21 approved) |
|---|---|---|
| Accounts | F-001 (email code, Google, Apple at S3), F-002, F-003, F-004, F-005 (deletion) | Same, minus Apple (S3) |
| Avatar | F-010, F-011, F-012 (v0 art style; see [AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md#10-production-scenarios)) | v0 with reduced slots, 5 states |
| Discover | F-020 – F-028 | F-020–F-027; F-028 at S4 (or earlier under D-27) |
| Cinema | F-025 | "Now showing" + link to cinema's showtime page (D-26) |
| Save | F-030, F-031 | Same |
| Social (light) | F-040 – F-044 | Share/invite links (F-041) + report (F-044); friends/going/follows in MVP-2 |
| Notifications | F-050 – F-053 | Push + inbox, reminders, change alerts; digests in MVP-2 |
| Organizer | F-060, F-061, F-062 (conditional on Meta App Review) | F-060, F-061 |
| Admin/ops | F-070 – F-076 | Same, basic dashboard |
| AI pipeline | F-080 – F-086 | Drafts only, 100% human approval; ICS/RSS connectors |
| Places for food & mobility | F-110 (places + links), F-120 | Same |

## 3. Excluded (and why)

| Excluded | Reason | Revisit |
|---|---|---|
| Social feed, posts, comments, communities, DMs | [CONFIRMED] out of MVP; moderation burden | After MVP-2 metrics |
| Payments, ticketing, ordering, ride booking | [CONFIRMED] no authorized integrations | When a partner authorizes |
| 3D avatar/world | [CONFIRMED] | After 2D avatar validated |
| Deals/supermarket offers | No authorized feeds; validity dates unreliable | Partner-driven |
| AI chat assistant | Needs dense verified data; cost and safety work | Next (F-090) |
| Live/friend location sharing; public attendance | Privacy; new minors law; low early value | Later, after legal review (D-24) |
| Automated publication (L2+) | [CONFIRMED] human approval in early MVP | After MVP-1 with evidence |
| Other cities | Focus | After Baku metrics |
| Phone OTP | SMS cost ([COST_AND_RESOURCE_ESTIMATE.md](./COST_AND_RESOURCE_ESTIMATE.md#22-sms-one-time-codes)) | If email/social conversion is poor |

## 4. Acceptance criteria by platform stage

Criteria apply at the stage where the feature ships. Full parity across platforms is **not** required before the planned stage.

### S1 — Admin & organizer web
- Staff and organizers sign in with email code or Google; admin accounts have TOTP 2FA.
- A curator processes a review task with a keyboard-only flow; handling time is recorded.
- **No item is publicly visible without a human approval record** (test over all pipeline paths).
- Adding an ICS/RSS source requires configuration only (no code change).
- An organizer submits an event in az, ru or en; it enters the queue; status is visible to them.
- Every admin action is in the audit log.

### S2 — Android (closed testing → private beta)
- New user signs up with email code and Google on Android; consent versions stored with timestamp.
- Account deletion removes personal data within 30 days (verified by test).
- Avatar creation completes in ≤90 s for 80% of test users; home avatar ≥50 fps on the reference mid-range Android device, pauses off-screen; static fallback with reduced motion or on low-end class.
- "Tonight" returns only `scheduled` occurrences that are `staff_verified` (MVP-1) within the window.
- Every item shows trust badge, source attribution and last verified time.
- Search finds items by az/ru/en title variants with one typo.
- Reminders fire at configured offsets ±5 min, never during quiet hours (change/cancel alerts follow user setting); a cancellation of a saved occurrence alerts within 1 h of the curator update.
- Share/invite link opens the app if installed, otherwise the web landing page.
- Approximate location never appears in server logs (test).
- Google Play closed test: ≥12 testers opted in for 14 continuous days before production access (official rule for new personal accounts).

### S3 — iOS (TestFlight)
- All S2 criteria on iOS.
- Sign in with Apple offered alongside Google (guideline 4.8); Apple token revoked on account deletion.

### S4 — Public web pages
- Event/place pages render without login, with correct Open Graph metadata, `hreflang` alternates and schema.org `Event` markup.
- No personal data on public pages; cancelled items show status.

### MVP-2 additions (when shipped)
- Friend visibility enforced server-side (tests for only-me / friends / blocked).
- Daily notification budget, quiet hours and duplicate suppression proven by test for digests.

## 5. Success metrics

Recalibrated 2026-11-16 for a solo founder with 10–15 h/week; still hypotheses, to be revised after G0 ([VALIDATION_METRICS.md](./VALIDATION_METRICS.md)).

| Metric | MVP-1 min | MVP-1 target | MVP-2 target |
|---|---|---|---|
| Verified events per week, Baku (cinema showtimes counted separately) | 40 | 60 | 100 |
| Critical-field correctness (weekly audit) | 95% | 97% | 97% |
| Users who save or share ≥1 item per week (of WAU) | 20% | 30% | 35% |
| Week-4 retention | 15% | 20% | 20% |
| Push opt-in / monthly opt-out | 40% / <15% | 50% / <10% | 50% / <10% |
| Time to first save (new user, median) | <3 min | <2 min | <2 min |
| Curator time per published item (median) | ≤5 min | ≤4 min | ≤2 min |
| Founder content-ops hours per week | ≤6 h | ≤5 h | ≤5 h (or curator) |

## 6. What first users can do

Within 30 seconds of opening the app, find something worth doing tonight or this weekend near them; trust that it is really happening; save it, get reminded, and share it with a friend — with an avatar that feels like theirs.
