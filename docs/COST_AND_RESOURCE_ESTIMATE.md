# Cost and Resource Estimate

Status: Draft 0.1 · 2026-11-14 · Related: [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md), [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md), [CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md#8-solo-founder-workload-model)

## 0. Rules for this document

- **Confirmed price** = taken from the provider's official page or documentation on the date shown.
- **Reported price** = taken from a secondary source (review/aggregator/news); must be re-checked before purchase.
- **Estimate** = our calculation or assumption; inputs are shown.
- **Quote needed** = no reliable public price; no number is given.
- Prices exclude VAT/taxes; currencies as published. [CONFIRMED rule] No paid service is mandatory for the initial architecture unless technically necessary.

## 1. Price reference table (checked 2026-11-14)

| Item | Price | Type | Source |
|---|---|---|---|
| Claude Pro (includes Claude Code) | $20/month or $17/month billed annually | Reported | https://www.superblocks.com/blog/claude-code-pricing ; https://chudi.dev/blog/claude-pro-vs-max (cites claude.com/pricing) |
| Claude Max | $100/month (5x) or $200/month (20x), monthly only | Reported | Same as above |
| Claude Haiku 5.5 API | $0.10 input / $0.50 output per million tokens (prompts ≤100k tokens); batch $0.05 / $0.25 | Reported | https://www.developersdigest.tech/models/claude-haiku-5-5 ; https://www.implicator.ai/claude-haiku-5-5-matches-gpt-6-luna-pricing/ |
| Claude Sonnet 5.5 API | $2 input / $10 output per million tokens; batch $1 / $5 | Reported | https://apidog.com/blog/claude-sonnet-5-5-pricing/ |
| Gemini 2.5 Flash-Lite API (fallback option) | $0.10 input / $0.40 output per million tokens | Reported | https://www.developersdigest.tech/models/gemini-2-5-flash-lite |
| Apple Developer Program | $99/year | Reported (verified by source against Apple docs) | https://www.choicely.com/tutorials/how-much-does-it-cost-to-publish-an-app |
| Google Play developer registration | $25 one-time | Reported (same) | Same |
| Expo EAS | Free plan (limited low-priority builds); Starter $19/month incl. $45 build credit; local builds free | Confirmed (Expo docs) | https://docs.expo.dev/billing/faq/ |
| Expo Push Service | Free (relay) | Reported | https://www.courier.com/integrations/compare/expo-vs-pusher-beams |
| Rive | Editor free; production exports require paid plan; Cadet $9/month (annual) | Exports policy confirmed (Rive blog); price reported | https://rive.app/blog/rive-s-new-9-mo-plan ; https://toolradar.com/tools/rive/pricing |
| Cloudflare R2 | Free: 10 GB-month, 1M Class A, 10M Class B ops/month; then $0.015/GB-month; egress free | Confirmed (official docs) + reported rates | https://developers.cloudflare.com/r2/pricing ; https://upstash.com/kb/cloudflare-r2-pricing-in-2026-storage-operations-and-real-monthly-bills |
| Supabase (if managed Postgres/Auth chosen) | Free: 500 MB DB, 50k MAU, pauses after 1 week idle; Pro $25/month base | Reported | https://makerkit.dev/blog/saas/supabase-pricing |
| Hetzner Cloud CX23 (2 vCPU, 4 GB) | €5.49/month (after 15 Jun 2026 increase); cost-optimized plans reported unavailable for new orders in autumn 2026 | Reported | https://www.bitdoze.com/hetzner-cloud-review/ ; https://www.bitdoze.com/hetzner-cloud-cost-optimized-plans/ |
| Azerbaijani cloud (AZINCLOUD / AzInTelecom) | — | **Quote needed** | https://tech.az/en/posts/move-your-business-to-the-cloud-environment-with-azincloud-7055 |
| MapTiler Cloud | Free plan non-commercial/R&D only; paid plans reported from $25–$30/month | Terms confirmed; price reported | https://www.maptiler.com/terms/cloud/ ; https://softwarefinder.com/facility-management-software/maptiler-cloud |
| SMS to Azerbaijan (Plivo) | Azercell $0.2483, Bakcell $0.3390, Nar $0.4717 per SMS | Confirmed (provider page) | https://www.plivo.com/sms/pricing/az/ |
| `.az` domain (international registrars) | From ~$243/year | Reported | https://domainoffer.net/tld/az |
| Generic `.com` domain | ~$8–$12/year at common registrars | Reported | https://domainoffer.net/tld/az/connectreseller (lists .com rates) |
| Freelance illustrator / Rive animator | — | **Quote needed** | — |
| Azerbaijani legal counsel | — | **Quote needed** | — |
| Email delivery provider | Free tiers common | Estimate — choose in P-2 | — |
| Error tracking | Free tiers common or self-host | Estimate — choose in P-2 | — |

## 2. Usage-based estimates

### 2.1 LLM API
Inputs (estimate): extraction ≈ 2,000 input + 400 output tokens per source item; translation ≈ 600 in + 600 out per published item per target language (2 targets).

| Volume / month | Extraction (Haiku 5.5) | Translation (Haiku 5.5, 2 langs) | Total |
|---|---|---|---|
| 2,000 items, 600 published | 2,000 × (2,000×$0.10 + 400×$0.50)/1M ≈ $0.80 | 600 × 2 × (600×$0.10 + 600×$0.50)/1M ≈ $0.43 | **≈ $1.25** |
| 10,000 items, 3,000 published | ≈ $4.00 | ≈ $2.16 | **≈ $6.20** |
| 10,000 items with Sonnet 5.5 for hard cases (10%) | +≈ $0.60 | — | **≈ $7** |

Batch processing and prompt caching can reduce these further. Budget cap recommendation: **$20/month** hard cap in the model gateway for MVP-1. LLM is not the cost driver; **human time is**.

### 2.2 SMS one-time codes
If phone OTP were used: 1,000 sign-ups × ~1.3 SMS (retries) × ~$0.34 average ≈ **$440** — plus fraud risk. Hence deferred (D-05).

### 2.3 Maps
Self-hosted PMTiles extract of Azerbaijan on object storage: storage likely within R2 free tier [ESTIMATE — file size to be measured in spike]; tile requests count as Class B operations (10M/month free). Fallback MapTiler paid plan ≈ $25–$30/month (reported).

## 3. One-time vs recurring summary

| Item | One-time | Recurring |
|---|---|---|
| Google Play registration | $25 | — |
| Apple Developer Program | — | $99/year |
| Domain (generic) | — | ~$10/year (estimate) |
| Domain (`.az`, optional) | — | ~$243+/year (reported) |
| Avatar art v1 (freelance) | Quote needed | Item packs: quote needed |
| Legal consultation (privacy policy, terms, QL list) | Quote needed | Occasional |
| Development tooling (Claude) | — | $17–$200/month |
| Hosting / DB / storage | — | See scenarios |
| Rive | — | ~$9/month (reported) while producing exports |

## 4. Scenarios

### A. Minimal experimentation (P-0 to P-3; local + prototype)

| Line | Monthly | One-time | Notes |
|---|---|---|---|
| Claude Pro | $20 (or $17 annual) | — | Primary dev tool |
| Hosting | $0 | — | Local Docker; no public deployment needed until MVP-0 demo |
| Database / storage | $0 | — | Local Postgres + MinIO |
| LLM API | ≤$5 | — | Gold-set experiments |
| Maps | $0 | — | OSM/PMTiles locally |
| Push | $0 | — | Not yet |
| Domain | ~$1 (≈$10/yr) | — | Optional |
| Rive | $0–9 | — | Free editor until exports are needed |
| Store accounts | — | $25 (Google, optional) | Apple deferred |
| **Total** | **≈ $20–35/month** | **≈ $0–25** | |

### B. Solo-founder MVP (MVP-0 deployed → MVP-1 private beta, ≤500 users)

| Line | Monthly | One-time | Notes |
|---|---|---|---|
| Claude Pro → Max 5x if needed | $20–100 | — | D-13 |
| Hosting (1 small VM) | ~€5.49–15 (international, reported) or AZ quote | — | D-02 |
| Database | $0 (on VM) | — | Backups to object storage |
| Object storage | $0 (within R2 free tier, estimate) | — | Or in-country equivalent |
| LLM API | $5–20 (cap) | — | §2.1 |
| Maps | $0 (self-hosted) or $25–30 | — | D-14 |
| Push | $0 | — | Expo relay |
| Email | $0 (free tier, estimate) | — | |
| Error tracking / uptime | $0 (free tiers, estimate) | — | |
| Rive | ~$9 | — | |
| Apple Developer | ~$8.25 ($99/yr) | — | |
| Google Play | — | $25 | |
| Domain | ~$1 | — | |
| Legal review | — | Quote needed | Before MVP-1 |
| Avatar art | — | $0 (v0 founder) | v1 deferred |
| **Total (excl. legal)** | **≈ $45–190/month** | **≈ $25 + legal** | |

### C. Early production beta (MVP-2 public beta, ≤5,000 MAU)

| Line | Monthly | One-time | Notes |
|---|---|---|---|
| Claude Max 5x/20x | $100–200 | — | |
| Hosting (2 VMs or VM + managed DB) | €15–60 (estimate) or AZ quote | — | Supabase Pro $25 + compute if managed |
| Object storage | $0–5 | — | |
| LLM API | $20–50 (cap) | — | Incl. optional assistant experiment |
| Maps | $0–30 | — | |
| Push / email / monitoring | $0–30 | — | Free tiers may be exceeded |
| Rive | ~$9 | — | |
| Apple Developer | ~$8.25 | — | |
| Domain (`.az` optional) | ~$1–20 | — | |
| Part-time curator(s) | Hours × local rate (quote) | — | e.g. 10–20 h/week |
| Avatar art v1 | — | Quote needed | Freelance illustrator + animator |
| Legal (ongoing) | Occasional | — | |
| **Total (excl. people & art)** | **≈ $150–450/month** | Art + legal quotes | |

## 5. Human resources

| Activity | Who | Effort estimate | Automatable? |
|---|---|---|---|
| Product & architecture decisions | Founder | Ongoing | No |
| Implementation | Founder + Claude Code | See roadmap (dev-days) | Partly (AI-assisted) |
| Code review & testing | Founder (+ automated tests) | 15–25% of dev time | Partly |
| Content curation | Founder → part-time curators | 6–8 h/week MVP-1 | Progressive ([CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md#9-what-can-be-automated-vs-what-needs-a-human)) |
| Partner outreach | Founder | 1–3 h/week | No |
| Avatar art v0 | Founder | 40–80 h | No (tools assist) |
| Avatar art v1 | Freelancers | Quote | No |
| Legal | Counsel | Quote | No |
| User research | Founder | 15–25 h in P-0 | No |
| Moderation | Founder | <1 h/week at beta | Partly (spam heuristics) |

## 6. Cost risks

- Hosting prices rose twice in 2026 at at least one major budget provider (reported); keep provider-neutral.
- Free tiers can change; monitor monthly; keep alternatives in [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md).
- Claude subscription usage limits may push to Max; track weekly.
- SMS fraud if phone OTP is ever enabled → strict rate limits and country restriction.
