# ADR-0010: Authentication — in-house module, library-based

Status: Proposed · 2026-11-14 · Gate: spike S-AUTH (library selection) · Decision D-05

## Context
Hosting jurisdiction is undecided (D-02); managed identity providers store identities in their own regions. Sign-in methods: email one-time code, Google, Apple (App Store guideline 4.8 requires an equivalent privacy-focused option when Google is offered; Sign in with Apple satisfies it). In-app account deletion is required by App Store guideline 5.1.1(v).

## Decision
Implement an `identity` module in NestJS using a well-maintained authentication library for OIDC token verification and session handling (candidate selected in spike S-AUTH). No passwords. Short-lived access tokens + rotating refresh tokens with reuse detection. Admin accounts require TOTP/hardware-key 2FA.

## Alternatives considered
- **Supabase Auth** — free plan includes 50,000 MAU, Pro $25/month (reported 2026-11-14); fast; ties identity data to Supabase's hosting.
- **Clerk / Auth0** — polished; per-MAU pricing; foreign data hosting.
- **Keycloak / Ory (self-hosted)** — full-featured; heavy to operate alone.

## Consequences
+ Portable, no per-user fees, full control over consent and deletion flows.
− Security responsibility: rely on library defaults, exhaustive tests, external review before MVP-2.

## Solo-founder notes
Cost $0 + email delivery. Introduce P-2. Postpone phone OTP (SMS cost), passkeys, Telegram login. Revisit managed auth if hosting abroad is approved.

## Related
[SECURITY_AND_PRIVACY.md](../SECURITY_AND_PRIVACY.md#3-authentication-options-compared)
