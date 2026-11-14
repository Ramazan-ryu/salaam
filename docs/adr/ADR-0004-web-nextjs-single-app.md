# ADR-0004: Web — single Next.js app (public, app, organizer, admin)

Status: Proposed · 2026-11-14 · Supersedes Phase 0 idea of a separate admin app

## Context
The web must serve shareable, indexable event/place pages, a logged-in web experience, an organizer portal and an admin console. A solo founder should run as few deployables as possible.

## Decision
One Next.js application with route groups: public (`/e`, `/p`, `/city`), app, `/organizer`, `/admin`. Admin and organizer routes are protected by middleware + server-side role checks; admin code is route-split and never shipped to public pages. Deployed as a Node container (no hosting-vendor lock-in).

## Alternatives considered
- **Separate admin app** — stronger isolation; extra deployment and auth wiring.
- **Astro for public pages + SPA admin** — great SEO; two frameworks.
- **Expo Router web for everything** — max sharing with mobile; weaker SSR/SEO maturity [ASSUMPTION].

## Consequences
+ One web deployment; shared components and auth.
− Admin security relies on correct route protection → tests for every admin route; optional IP allowlist; admin 2FA.

## Solo-founder notes
Cost $0 (self-hosted). Introduce: P-3 (admin, portal), P-4 (public polish). Postpone: logged-in web parity with mobile.

## Related
[ARCHITECTURE_REVIEW.md](../ARCHITECTURE_REVIEW.md#21-nextjs-web)
