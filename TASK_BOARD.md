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
| TB-17 | **D1 Brand & tokens:** 3 creative directions compared, chosen identity, wordmark + symbol + app icon (SVG + PNG), color system light/dark with contrast checks, typography (az/ru/en incl. ə, ğ, Cyrillic), `design/tokens/DESIGN_TOKENS.json` consumed by web CSS | P0 | — | NOT_STARTED | tokens drive `public.css`; contrast AA verified by script; brand page in Design Studio | `docs/design/`, `design/`, `apps/web` |
| TB-18 | **D2 Character system:** 3 proportions (stylized / semi-cartoon / compact), expression sheet (neutral, happy, excited, curious, thinking, surprised, relaxed, celebrating), renderer-independent avatar config schema, customization (skin, hair, clothes, accessories) | P0 | TB-17 | IN_PROGRESS | config JSON renders the SVG rig; 8 expressions; avatar studio screen | `packages/avatar-schema`, `apps/web` |
| TB-19 | **D3 Avatar world:** room/city environment with objects as shortcuts (bicycle, camera, books, calendar, ticket, backpack), each with a conventional alternative | P1 | TB-18 | IMPLEMENTED | objects open real destinations or are hidden; keyboard/screen-reader path | `apps/web` |
| TB-20 | **D4 Design Studio** (`/studio` in the web app, non-production): brand, tokens, components, avatar gallery + animation previews, screen previews, architecture explorer (feature → screen → API → module → DB → tests) | P1 | TB-17 | IN_PROGRESS | one URL shows all; linked from README | `apps/web/src/app/studio` |
| TB-21 | **D5 Event imagery system:** 16:9 cards with real photos (permitted sources only) + illustrated fallbacks per category; asset manifest | P1 | TB-17 | IMPLEMENTED | no stock-photo mess; licensing per asset | `design/assets`, `ASSET_MANIFEST.json` |
| TB-22 | **D6 Map experience** (with TB-07 S-MAP): MapLibre, category/cluster/avatar markers, bottom sheet, map↔list | P1 | TB-07 | NOT_STARTED | map screen with real data; accessible list alternative | `apps/web` |
| TB-23 | **D7 Dark theme + motion tokens + reduced-motion audit** | P2 | TB-17 | NOT_STARTED | theme switch; motion tokens documented | `apps/web` |
| TB-24 | **D8 Cinema, social, AI-companion screens** (design + states; data only where verified) | P2 | TB-17, TB-06 | NOT_STARTED | screens with empty/partial states, no invented schedules | `apps/web` |
