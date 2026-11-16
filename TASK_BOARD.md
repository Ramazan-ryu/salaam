# Task Board

Priorities: P0 (blocks the next milestone) · P1 (next milestone) · P2 (later). Statuses per CLAUDE.md.

| ID | Task | Pri | Depends on | Status | Acceptance criteria | Related files |
|---|---|---|---|---|---|---|
| TB-01 | Monorepo, API foundation, DB schema + migrations | P0 | — | TESTED | typecheck/build/test green | `apps/api`, `packages/domain` |
| TB-02 | Organizer submission → review → human publish | P0 | TB-01 | TESTED | review-flow.spec passes | `apps/api/src/modules/{organizer,review}` |
| TB-03 | Public web slice: avatar home, lenses, nearby, details, ics, az/ru/en | P0 | TB-01 | TESTED | pages render all states; screenshots 01–07 | `apps/web/src/app/(public)` |
| TB-04 | Docker env (core/full/tools/storage), Makefile, backup/restore, CI | P0 | TB-01 | TESTED | images build + full stack healthy + smoke tests in CI ✅ | `compose.yaml`, `infra/`, `.github/workflows/ci.yml` |
| TB-05 | Machine-readable OpenAPI from zod schemas + Swagger UI at `/v1/docs` (non-prod) + contract test | P1 | TB-01 | TESTED | `/v1/openapi.json` + `/v1/docs` served in dev, 404 in production; CI fails on drift; route/access/response contract tests | `apps/api`, `docs/API_SPECIFICATION.md` |
| TB-06 | Spike S-AUTH: compare self-hosted (e.g. Better Auth/Lucia-style sessions) vs managed; email magic link vs phone OTP; cost | P0 | — | NOT_STARTED | ADR-0010 decided; prototype sign-in for staff | `docs/adr/ADR-0010-*`, `apps/api/src/common/auth.ts` |
| TB-07 | Spike S-MAP: MapLibre + OSM tiles, cost/usage policy check | P1 | — | NOT_STARTED | ADR-0013 decided; map view prototype | `docs/adr/ADR-0013-*` |
| TB-08 | Staff UI: cancel/postpone occurrence (API exists) | P1 | TB-02 | NOT_STARTED | button in staff events with reason; audited | `apps/web/src/app/staff/events` |
| TB-09 | "Report incorrect information" from event page → review task | P1 | TB-02 | NOT_STARTED | public POST, rate-limited, creates `report` review task | `apps/api/src/modules/review` |
| TB-10 | Mobile app shell (Expo) reusing API + i18n | P1 | TB-05, TB-06 | NOT_STARTED | Android build shows home + details | `apps/mobile` |
| TB-11 | Rate limiting + security headers on public API | P1 | TB-01 | NOT_STARTED | 429 on abuse; helmet-style headers | `apps/api/src/main.ts` |
| TB-12 | Playwright E2E with assertions (not only screenshots) in CI | P1 | TB-04 | NOT_STARTED | journeys F-01..F-04, F-06/F-07 assert outcomes | `tests/e2e` |
| TB-13 | Founder dev portal page (`/dev`): links, status, screenshots, architecture | P2 | TB-05 | NOT_STARTED | one page links every running interface | `apps/web` |
| TB-14 | Figma-compatible design package: tokens JSON, SVG frames, component specs | P1 | — | NOT_STARTED | `design/design-tokens/*.json` consumed by web CSS | `design/` |
| TB-15 | Avatar renderer evaluation (Rive vs Lottie vs SVG) | P2 | TB-14 | NOT_STARTED | ADR + prototype in web and mobile | `docs/AVATAR_ART_SPEC.md` |
| TB-16 | Staff UI polish to the public design language | P2 | TB-14 | NOT_STARTED | staff pages use shared tokens | `apps/web/src/app/staff` |
