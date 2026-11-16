# Security and Privacy

Status: Draft 0.2 · 2026-11-16 (auth options reopened; location and analytics minimised) · Related: [LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md), [DATABASE_DESIGN.md](./DATABASE_DESIGN.md), [AI_CITY_INTELLIGENCE.md](./AI_CITY_INTELLIGENCE.md#10-ai-safety-and-security), [ADR-0010](./adr/ADR-0010-authentication-approach.md)

> Not legal advice. Legal obligations are listed as questions for counsel in [LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md#3-questions-for-azerbaijani-legal-counsel).

## 1. Security objectives

1. Protect users' personal data, especially location, social graph and consents.
2. Prevent publication of false or malicious content (data integrity is a product promise).
3. Keep a one-person operation secure through defaults, automation and minimal surface.

## 2. Threat model (STRIDE summary)

| Asset / flow | Threat | Example | Controls |
|---|---|---|---|
| Accounts | Spoofing | Credential stuffing, OTP brute force | No passwords; OTP 6 digits, 10-min expiry, 5 attempts, per-IP/user rate limits; OIDC token validation (issuer, audience, nonce) |
| Sessions | Spoofing | Stolen refresh token | Rotation with reuse detection; device-bound sessions; revoke all on suspicion |
| Friends/attendance | Information disclosure | Enumerating who attends what | Server-side visibility checks; blocks enforced; no public friend lists by default; rate limits on profile lookups |
| Location | Information disclosure | Inferring home from "near" queries | Coarse geohash only; no storage; no location in logs |
| Content | Tampering | Fake events via organizer portal; malicious links | Organizer verification; review queue; URL checks; reporting |
| Pipeline | Tampering / elevation | Prompt injection in collected posts | See §7 |
| Admin | Elevation | Account takeover of founder | Hardware-key or TOTP 2FA on admin; separate admin role; IP allowlist optional; audit log |
| API | Denial of service | Scraping/abuse | Rate limits; caching; bot heuristics on public pages |
| Uploads | Tampering | Malicious files | Type sniffing, size limits, re-encode images, strip metadata (EXIF GPS), private bucket + signed URLs, no SVG uploads |
| Secrets | Disclosure | Leaked keys in repo | Secrets in environment/secret store only; secret scanning in CI; `.env` git-ignored |
| Dependencies | Tampering | Supply-chain attack | Lockfiles; automated dependency updates; audit in CI; minimal dependencies |
| Backups | Disclosure | Stolen backup | Encrypted backups; separate credentials; restore tests |
| Repudiation | Admin denies change | — | Append-only audit log |

## 3. Authentication options compared

| Option | User friction | Cost | Platform/legal notes | Recommendation |
|---|---|---|---|---|
| **Email one-time code** | Low–medium | Email provider free tiers likely sufficient early [ASSUMPTION — choose provider in P-2] | Requires email delivery reputation (SPF/DKIM/DMARC) | **MVP** |
| **Google Sign-In** | Very low | Free | Offering it on iOS triggers App Store guideline 4.8: must also offer an equivalent privacy-focused login; Sign in with Apple satisfies it (checked 2026-11-14) | **MVP** |
| **Sign in with Apple** | Very low on iOS | Free; requires Apple Developer Program ($99/yr) | Apps offering Sign in with Apple must also support in-app account deletion and token revocation | **MVP** |
| **Phone OTP (SMS)** | Low; familiar locally [ASSUMPTION] | ~$0.25–$0.47 per SMS to Azerbaijani networks via Plivo; Twilio reported higher (checked 2026-11-14) | SMS fraud ("pumping") risk; sender ID registration rules [UNVERIFIED] | **Deferred** (D-05) |
| Telegram Login | Low for Telegram users [ASSUMPTION] | Free [UNVERIFIED] | Counts as third-party login under 4.8 | Later, evaluate |
| Facebook Login | Low | Free | Meta data-sharing concerns; 4.8 applies | Not planned |
| Passwords | Medium | Free | Highest security burden | **Rejected** |
| Passkeys | Low | Free | Good future addition | Next |

### 3.1 Implementation approaches (decision OPEN — blocked by spike S-AUTH)

Rule in every option: **no custom cryptography or custom authentication protocols.** Token signing, OIDC validation, OTP generation and session handling come from vetted, maintained libraries or services.

| Criterion | **A. Managed authentication** (e.g. Supabase Auth, Clerk, Auth0, Firebase Auth) | **B. Library-based in NestJS** (vetted OIDC/session/OTP libraries; candidate list fixed in S-AUTH) | **C. Self-hosted identity server** (e.g. Keycloak, Ory Kratos/Hydra, Zitadel) |
|---|---|---|---|
| Security | Strong defaults; provider handles patching; breach at provider is outside your control | Depends on correct composition of libraries; more ways to misconfigure | Mature, feature-rich; security depends on keeping the server patched and correctly configured |
| Maintenance | Lowest | Medium (library upgrades, own flows, tests) | Highest (another service to run, upgrade, back up, monitor) |
| Portability | Lock-in to provider APIs; user export/migration path must be checked (password-less helps) | High (identity data in own Postgres) | High (open source; own database) |
| Cost | Free tiers then per-MAU (Supabase: 50,000 MAU free; Pro from $25/month with 100,000 MAU — official, 2026-11-16; others **not verified here**) | $0 software; email delivery cost | $0 software; extra compute and ops time |
| Data residency | Provider regions; Azerbaijan region **not found** for the examples [UNVERIFIED — check in S-AUTH] | Wherever Salaam is hosted | Wherever Salaam is hosted |
| Solo-founder suitability | Best for speed, if residency/legal answers allow | Good if the founder can review auth code; needs strong tests | Poor for MVP (operational load) |
| Apple/Google sign-in, account deletion, Apple token revocation | Usually built-in or documented | Must be implemented with libraries | Usually supported; configuration work |

**Spike S-AUTH (P-1, 2–3 dd)** evaluates one candidate from A and one or two from B (C only if counsel requires in-country identity and B fails). It implements, for each: email code, Google, Apple (incl. token revocation on deletion), refresh-token rotation with reuse detection, account deletion, admin TOTP, Expo integration, and user export. Decision criteria: security review checklist, hours to implement, ongoing maintenance estimate, data-residency fit with D-02, cost at 5,000 MAU, and migration path. Result recorded by updating [ADR-0010](./adr/ADR-0010-authentication-approach.md).

App Store also requires that apps supporting account creation offer in-app account deletion (guideline 5.1.1(v)).

## 4. Authorization

- RBAC roles: user, organizer (scoped), curator, moderator, admin.
- Object-level checks in each module service, not only controllers; deny by default.
- Visibility resolver (single shared function) for profiles, attendances and friends lists; covered by exhaustive tests (only_me / friends / public × blocked / not blocked × friend / stranger).
- Admin actions require recent re-authentication for destructive operations.

## 5. Location privacy

### 5.1 Two different things

| | **Home area (voluntary, stored)** | **Current approximate location (temporary, not stored)** |
|---|---|---|
| What | A district the user **chooses from a list** (e.g. "Nəsimi"), optional | The device's position, coarsened on the device to a ~1 km cell, used for one "near me" request |
| Purpose | Default area for suggestions when location is off | "Now near me" results |
| Consent | Part of profile; explained at selection | OS location permission **and** consent `location_reco` |
| Storage | `profiles.home_district_id` (user can clear it) | **Never stored**: not in DB, not in logs, not in analytics, not in error reports |
| Visibility | Only the user | Nobody |

### 5.2 Coarse location is not anonymous

A ~1 km cell or a district combined with a user ID, timestamps or repetition can reveal home, work, routines and attendance patterns. In low-density areas a cell can point to a single building cluster. The documents therefore treat **any** location tied to a user, including coarse cells, districts and future "going" attendance at a venue, as **personal data** (privacy class P2). The analytics design must not create a location history.

### 5.3 Controls

| Principle | Implementation |
|---|---|
| Private by default | No location permission requested during onboarding; optional district choice instead |
| Coarse on the device | Precise coordinates never leave the device; the app sends a geohash-6 cell (~1.2 × 0.6 km) |
| Not in URLs or logs | Approximate area is sent in a request **header** (`X-Approx-Area`), not a query parameter, so access logs, CDN logs and error trackers don't capture it; header excluded from logging and error breadcrumbs by configuration and tested |
| No location history | `interaction_events` contain **no location fields** in MVP ([DATABASE_DESIGN.md](./DATABASE_DESIGN.md#57-interaction--recommendation-data)) |
| Home area | District ID only (no geohash, no coordinates) |
| Attendance reveals future whereabouts | "Going" at a venue/time is location-like data; MVP offers only `only_me` and `friends` visibility (public option proposed to be deferred, D-24) |
| Separate permissions | Location-based recommendations (`location_reco`) and any future social location sharing (separate consent, Later) |
| Instant disable | One toggle; takes effect immediately on device and server |
| Visibility indicator | When current-location features are active, an indicator appears on Home |
| No IP-derived location | IP addresses are not geolocated |

### 5.4 Minimum location data for MVP [RECOMMENDED, D-28]

1. Optional home district (stored, user-deletable).
2. Optional per-request approximate cell (never stored).
3. Nothing else: no location in analytics, no background location, no location sharing.

## 6. Privacy by design

- **Data minimisation:** no contacts upload in MVP; no ad SDKs; no third-party analytics SDK without review.
- **Purpose limitation:** each optional purpose has its own consent record (FR-004).
- **Transparency:** privacy policy in az/ru/en; in-app "why we ask" notes; data export (Next).
- **Retention:** per [DATABASE_DESIGN.md](./DATABASE_DESIGN.md#8-retention-summary).
- **Pipeline content:** collected public content may include personal data of third parties (faces, names in posts); minimise: store text needed for extraction, purge raw items per retention, don't index people.
- **LLM calls:** extraction/translation prompts contain only public/organizer content; user-entered text (assistant, later) is personal data → cross-border question QL-04.
- **Minors:** default 18+ (D-03) pending QL-01.
- **IP addresses:** hashing an IPv4 address does not anonymise it (the whole address space can be hashed and matched). Consent records store **no IP** unless counsel requires it as evidence (QL-02); then encrypted with a defined retention. Short-lived security logs (rate limiting, abuse) keep IPs ≤30 days. Staff audit logs keep the actor's IP ≤90 days.
- **Analytics (MVP):** no third-party analytics SDK. Product metrics are computed from the database as aggregates. Raw `interaction_events` (view, save, dismiss, open_link, share) have **no location**, are kept ≤90 days, then aggregated per user × category and the raw rows deleted. Legal basis and consent for interaction logging and personalisation: QL-14.
- **Research data (P-0):** interview notes anonymised, contacts stored separately and deleted after P-0, recordings only with consent and deleted ≤30 days (QL-15).

## 7. AI-specific security

| Risk | Control |
|---|---|
| Prompt injection via collected content | No tools for extraction model; untrusted content delimited; schema-constrained output; post-validation; publication only via policy engine/human |
| Malicious external content | Content treated as data; URLs validated; no automatic following of links found in content |
| Untrusted source data | Trust tiers; automation earned per source; audit sampling |
| Data leakage | No personal data in pipeline prompts; provider settings for no training on API data verified per provider [OPEN — check each provider's terms] |
| Excessive tool permissions | Gateway exposes no write tools; assistant (Next) gets read-only tools scoped to public data + the requesting user's own saves |
| Hallucinated event details | Evidence spans required; critical fields verified; UI never shows unverified critical fields as fact |
| Unauthorized actions | No AI-initiated messages, bookings or posts |
| Cost abuse | Daily/monthly LLM budgets; per-source caps |

## 8. Operational security (solo-founder baseline)

- 2FA on all provider accounts (GitHub, cloud, Apple, Google, Meta, domain registrar, email provider); recovery codes stored offline.
- Separate production credentials; least-privilege API keys; quarterly key rotation reminder.
- Automated backups (daily) + monthly restore test; documented incident runbook.
- Dependency and secret scanning in CI; container images rebuilt monthly.
- Security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy) on web.
- OWASP ASVS Level 1 as baseline checklist before MVP-1; OWASP API Top 10 review before MVP-2.

## 9. Incident response (minimal)

1. Detect (alerts/user report) → 2. Contain (revoke keys, disable feature flag, suspend source) → 3. Assess personal-data impact → 4. Notify as legally required (QL-11) → 5. Fix + post-mortem in `docs/incidents/` (no personal data).

## 10. Content moderation

- Report → moderation queue → actions (hide, remove, suspend user, ban organizer).
- Response targets in beta: reports reviewed within 48 h; illegal content removed promptly on knowledge.
- Spam heuristics for organizer submissions (rate limits, duplicate detection, link reputation).
