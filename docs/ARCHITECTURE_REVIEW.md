# Architecture Review

Status: Draft 0.2 · 2026-11-16 (Phase 1.1 corrections) · Related: [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md), [adr/README.md](./adr/README.md), [COST_AND_RESOURCE_ESTIMATE.md](./COST_AND_RESOURCE_ESTIMATE.md)

Purpose: challenge every major technology choice for a **solo developer with a small budget** using Claude Code. For each: why needed, alternatives, initial cost, operational complexity, maintenance burden, when to introduce, what can be postponed. Costs reference [COST_AND_RESOURCE_ESTIMATE.md](./COST_AND_RESOURCE_ESTIMATE.md); "$0" means open-source software (hosting cost counted separately).

## 1. Changes versus the Phase 0 proposal

| Phase 0 | Phase 1 revision | Reason |
|---|---|---|
| Separate Next.js admin app | **One Next.js app** with route groups (`/admin`, `/organizer`) | One deployment for a solo founder; Next.js code-splits per route, so admin code isn't shipped to public pages |
| Managed auth vs in-house undecided | 0.1: in-house module. **0.2: reopened — decision blocked by spike S-AUTH** (managed vs library-based vs self-hosted) | Phase 1.1 review: managed auth may be safer and cheaper in founder time if D-02 allows; no custom crypto in any option |
| Map tiles via provider | **Self-hosted PMTiles first** (spike), provider as fallback | MapTiler free plan is non-commercial only; avoids monthly fee |
| pgvector in MVP | **Deferred** | Not needed until dedup precision requires it |
| Expo Push implied | Confirmed with provider abstraction | Free relay; can switch to direct APNs/FCM |

## 2. Technology-by-technology review

### 2.1 Next.js (web)
| Aspect | Assessment |
|---|---|
| Why | SEO and share previews for public event/place pages (tourists, invites); organizer portal and admin in one web codebase |
| Alternatives | Astro (excellent for static/SEO, weaker for app-like admin); Remix/React Router (similar); Expo Router web (max code sharing with mobile, weaker SEO/SSR maturity [ASSUMPTION]); plain SPA (poor SEO) |
| Initial cost | $0 (self-hosted Node container); Vercel optional (not required) |
| Ops complexity | Low–medium (one container) |
| Maintenance | Medium — framework moves fast; pin major versions, upgrade deliberately |
| Introduce | P-3 (admin/organizer first), public pages in P-4 |
| Postpone | Logged-in web app parity with mobile (can lag); ISR/edge features |
| Risk | Framework churn; mitigate with conservative feature use (server components only where clearly useful) |

### 2.2 React Native / Expo (mobile)
| Aspect | Assessment |
|---|---|
| Why | One TypeScript codebase for iOS + Android; Rive and MapLibre RN bindings; EAS optional |
| Alternatives | Flutter (excellent Rive support, but no code sharing with TS backend/web); native Swift/Kotlin (2× work); Capacitor/PWA (weaker native feel, avatar perf risk) |
| Initial cost | $0 framework; EAS free plan has limited low-priority builds; Starter $19/month with $45 build credit; local builds unlimited (Expo docs, checked 2026-11-14). Store fees: Apple $99/yr, Google $25 once |
| Ops complexity | Medium (store submissions, certificates — EAS automates) |
| Maintenance | Medium — yearly SDK upgrades; native module compatibility |
| Introduce | P-4 (spike S-AV1 in P-1) |
| Postpone | OTA updates (EAS Update) until beta; tablet layouts |
| Risk | iOS builds need macOS or cloud builds; dev builds required for native modules |

### 2.3 NestJS (API + worker)
| Aspect | Assessment |
|---|---|
| Why | Opinionated module system maps to bounded contexts; DI and decorators give consistent structure (helps AI-assisted development stay consistent); built-in OpenAPI generation; same code for API and worker |
| Alternatives | Fastify or Hono with hand-rolled structure (lighter, less boilerplate, more conventions to invent); Next.js route handlers only (no long-running worker, couples API to web); Go/Elixir (different language from clients) |
| Initial cost | $0 |
| Ops complexity | Low (two processes from one image) |
| Maintenance | Medium — decorators/boilerplate; keep modules thin |
| Introduce | P-2 |
| Postpone | GraphQL, microservices, CQRS frameworks — not needed |
| Risk | Over-abstraction; mitigate with guidelines (no generic repositories, no premature interfaces) |

### 2.4 PostgreSQL + PostGIS
| Aspect | Assessment |
|---|---|
| Why | Relational integrity for provenance/status; geospatial queries; one database for jobs, search, geo |
| Alternatives | MySQL (weaker geo); MongoDB (weaker relational integrity); SQLite/libSQL (simple, weaker geo/concurrency for this use); Supabase (managed Postgres + extras; free plan pauses after 1 week inactivity; Pro $25/month — checked 2026-11-14) |
| Initial cost | $0 self-hosted on the app VM; managed later |
| Ops complexity | Medium if self-hosted (backups, upgrades) — scripted |
| Maintenance | Low–medium |
| Introduce | P-2 |
| Postpone | Read replicas, partitioning (except audit logs) |
| Risk | Self-hosted backup discipline → automated daily backups + monthly restore test (NFR-011) |

### 2.5 pg_trgm (fuzzy matching/search)
| Aspect | Assessment |
|---|---|
| Why | Typo-tolerant search and duplicate detection across az/ru/en without extra services |
| Alternatives | Meilisearch/Typesense (great relevance, extra service); OpenSearch (heavy) |
| Cost / ops | $0 / none (extension) |
| Introduce | P-3 |
| Postpone | Dedicated search engine until search quality or scale demands |
| Risk | Azerbaijani stemming not available in core Postgres [ASSUMPTION — verify]; mitigated by trigram + `simple` config |

### 2.6 pgvector
| Aspect | Assessment |
|---|---|
| Why | Embedding similarity for cross-language dedup and future recommendations |
| Alternatives | Hosted vector DB (unnecessary); no embeddings (rules only) |
| Cost / ops | Extension $0; embedding API cost small |
| Introduce | **Only if** P-5 dedup precision/recall is insufficient ([ADR-0008](./adr/ADR-0008-pgvector-deferred.md)) |
| Postpone | Yes — whole capability |

### 2.7 Background jobs (pg-boss)
| Aspect | Assessment |
|---|---|
| Why | Scheduled collection, extraction, notifications, purges with retries |
| Alternatives | BullMQ + Redis (fast, mature; extra service); cron + scripts (no retries/visibility); cloud queues (vendor lock-in) |
| Cost / ops | $0; no extra service |
| Introduce | P-3 |
| Postpone | Redis entirely until caching/rate-limit needs exceed Postgres/in-memory |
| Risk | Throughput limits at large scale — irrelevant for MVP volumes; abstraction allows swap |

### 2.8 Authentication (decision open — spike S-AUTH)
| Aspect | Assessment |
|---|---|
| Why | Identity, sessions, sign-in providers, deletion; security-critical |
| Options | **Managed** (e.g. Supabase Auth: 50,000 MAU free; Pro from $25/month with 100,000 MAU — official 2026-11-16; Clerk/Auth0/Firebase prices not verified here) · **Library-based NestJS** (vetted libraries, own database) · **Self-hosted server** (Keycloak, Ory, Zitadel) |
| Security | Managed: strongest defaults, least code. Library: more ways to misconfigure, so needs strong tests. Self-hosted: mature but patching burden |
| Portability / residency | Managed: provider regions (no Azerbaijan region found for the examples [UNVERIFIED]). Library and self-hosted: wherever Salaam runs |
| Cost | Managed: free tier then per-MAU. Library: $0 + email. Self-hosted: $0 + compute + ops time |
| Solo suitability | Managed > Library >> Self-hosted |
| Rule | **No custom cryptography or authentication protocols** in any option |
| Decision | Blocked by S-AUTH (P-1, 2–3 dd); criteria in [SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md#31-implementation-approaches-decision-open--blocked-by-spike-s-auth) and [ADR-0010](./adr/ADR-0010-authentication-approach.md) |
| Postpone | Phone OTP, passkeys, Telegram login |

### 2.9 Object storage (S3-compatible)
| Aspect | Assessment |
|---|---|
| Why | Images, static avatar renders, PMTiles, backups |
| Alternatives | Local disk (not durable); provider-specific storage APIs |
| Cost | Cloudflare R2 free tier: 10 GB-month, 1M Class A and 10M Class B operations/month, zero egress (official pricing page, checked 2026-11-14); MinIO locally |
| Ops | Low |
| Introduce | P-2 (MinIO local), provider at MVP-0 deploy |
| Risk | If personal data must stay in AZ, user-uploaded images need in-country storage (QL-04) — S3 API keeps this swappable |

### 2.10 Rive (avatar)
| Aspect | Assessment |
|---|---|
| Why | State-machine-driven interactive character on web, iOS, Android, RN from one file |
| Alternatives | Lottie (linear playback; keep for micro-animations); Spine; custom SVG + Reanimated; 3D (Later) |
| Cost | Runtimes MIT; editor free; production exports require a paid plan (Cadet reported at $9/month annual) — checked 2026-11-14 |
| Ops | Low |
| Maintenance | Medium — art pipeline discipline (naming, versioning) |
| Introduce | Spike P-1; production P-4 |
| Postpone | Unlockables, inventory items, scene mode |
| Risk | Customisation at scale and RN integration unproven for this design → spike S-AV1 gates the decision ([ADR-0012](./adr/ADR-0012-avatar-rive-and-avatar-as-data.md)) |

### 2.11 MapLibre (+ OSM data)
| Aspect | Assessment |
|---|---|
| Why | Open-source vector maps on web and RN; no per-load fees from the renderer |
| Alternatives | Google Maps SDK (costly at scale, terms), Mapbox (usage pricing), Leaflet raster (simpler, less modern) |
| Cost | Renderer $0; tiles: self-hosted PMTiles on object storage (~$0 within free tier) **or** MapTiler (free plan non-commercial only; paid plans reported from $25–$30/month — secondary, checked 2026-11-14) |
| Ops | Low–medium for self-hosted tiles (periodic regeneration of Azerbaijan extract) |
| Introduce | P-4 |
| Risk | RN MapLibre binding maturity [ASSUMPTION — verify in P-4 spike]; ODbL attribution required |

### 2.12 AI Model Gateway
| Aspect | Assessment |
|---|---|
| Why | Single place for provider routing, structured output validation, budgets, logging, prompt versions, fallback |
| Alternatives | Direct SDK calls (fast to start, scattered cost control); third-party LLM router/gateway services (another vendor, data processor) ; agent frameworks (unnecessary complexity) |
| Cost | Code only; LLM usage per [COST_AND_RESOURCE_ESTIMATE.md](./COST_AND_RESOURCE_ESTIMATE.md#21-llm-api) |
| Ops | Low |
| Introduce | P-5 (translation may start earlier) |
| Postpone | Multi-provider routing beyond one fallback; embeddings |
| Risk | Provider price/model changes → model ids configurable; gold-set eval before switching |

## 3. Architectural risks

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| AR-1 | Too many moving parts for one person | Medium | High | Two runtime containers + DB; managed storage; scripted ops |
| AR-2 | Avatar runtime performance/customisation fails on low-end Android | Medium | High | Spike S-AV1; static fallback mandatory |
| AR-3 | Module boundaries erode (big ball of mud) | Medium | Medium | Lint import rules; module ownership table; ADR for exceptions |
| AR-4 | In-house auth vulnerability | Low–medium | High | Library-based, no passwords, tests, external review |
| AR-5 | Hosting decision forces migration | Medium | Medium | Portability (ADR-0017); synthetic data until decided |
| AR-6 | Framework upgrade burden (Expo, Next.js) | High | Medium | Upgrade windows twice a year; avoid bleeding-edge features |
| AR-7 | Vendor price changes (LLM, maps, hosting) | Medium | Medium | Abstractions; budgets; alternatives documented |
| AR-8 | AI-assisted code quality drift | Medium | Medium | Small PRs, tests required, CLAUDE.md conventions ([DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)) |

## 4. Missing or deferred architectural decisions

| Decision | Status | When |
|---|---|---|
| Hosting provider/region | Deferred (D-02) | Before MVP-1 |
| Email delivery provider | Open | P-2 |
| Error tracking (hosted free tier vs self-hosted) | Open | P-2 |
| Auth approach (managed / library / self-hosted) and exact provider or library | Open — blocked by spike S-AUTH | P-1 (G1) |
| CI provider (GitHub Actions assumed, repo is on GitHub) | Open — ADR in P-2 | P-2 |
| Reverse proxy/TLS and backup tooling | Open — ADR in P-2 | P-2 |
| ORM / query builder | Open — prefer a type-safe query builder or lightweight ORM with explicit SQL for geo; decide in P-2 ADR | P-2 |
| Static avatar rendering location | Open (Q-AV2) | P-1 spike |
| Analytics approach (self-hosted product analytics vs DB-derived) | Open | P-6 |
