# Next Actions

> Founder creative directive (2026-11-17): `docs/design/CREATIVE_DIRECTIVE.md`. Design work runs as D1→D8
> (TASK_BOARD TB-17…TB-24), interleaved with engineering (TB-06 auth, TB-07/TB-22 map).
> Current home = "Companion World" (FD-01/02 in DECISION_LOG) — keep its structure; D1/D2 restyle it.

**Universe v1 shipped (3D world `/`, `/studio`, editorial Discover — docs/design/ART_DIRECTION.md).**
**Waiting on FA-06 art:** when files arrive → WebP, ASSET_MANIFEST, wire into window view / covers / character (see AI_ART_PROMPTS.md).
**Next up:** (a) Studio v2: clothes/accessory slots + room items (needs more CC0 assets or FA-05 art);
(b) TB-22 real map (MapLibre) as the separate city tool; (c) review the captured event details against this creative direction and replace category art when licensed/original assets are available;
(d) WebGL-less fallback polish + low-end Android check; (e) then TB-06 auth.

The next session should start here, in this order. Each item is executable without asking the founder.

1. **Verify the checkpoint**: `pnpm install && pnpm --filter @salaam/domain build && pnpm typecheck && pnpm test` (needs a migrated `*_test` DB; see docs/LOCAL_DEVELOPMENT.md). Expect 38 passing API tests. Automated tests were not run; native web/API preview rendered and captures 28 were saved. Full Docker image build still fails npm registry TLS verification inside the container.
2. **Check CI is green** on `main` (`gh run list -R Ramazan-ryu/salaam`); fix before new work if not.
3. When changing any endpoint: `pnpm --filter @salaam/api openapi:generate && pnpm --filter @salaam/web api:types`, commit both files (CI checks).
4. **TB-06 S-AUTH spike** (research done 2026-11-17, implementation paused). Findings: Better Auth 1.7.x (MIT, self-hosted, Drizzle adapter, sessions in our Postgres) is the pick — Lucia deprecated (Mar 2025), Auth.js now maintained by Better Auth; managed options (Supabase 50k MAU free, Firebase 50k MAU free) add a vendor. SMS OTP in Azerbaijan costs ~$0.25–0.47/SMS (Plivo per-carrier, Twilio ~$0.39) → founder decision, not MVP. Email for production: Resend free 3,000/mo, 100/day (account + domain = founder action). **Blocker found:** better-auth is ESM-only; `require()` works in Node 22, but Jest 29 (CommonJS) fails with "Cannot use import statement outside a module" → either transform it in Jest (`transformIgnorePatterns` + babel for .mjs) or move API tests to Vitest. Then: write the comparison into ADR-0010 (cost, Azerbaijani phone OTP availability, email deliverability, self-hosted vs managed). Implement the staff sign-in behind the existing `AuthGuard`/`Actor` interface. Anything that needs a paid account or legal terms → FOUNDER_ACTIONS.md, keep DEV_AUTH meanwhile.
5. **TB-08 + TB-09**: staff cancel/postpone button; public "report incorrect info".
6. **TB-11**: rate limits + security headers on the public API.
7. Update PROJECT_STATE.md, TASK_BOARD.md, TEST_RESULTS.md, FEATURE_TRACEABILITY_MATRIX.md before ending.
