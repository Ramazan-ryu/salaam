# Next Actions

The next session should start here, in this order. Each item is executable without asking the founder.

1. **Verify the checkpoint**: `pnpm install && pnpm --filter @salaam/domain build && pnpm typecheck && pnpm test` (needs a migrated `*_test` DB; see docs/LOCAL_DEVELOPMENT.md). Expect 31 passing tests.
2. **If Docker Hub is reachable**: `docker compose --profile full up --build -d --wait`, then `make health`; record the result in TEST_RESULTS.md and close BL-03.
3. **TB-05 OpenAPI**: generate the spec from the zod schemas (evaluate `@asteasolutions/zod-to-openapi` vs `nestjs-zod`), serve `/v1/openapi.json` + Swagger UI outside production, add a drift check to CI.
4. **TB-06 S-AUTH spike**: write the comparison into ADR-0010 (cost, Azerbaijani phone OTP availability, email deliverability, self-hosted vs managed). Implement the staff sign-in behind the existing `AuthGuard`/`Actor` interface. Anything that needs a paid account or legal terms → FOUNDER_ACTIONS.md, keep DEV_AUTH meanwhile.
5. **TB-08 + TB-09**: staff cancel/postpone button; public "report incorrect info".
6. **TB-11**: rate limits + security headers on the public API.
7. Update PROJECT_STATE.md, TASK_BOARD.md, TEST_RESULTS.md, FEATURE_TRACEABILITY_MATRIX.md before ending.
