# Testing Strategy

Status: Draft 0.1 · 2026-11-14 · Related: [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md), [MVP_SCOPE.md](./MVP_SCOPE.md), [AI_CITY_INTELLIGENCE.md](./AI_CITY_INTELLIGENCE.md#13-quality-evaluation)

## 1. Principles

- Tests are part of "done" for every change (AI-assisted code included).
- Prefer fast, deterministic tests; test behaviour at module boundaries.
- Privacy and authorization rules get exhaustive matrix tests — they are product promises.

## 2. Test levels

| Level | Scope | Tooling (indicative, decided in P-2) | Runs |
|---|---|---|---|
| Unit | Pure logic: policy engine, scoring, visibility resolver, date resolution, budgets | TS test runner | Every commit |
| Integration | Module + real Postgres/PostGIS (containers): queries, migrations, geo, search, jobs | Test containers / Compose | Every PR |
| Contract | API responses vs OpenAPI schema; generated client compiles | Schema validation | Every PR |
| E2E web | Critical flows: sign-in, admin review, organizer submission, public page | Browser automation | Nightly + before release |
| E2E mobile | Onboarding, avatar creation, discover, save, invite | Mobile E2E framework | Before release |
| Visual/perf (avatar) | FPS, memory, swap latency on reference devices | Profilers + scripted runs | Spike + each avatar asset release |
| Load | Discover, home, detail at 10× beta load | Load tool | Before MVP-1 and MVP-2 |
| Security | Dependency audit, secret scan, OWASP checks, authZ matrix | CI scanners + manual checklist | CI + pre-release |
| Accessibility | WCAG checks on web; screen reader passes on mobile | Automated + manual | Pre-release |
| Localization | Pseudo-locale, RU expansion, az special characters, plural rules | Snapshot + manual | Pre-release |

## 3. Critical test matrices

**Visibility resolver:** viewer ∈ {self, friend, non-friend, blocked, blocking, anonymous} × setting ∈ {only_me, friends, public} × object ∈ {profile field, attendance, friends list}.

**Publication invariant:** items with `pending_review` or `rejected` never appear in any public endpoint (property-based tests over random states).

**Notifications:** budgets, quiet hours across midnight, dedup windows, timezone (Asia/Baku, no DST [ASSUMPTION — verify current rules]), consent-gated types.

**Location:** discovery endpoints reject precise coordinates; logs contain no `near` values.

## 4. Device matrix (reference)

| Class | Example target | Purpose |
|---|---|---|
| Low-end Android | 3–4 GB RAM, Android 10+ | Fallback behaviour |
| Mid-range Android (reference) | Popular mid-range model in Azerbaijan [verify] | NFR-001 |
| Older iPhone | Oldest iOS version supported by the Expo SDK in use | iOS baseline |
| Recent iPhone | Current | — |
| Desktop browsers | Chrome, Safari, Firefox (latest 2) | Web |

## 5. AI evaluation

- **Gold set** (≥150 items at P-0, ≥300 by P-5; az/ru/en/mixed): hand-labelled fields + evidence.
- **Metrics:** per-field precision/recall; critical-field precision; evidence-span validity; schema-valid rate; cost/item; latency.
- **CI gate:** prompt/model changes run the gold set; fail if critical-field precision drops >1 point or schema-valid rate <99%.
- **Prompt-injection suite:** adversarial items ("ignore previous instructions", fake "verified" claims, malicious links) must produce no unauthorized fields or actions.
- **Production monitoring:** audit-sample precision per source; drift alerts.

## 6. Test data

- Synthetic users and seed content only in non-production environments (DS-003).
- Gold set stored without personal data; images excluded or rights-cleared.
- Never copy production personal data to development.

## 7. Release checklist (excerpt)

All CI green · E2E pass · migrations reversible or backed up · OpenAPI diff reviewed · store metadata localized · privacy policy version bumped if data use changed · feature flags set · rollback plan noted.
