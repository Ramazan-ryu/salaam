# Development Guidelines

Status: Draft 0.1 · 2026-11-14 · Related: [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md#5-repository--module-structure-planned), [TESTING_STRATEGY.md](./TESTING_STRATEGY.md), [adr/README.md](./adr/README.md)

> Applies once implementation is approved. Nothing in this document authorizes implementation.

## 1. Working with Claude Code (solo + AI-assisted)

1. **One task, one small PR.** Each change implements a single feature slice or fix, ideally <400 changed lines, with tests.
2. **Plan before code.** For any non-trivial task, Claude first states the plan, affected modules and docs; the founder approves.
3. **Docs are the source of truth.** If code must deviate from a document or ADR, update the document/ADR in the same PR or stop and ask.
4. **CLAUDE.md** at repo root (created in P-2) summarises conventions, module boundaries, commands, and "never do" rules (no secrets, no scraping, no cross-module SQL, no unreviewed dependencies).
5. **No new dependency** without stating why, licence, maintenance status, and alternatives in the PR description.
6. **Review checklist** for the founder: tests meaningful? authorization checked? personal data minimised? i18n keys used? docs updated?
7. **Never paste secrets** into prompts, code, issues or commits. Rotate any secret that leaks.

## 2. Repository & folder structure

See planned layout in [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md#5-repository--module-structure-planned). Each backend module folder contains: `module` wiring, `service` (public interface), `repository/queries` (private), `dto` (API contracts), `events`, `tests`.

## 3. Coding standards

- TypeScript `strict` everywhere; no `any` without justification comment.
- Lint + format enforced in CI; import-boundary rules per module.
- Validate all external input at the edge (DTO schemas); never trust client-sent roles or ids.
- Explicit SQL for geo/search queries is acceptable and preferred over clever ORM abstractions.
- No generic "base repository" or premature interfaces; introduce abstractions when the second use appears (except the documented ones: connectors, push provider, model gateway, storage).
- Errors: domain errors mapped to RFC 9457 responses with stable codes.
- Time: always timezone-aware; never use server local time.
- Feature flags for incomplete or experimental features.

## 4. Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Tables / columns | snake_case, plural tables | `occurrences.starts_at` |
| API JSON | camelCase | `startsAt` |
| Modules | kebab-case folders | `social`, `model-gateway` |
| i18n keys | `area.screen.element` | `discover.filters.price` |
| Catalog ids | `slot.variant` | `hair.curly_short` |
| Data sources | `DS-nnn` | `DS-010` |
| Branches | `feat/…`, `fix/…`, `docs/…`, `chore/…` | `feat/review-queue` |

## 5. Git workflow

- Trunk-based: `main` always deployable; short-lived branches; squash merge.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- Protected `main`: CI must pass; PR template with checklist.
- Tags for releases (`v0.x.y`); changelog generated from commits.

## 6. Testing requirements

- New logic → unit tests; new endpoint → integration + authorization tests; new UI flow → at least one E2E path when it's critical.
- Bug fix → regression test first.
- Prompt/model change → gold-set eval ([TESTING_STRATEGY.md](./TESTING_STRATEGY.md#5-ai-evaluation)).

## 7. Documentation requirements

- Architectural change → new or superseding ADR.
- Product decision → [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) entry.
- New data source → [DATA_SOURCES_REGISTER.md](./DATA_SOURCES_REGISTER.md) record **before** the connector runs.
- API change → OpenAPI updated in the same PR.
- Keep the document index status current ([README.md](./README.md)).

## 8. Local development (target experience)

- Prerequisites: Node LTS, pnpm, Docker. `docker compose up` starts **only** Postgres (PostGIS) and MinIO; apps run natively.
- One command to seed synthetic data; one command to reset.
- Optional services (e.g. local LLM mocks) behind profiles, off by default — laptop-friendly.
- Troubleshooting guide maintained in `docs/` once implementation starts.

## 9. Secrets & configuration

- `.env.example` documents every variable without real values; real `.env` files are git-ignored.
- Production secrets in the host's secret store or encrypted environment; never committed.
- Secret scanning in CI and pre-commit.
