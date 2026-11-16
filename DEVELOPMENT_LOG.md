# Development Log

Newest first. Short, factual entries; details live in commits.

## 2026-11-17 — Repository published
- Founder installed the Claude GitHub App; `main` pushed to github.com/Ramazan-ryu/salaam (4 commits). First CI run failed (Turborepo strict env hid TEST_DATABASE_URL) → fixed; CI green incl. full Docker stack smoke test → BL-03 closed.

## 2026-11-17 — M-VS1 first vertical slice
- Public web: avatar-first home (Concept A), Now/Tonight/Weekend lenses, Discover with category filter and "near me" (coarse geohash, radius), event details (trust, source, unconfirmed fields, map link, .ics), az/ru/en switch.
- Staff portal moved to `/staff`.
- API: `sources.is_synthetic` + migration 0001; synthetic data hidden in production; cache headers for location queries.
- Docker: `compose.yaml` (profiles), API and web Dockerfiles, Makefile, backup/restore scripts, CI workflow.
- Problems solved: Postgres had stopped (stale pid) → restarted; Chrome lacks az date data → hand formatter; card/chip links inherited link colour → CSS; API image carried dev tools → separate prod-deps stage; restore errors on extension objects → filtered TOC, `--exit-on-error`.
- Not possible here: pulling Docker images (registry blocked) → BL-03.

## 2026-11-17 — S1 API + staff web
- NestJS API with catalog, sources, organizer submissions, review queue, human-only publication, discovery; Next.js staff web; 29 tests against PostGIS.
- Fixed: drizzle-kit quoting `geography` type; jest env loading; enum names in tests.

## 2026-11-14…16 — Documentation phases
- Phase 0 analysis, Phase 1 docs + ADRs, Phase 1.1 corrections + P-0 kit, home concept mockups.
