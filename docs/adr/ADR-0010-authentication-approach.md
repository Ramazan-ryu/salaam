# ADR-0010: Authentication approach

Status: **Proposed — decision open, blocked by spike S-AUTH** · 2026-11-16 · Supersedes the 0.1 draft "in-house module" (file renamed) · Decision D-05

## Context
- Sign-in methods (recommended, D-05): email one-time code and Google at S1/S2; Sign in with Apple added at S3 (App Store guideline 4.8 requires an equivalent privacy-focused option when Google is offered); in-app account deletion with Apple token revocation.
- Hosting jurisdiction is undecided (D-02, blocked by legal advice). Managed identity providers store identities in their own regions.
- One founder with 10–15 h/week: security and maintenance burden matter as much as licence cost.
- **Non-negotiable:** no custom cryptography or custom authentication protocols.

## Options

| | A. Managed authentication | B. Library-based NestJS module | C. Self-hosted identity server |
|---|---|---|---|
| Examples | Supabase Auth, Clerk, Auth0, Firebase Auth | Vetted OIDC, session and OTP libraries composed in an `identity` module | Keycloak, Ory Kratos/Hydra, Zitadel |
| Security | Strong defaults; vendor patches | Depends on correct composition; more misconfiguration risk | Mature; patching is on us |
| Maintenance | Lowest | Medium | Highest |
| Portability | Vendor lock-in; check export | High | High |
| Cost | Free tier then per MAU (Supabase: 50,000 MAU free; Pro from $25/month incl. 100,000 MAU — official, 2026-11-16) | $0 + email | $0 + compute + ops |
| Residency | Vendor regions (Azerbaijan not found [UNVERIFIED]) | Wherever Salaam runs | Wherever Salaam runs |
| Solo fit | Best | Good with strong tests | Poor for MVP |

## Spike S-AUTH (P-1, 2–3 dev-days)
Evaluate one candidate from A and one or two from B (C only if counsel requires in-country identity and B fails). For each, build: email code, Google, Apple (incl. token revocation), refresh-token rotation with reuse detection, account deletion, admin TOTP, Expo integration, user export.

**Decision criteria:** security checklist results; founder hours to implement; estimated maintenance hours/month; residency fit with D-02; cost at 5,000 MAU; migration path away; quality of docs/community.

## Decision
Not yet taken. Recorded here after S-AUTH and approved by the founder at G1.

## Consequences (any option)
+ Password-less design (no password storage).
+ Identity separated behind an `identity` module interface, so a later switch affects one module.
− Whichever option is chosen, auth flows get exhaustive automated tests and an external review before MVP-2.

## Related
[SECURITY_AND_PRIVACY.md](../SECURITY_AND_PRIVACY.md#31-implementation-approaches-decision-open--blocked-by-spike-s-auth), [ARCHITECTURE_REVIEW.md](../ARCHITECTURE_REVIEW.md#28-authentication-decision-open--spike-s-auth)
