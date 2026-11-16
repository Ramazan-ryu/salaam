# Decision Log

Product decisions: `docs/PRODUCT_DECISIONS.md` (D-01…D-30). Architecture decisions: `docs/adr/` (ADR-0001…0021).
This file records engineering decisions taken autonomously during implementation (reversible unless stated).

| ID | Date | Decision | Why | Alternatives | Reversible |
|---|---|---|---|---|---|
| ED-01 | 2026-11-17 | Drizzle ORM (ADR-0021) | Typed schema, readable SQL migrations, raw SQL for PostGIS | Prisma, TypeORM, Kysely | Yes |
| ED-02 | 2026-11-17 | DEV_AUTH header identity until S-AUTH | Lets staff flows be built and tested now; refused in production | Build auth first (blocks everything) | Yes, by design |
| ED-03 | 2026-11-17 | Public app and staff portal in one Next.js app (`/` and `/staff`) | One build, one image, shared tokens; staff pages `noindex` | Separate admin app | Yes |
| ED-04 | 2026-11-17 | Public pages server-rendered; Discover is client-side | SEO for home/event pages; location must stay in the browser | All client-side | Yes |
| ED-05 | 2026-11-17 | Coarse location = 5-char geohash computed in the browser (≈5 km cell) | D-28: exact coordinates never leave the device | Send lat/lng and round on server | Yes (precision is a constant) |
| ED-06 | 2026-11-17 | Azerbaijani dates formatted by hand | Chrome lacks az date data ("M11 20, Fri" seen in testing) | Ship an Intl polyfill (+KB) | Yes |
| ED-07 | 2026-11-17 | `sources.is_synthetic` flag; synthetic events hidden in production | Mock data must be identifiable and never public | Separate database for samples | Yes |
| ED-08 | 2026-11-17 | Compose profiles core/full/tools/storage; no empty mock/observability/worker services | Directive: no empty structure; nothing to mock yet | Create placeholders | Yes |
| ED-09 | 2026-11-17 | Separate `prod-deps` Docker stage | Removed compilers/test tools: 206 MB → 47 MB app files | `pnpm deploy` (packlist drops `dist/` via .gitignore) | Yes |
| ED-10 | 2026-11-17 | Next.js `output: 'standalone'` for the web image | Small self-contained server | Full `node_modules` image | Yes |
| ED-11 | 2026-11-17 | Only implemented destinations in the tab bar (Home, Discover) | Directive: never present mockups as working features | Show Saved/Profile as disabled | Yes |
| FD-01 | 2026-11-17 | **Founder direction:** companion stands in the centre, full body; event "objects" around it (music, exhibitions, workshops, cinema, community, near me) with live counts | Founder feedback on Concept A | Concept A (companion at the side) | Yes |
| FD-02 | 2026-11-17 | **Founder direction:** companion is alive with moods — calm, energetic, curious, and "mixed" (cycles); mood also steers the suggestion via ordered category preferences | Founder feedback: "more alive… 2–3 moods mixed" | Single idle animation | Yes |
| ED-17 | 2026-11-17 | Expressions drawn once, switched by CSS mood classes; motion only under `prefers-reduced-motion: no-preference` | Works without JS (snapshot) and respects accessibility | React-conditional mouths | Yes |
| ED-18 | 2026-11-17 | Lists show one card per event (soonest occurrence); counts are events, not dates | Repeated cards for multi-date events looked broken | — | Yes |
| ED-13 | 2026-11-17 | OpenAPI from zod via `@asteasolutions/zod-to-openapi` v7 (MIT) | Single source of truth = validation schemas; no decorators on every route | `nestjs-zod` + `@nestjs/swagger` (heavier, decorator-driven); hand-written YAML (drifts) | Yes |
| ED-14 | 2026-11-17 | Web types generated with `openapi-typescript` (MIT); no generated SDK | Compile-time contract for the web with zero runtime code | openapi-fetch / orval SDK | Yes |
| ED-15 | 2026-11-17 | Swagger UI from `swagger-ui-dist` (Apache-2.0) served by the API, non-production only | No CDN, no extra service | Separate docs site | Yes |
| ED-16 | 2026-11-17 | Public `GET /v1/places/:id` and `/v1/categories` return explicit public shapes | Contract work found raw DB rows (normalized names, geometry, timestamps) exposed | — | No (privacy/hygiene) |
| ED-12 | 2026-11-17 | Discover responses: `Cache-Control: private, no-store` when an area is sent, `Vary` on language/area | API spec privacy rule | — | No (privacy rule) |
