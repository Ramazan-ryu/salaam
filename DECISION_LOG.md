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
| ED-12 | 2026-11-17 | Discover responses: `Cache-Control: private, no-store` when an area is sent, `Vary` on language/area | API spec privacy rule | — | No (privacy rule) |
