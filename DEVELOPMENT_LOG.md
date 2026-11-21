# Development Log

Newest first. Short, factual entries; details live in commits.

## 2026-11-17 — Visual pass v2/v3 (founder: "you can do better", references)
- Companion v2: semi-stylised adult rig redrawn; "clay" volume (gradients, highlights, warm rim light), hoodie/jeans/sneakers/watch.
- Baku waterfront scene by Baku time of day (morning/day/evening/night): sky, haze, far/mid skylines with glowing windows, Caspian, blossom tree, strolling people.
- Glowing objects, quick-action tiles, event cards with date badges; brand: logo + wordmark; fonts Inter + Unbounded (OFL, self-hosted, az/ru/en + ₼).
- Founder reference images were used for principles only (no assets copied); all art is original SVG/CSS.

## 2026-11-17 — Companion World (founder feedback)
- Home redesigned: full-body companion in the centre, 6 objects around it with live counts (link to Discover filtered), moods calm/energetic/curious/mixed.
- Sample seed made idempotent and richer (8 labelled events across all categories, weekend-aware dates); removed an unlabelled test event and duplicate samples from the dev DB.
- Bug fixed: importing a constant from a 'use client' module into a server page (Next.js client reference → 500).
- Preview republished (95 views incl. moods); video `salaam-demo-moods.mp4`.

## 2026-11-17 — Preview for the founder
- 30 s mobile walkthrough video of the real app; static snapshot preview published (https://claude.ai/artifact/GMnhhEdrQAW9ADZXbxbLYH), scripts in `infra/scripts/preview/`.
- TB-06 research done; implementation paused (Better Auth ESM vs Jest), see NEXT_ACTIONS.

## 2026-11-17 — TB-05 API contract
- OpenAPI 3.1 generated from the zod schemas → `docs/openapi.json`; `/v1/openapi.json` + Swagger UI `/v1/docs` outside production.
- Web types generated from the spec (`apps/web/src/lib/api-types.ts`), replacing hand-written types.
- Contract tests: route + access coverage via Nest metadata, strict public response schemas, drift; CI regenerates and diffs.
- Found and fixed: public place endpoint returned raw DB rows (internal columns); documented role of POST /v1/admin/sources was wrong (caught by the access test design).

## 2026-11-17 — Repository published
- Founder installed the Claude GitHub App; `main` pushed to github.com/Ramazan-ryu/salaam (4 commits). First CI run failed (Turborepo strict env hid TEST_DATABASE_URL) → fixed; CI green incl. full Docker stack smoke test → BL-03 closed.

## 2026-11-17 — M-VS1 first vertical slice
- Public web: avatar-first home (Concept A), Now/Tonight/Weekend lenses, Discover with category filter and "near me" (coarse geohash, radius), event details (trust, source, unconfirmed fields, map link, .ics), az/ru/en switch.
- Staff portal moved to `/staff`.
- API: `sources.is_synthetic` + migration 0001; synthetic data hidden in production; cache headers for location queries.
- Docker: `compose.yaml` (profiles), API and web Dockerfiles, Makefile, backup/restore scripts, CI workflow.
- Problems solved: Postgres had stopped (stale pid) → restarted; Chrome lacks az date data → hand formatter; card/chip links inherited link colour → CSS; API image carried dev tools → separate prod-deps stage; restore errors on extension objects → filtered TOC, `--exit-on-error`.
- Not possible here: pulling Docker images (registry blocked) → BL-03.

## 2026-11-17 (evening) — Clay finish + AI art pipeline
- World: ambient occlusion, bloom, vignette, SMAA; warm string lights on evening/night.
- `docs/design/AI_ART_PROMPTS.md`: prompt pack for founder-generated art + image→3D path (Tripo3D/Meshy → Mixamo).

## 2026-11-17 — Universe v1 (visual transformation)
- `/` is now a 3D isometric room (R3F) with a walking, recolourable character; objects open real event categories; light follows Baku time.
- `/studio` avatar customisation (4 bodies, skin/hair/top/trousers, save/undo/reset, device-only).
- Discover → dark editorial "Experiences" with featured hero and original category covers; nav = My world / Discover / Studio.
- Fixed: curtain rod line, mobile camera, label clutter, studio framing, sheet overlap. Old home kept at `/classic`.
- Docs: ART_DIRECTION, WORLD_RENDERING_SPEC, VISUAL_TEST_RESULTS; ASSET_MANIFEST; screenshots before/after.

## 2026-11-17 — S1 API + staff web
- NestJS API with catalog, sources, organizer submissions, review queue, human-only publication, discovery; Next.js staff web; 29 tests against PostGIS.
- Fixed: drizzle-kit quoting `geography` type; jest env loading; enum names in tests.

## 2026-11-14…16 — Documentation phases
- Phase 0 analysis, Phase 1 docs + ADRs, Phase 1.1 corrections + P-0 kit, home concept mockups.

## 2026-11-21 — Event details editorial restyle
- Reworked /e/[id] to use the existing category cover artwork as an image-first hero, with event facts, actions, trust status and source arranged for mobile and desktop.
- Kept existing localized labels, lifecycle states, calendar export, map link, noindex handling for synthetic events, and unknown-time/price behavior.
- Mobile and desktop runtime previews were captured at `design/screenshots/after/28-event-details-*`. Automated tests were not run; the full Docker image build still fails npm registry TLS verification inside the container.
