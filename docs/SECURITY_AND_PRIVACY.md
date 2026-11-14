# Security and Privacy

Status: Draft 0.1 · 2026-11-14 · Related: [LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md), [DATABASE_DESIGN.md](./DATABASE_DESIGN.md), [AI_CITY_INTELLIGENCE.md](./AI_CITY_INTELLIGENCE.md#10-ai-safety-and-security), [ADR-0010](./adr/ADR-0010-authentication-in-house-module.md)

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

**Implementation approach:** in-house auth module in NestJS using a maintained library for OIDC and token handling ([ADR-0010](./adr/ADR-0010-authentication-in-house-module.md)), because hosting jurisdiction is undecided and managed auth services do not offer Azerbaijani data residency [ASSUMPTION]. Re-evaluate managed auth (e.g. Supabase Auth: free plan includes 50,000 MAU; Pro $25/month — checked 2026-11-14) if hosting abroad is approved.

App Store also requires that apps supporting account creation offer in-app account deletion (guideline 5.1.1(v)).

## 4. Authorization

- RBAC roles: user, organizer (scoped), curator, moderator, admin.
- Object-level checks in each module service, not only controllers; deny by default.
- Visibility resolver (single shared function) for profiles, attendances and friends lists; covered by exhaustive tests (only_me / friends / public × blocked / not blocked × friend / stranger).
- Admin actions require recent re-authentication for destructive operations.

## 5. Location privacy

| Principle | Implementation |
|---|---|
| Private by default | No location permission requested during onboarding; user may choose an approximate area manually |
| Coarse only on server | Clients send geohash precision ≤6 (~1.2 × 0.6 km cell) for "near" queries; server rejects precise coordinates on discovery endpoints |
| No storage of live location | Not stored in DB; not written to logs (log scrubbing of query params `near`) |
| Home area | Optional, stored at geohash precision 5 (~4.9 × 4.9 km) |
| Separate permissions | Location-based recommendations (consent `location_reco`) and social location sharing (Later, separate consent) are separate |
| Instant disable | One toggle in settings; takes effect immediately client- and server-side |
| Visibility indicators | When any location-based feature is active, a visible indicator appears on Home |
| Device-only precision | Precise location (if granted) used only on-device to center the map and compute a geohash |

## 6. Privacy by design

- **Data minimisation:** no contacts upload in MVP; no ad SDKs; no third-party analytics SDK without review.
- **Purpose limitation:** each optional purpose has its own consent record (FR-004).
- **Transparency:** privacy policy in az/ru/en; in-app "why we ask" notes; data export (Next).
- **Retention:** per [DATABASE_DESIGN.md](./DATABASE_DESIGN.md#8-retention-summary).
- **Pipeline content:** collected public content may include personal data of third parties (faces, names in posts); minimise: store text needed for extraction, purge raw items per retention, don't index people.
- **LLM calls:** extraction/translation prompts contain only public/organizer content; user-entered text (assistant, later) is personal data → cross-border question QL-04.
- **Minors:** default 18+ (D-03) pending QL-01.

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
