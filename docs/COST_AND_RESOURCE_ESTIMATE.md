# Cost and Resource Estimate

Status: Draft 0.2 · 2026-11-16 (re-verified against official sources where reachable; categories separated) · Related: [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md), [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md), [CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md#8-solo-founder-workload-model)

## 0. Rules for this document

| Label | Meaning |
|---|---|
| **Official** | Taken from the provider's own page, docs or blog on the date shown |
| **Secondary** | From a review, aggregator or news source (some cite the official page); re-check before paying |
| **Estimate** | Our calculation or assumption; inputs shown |
| **Quote needed** | No reliable public price; **no number given** |

Prices exclude VAT/taxes and currency conversion. [CONFIRMED] Spend only when it materially improves validation or development; no paid service is mandatory for the initial architecture unless technically necessary. No API is claimed for any service without evidence. Some official pages could not be opened from this research environment on 2026-11-16; those items stay **Secondary**.

Cost types: **one-time** (pay once), **recurring** (subscription/fixed), **usage-based** (scales with volume).

## 1. Price reference by category (checked 2026-11-14 / 2026-11-16)

### 1.1 Development tools
| Item | Price | Type | Label | Source |
|---|---|---|---|---|
| Claude Pro (includes Claude Code) | $20/month, or $17/month billed annually | Recurring | Secondary (cites claude.com/pricing) | https://apidog.com/id/blog/claude-haiku-5-5-pricing ; https://www.superblocks.com/blog/claude-code-pricing |
| Claude Max | From $100/month (5x); $200/month (20x) | Recurring | Secondary | Same |
| Rive editor | Free; **exports for production require a paid plan**; Cadet **$9/month billed annually** | Recurring (only while exporting) | **Official** (Rive blog) | https://rive.app/blog/rive-s-new-9-mo-plan |
| Rive Cadet monthly billing | $17/seat/month month-to-month | Recurring | Secondary (cites Rive docs) | https://frontdeskreview.com/software/design-tools/rive.md |
| Expo EAS | Free plan (limited low-priority builds); Starter $19/month incl. $45 build credit; local builds free | Recurring (optional) | Official (Expo docs, 2026-11-14) | https://docs.expo.dev/billing/faq/ |
| Prototyping tool for P-0 | Free tiers exist | — | Estimate — verify plan limits before use | — |

### 1.2 LLM API (usage-based)
| Item | Price per million tokens | Label | Source |
|---|---|---|---|
| Claude Haiku 5.5 | $0.10 input / $0.50 output (prompts ≤100k tokens); $0.50 / $2.50 above; batch $0.05 / $0.25 | Secondary (captures of platform.claude.com pricing page) | https://www.usagepricing.com/blueprint/activity/anthropic-2026-10-15-haiku-5-5-launch ; https://www.developersdigest.tech/models/claude-haiku-5-5 |
| Claude Sonnet 5.5 | $2 / $10; batch $1 / $5 | Secondary | https://apidog.com/blog/claude-sonnet-5-5-pricing/ |
| Gemini 2.5 Flash-Lite (fallback option) | $0.10 / $0.40 | Secondary | https://www.developersdigest.tech/models/gemini-2-5-flash-lite |

### 1.3 Hosting and database
| Item | Price | Type | Label | Source |
|---|---|---|---|---|
| Hetzner Cloud CX23 (2 vCPU, 4 GB) | €5.49/month (after June 2026 increase); cost-optimized plans reported unavailable to new customers in autumn 2026 | Recurring | Secondary | https://www.bitdoze.com/hetzner-cloud-review/ |
| Azerbaijani cloud (AZINCLOUD / AzInTelecom) | — | Recurring | **Quote needed** | https://tech.az/en/posts/move-your-business-to-the-cloud-environment-with-azincloud-7055 |
| Supabase (if managed Postgres/Auth chosen) | Free: 500 MB DB/project, 50,000 MAU, paused after 1 week inactivity, up to 2 active projects. Pro: from $25/month incl. first project; 100,000 MAU included, then $0.00325/MAU | Recurring + usage | **Official** (2026-11-16) | https://supabase.com/pricing |
| Self-hosted PostgreSQL on the app VM | $0 software | — | — | — |

### 1.4 Storage
| Item | Price | Type | Label | Source |
|---|---|---|---|---|
| Cloudflare R2 | Free: 10 GB-month, 1M Class A, 10M Class B operations/month; egress free; beyond: ~$0.015/GB-month | Usage | Official (free tier, 2026-11-14) + secondary (rates) | https://developers.cloudflare.com/r2/pricing |
| MinIO (local development) | $0 | — | — | — |

### 1.5 Maps and tiles
| Item | Price | Type | Label | Source |
|---|---|---|---|---|
| MapTiler Cloud | Free $0 ("testing, PoC, prototyping, personal, or non-commercial use"); **Flex $30/month** + usage; Custom by quote | Recurring + usage | **Official** (2026-11-16) | https://www.maptiler.com/cloud/pricing/ ; terms: https://www.maptiler.com/terms/cloud/ |
| Self-hosted PMTiles extract on object storage | Within storage free tier [Estimate — size measured in spike S-MAP] | Usage | Estimate | — |

### 1.6 Email (sign-in codes, account notices)
| Item | Price | Type | Label | Source |
|---|---|---|---|---|
| Amazon SES (example provider) | À-la-carte outbound $0.10 per 1,000 emails; new accounts since 21 Jul 2026 reported to start on an "Essentials" plan at $0.16 per 1,000 | Usage | Secondary | https://www.usecarly.com/blog/amazon-ses-pricing/ ; https://ecorpit.com/amazon-ses-pricing-plans-essentials-pro-enterprise-decision-2026/ |
| Other providers' free tiers | — | — | Estimate — choose in P-2 (Q-05) | — |

### 1.7 Push notifications
| Item | Price | Label | Source |
|---|---|---|---|
| Expo Push Service (relay to APNs/FCM) | Free | Secondary | https://www.courier.com/integrations/compare/expo-vs-pusher-beams |
| APNs / FCM | Free; APNs requires Apple Developer membership | Estimate (common knowledge) | — |

### 1.8 Apple and Google developer accounts
| Item | Price | Type | Label | Source |
|---|---|---|---|---|
| Apple Developer Program | **99 USD per membership year** (or local currency) | Recurring (yearly) | **Official** (2026-11-16) | https://developer.apple.com/support/compare-memberships |
| Google Play Console registration | **US$25 one-time** | One-time | **Official** (2026-11-16) | https://support.google.com/googleplay/android-developer/answer/6112435 |
| Google Play closed-testing rule | New personal accounts: ≥12 testers opted in for the last 14 continuous days before applying for production | — (calendar) | **Official** (2026-11-16) | https://support.google.com/googleplay/android-developer/answer/14151465 |
| Organization accounts exempt from that rule | — | — | Secondary | https://extendsclass.com/blog/?p=2302 |

### 1.9 SMS (only if phone sign-in is ever enabled)
| Item | Price | Label | Source |
|---|---|---|---|
| Plivo SMS to Azerbaijan | Azercell $0.2483, Bakcell $0.3390, Nar $0.4717 per SMS | Official (provider page, 2026-11-14) | https://www.plivo.com/sms/pricing/az/ |

### 1.10 Domains
| Item | Price | Label | Source |
|---|---|---|---|
| `.az` via international registrars | From ~$243/year | Secondary | https://domainoffer.net/tld/az |
| Generic `.com` | ~$8–$12/year | Secondary | https://domainoffer.net/tld/az/connectreseller |

### 1.11 Legal services
| Item | Price | Label |
|---|---|---|
| Azerbaijani lawyer: QL brief answers, privacy policy, terms | — | **Quote needed** (request 2–3 quotes in P-0 week 1) |

### 1.12 Design and freelance
| Item | Price | Label |
|---|---|---|
| Avatar v1 illustrator + Rive animator | — | **Quote needed**; brief from [AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md) |
| Part-time curator | Hours × local rate | **Quote needed** |
| Native-speaker review of outreach/legal texts | — | Quote needed (or volunteer) |

## 2. Usage-based estimates

### 2.1 LLM API
Inputs (estimate): extraction ≈ 2,000 input + 400 output tokens per source item; translation ≈ 600 in + 600 out per published item per target language (2 targets). Haiku 5.5 secondary prices.

| Volume / month | Extraction | Translation | Total |
|---|---|---|---|
| 2,000 items, 600 published | ≈ $0.80 | ≈ $0.43 | **≈ $1.25** |
| 10,000 items, 3,000 published | ≈ $4.00 | ≈ $2.16 | **≈ $6.20** |

Gateway hard cap recommendation: $10/month in Lean MVP-1, $20 in MVP-2. **LLM is not the cost driver; founder time is.**

### 2.2 SMS one-time codes
If phone sign-in were used: 1,000 sign-ups × ~1.3 SMS × ~$0.34 ≈ **$440** (estimate) plus fraud risk → deferred (D-05).

### 2.3 Email
Lean MVP-1 private beta (≤200 users, ~5 sign-in emails/user/month): ~1,000 emails → well under $1/month at the reported SES rates (estimate).

### 2.4 Maps
Self-hosted tiles: ~$0 within storage free tier (estimate). Fallback: MapTiler Flex $30/month (official).

## 3. One-time, recurring and usage summary

| Item | One-time | Recurring | Usage |
|---|---|---|---|
| Google Play registration | $25 | — | — |
| Apple Developer Program | — | $99/year | — |
| Claude Pro / Max | — | $17–$200/month | — |
| Rive Cadet (while exporting) | — | $9/month annual billing | — |
| Domain (generic) | — | ~$10/year | — |
| Hosting VM (international example) | — | ~€5.49+/month (secondary) or AZ quote | — |
| Managed DB (optional) | — | Supabase Pro from $25/month | MAU above 100k |
| Storage | — | — | Free tier, then per GB |
| LLM | — | — | ~$1–7/month |
| Email | — | — | <$1/month at beta scale |
| Maps | — | $0 or $30/month | — |
| Legal | Quote needed | Occasional | — |
| Avatar art v1 | Quote needed | Item packs: quote | — |

## 4. P-0 validation budget

| Line | Cost | Label |
|---|---|---|
| Claude Pro (already in use) | $17–20/month | Secondary |
| Telegram channel, spreadsheet, free form tool, free prototyping tool | $0 | Estimate (verify plan limits) |
| Legal quotes | $0 to request; consultation **quote needed** | — |
| Interview thank-you gifts | Optional, founder's choice | — |
| **Total required** | **≈ $17–20/month** | |

## 5. Scenarios

### A. Minimal experimentation (P-0 to P-3; local development, no real users)
| Line | Monthly | One-time | Notes |
|---|---|---|---|
| Claude Pro | $17–20 | — | |
| Hosting / DB / storage | $0 | — | Local Docker; MinIO |
| LLM API | ≤$5 | — | Gold-set experiments |
| Maps | $0 | — | Local tiles |
| Rive | $0 (editor) → $9 when exports start (P-1 spike) | — | |
| Domain | ~$1 | — | Optional |
| **Total** | **≈ $17–35/month** | $0 | |

### B. Lean MVP-1 private beta (Android + admin web, ≤200 users)
| Line | Monthly | One-time | Notes |
|---|---|---|---|
| Claude Pro → Max 5x if blocked | $17–100 | — | D-13 |
| Hosting (1 small VM) | ~€5.49–15 (secondary) or AZ quote | — | D-02 |
| Database | $0 (on VM) | — | Or Supabase Pro $25 |
| Storage | $0 (free tier, estimate) | — | |
| LLM API | $2–10 (cap) | — | |
| Maps | $0 or $30 | — | D-14 |
| Email | <$1 | — | |
| Push | $0 | — | |
| Monitoring | $0 (free tiers, estimate) | — | |
| Rive | $9 | — | |
| Google Play | — | $25 | |
| Apple Developer | ($99/yr, only when iOS stage starts) | — | |
| Domain | ~$1 | — | |
| Legal | — | **Quote needed** | Before real users (G6) |
| **Total (excl. legal)** | **≈ $35–175/month** | $25 + legal | |

### C. Early production beta (MVP-2, ≤5,000 MAU)
| Line | Monthly | One-time | Notes |
|---|---|---|---|
| Claude Max | $100–200 | — | |
| Hosting (2 VMs or VM + managed DB) | €15–60 (estimate) or AZ quote | — | |
| Storage, email, push, monitoring | $0–35 | — | Free tiers may be exceeded |
| LLM API | $10–20 (cap) | — | |
| Maps | $0–30 | — | |
| Rive | $9 | — | |
| Apple Developer | $8.25 ($99/yr) | — | |
| Domain (`.az` optional) | $1–20 | — | |
| Part-time curator | Quote needed | — | If content ops > 6 h/week |
| Avatar art v1 | — | Quote needed | |
| **Total (excl. people, art, legal)** | **≈ $150–400/month** | Quotes | |

## 6. Human resources (founder hours dominate)

| Activity | Who | Effort (expected) | Automatable? |
|---|---|---|---|
| Validation (P-0) | Founder | ~90 h over 8 weeks | No |
| Implementation | Founder + Claude Code | Lean MVP-1 ≈104 dd ≈ 624 h ([roadmap](./IMPLEMENTATION_ROADMAP.md#4-effort-re-estimate-not-a-rescaling)) | Partly (AI-assisted; review is human) |
| Content operations | Founder | 1.5–5 h/week by phase ([CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md#8-solo-founder-workload-model)) | Progressive, after MVP-1 |
| Outreach, legal coordination, admin | Founder | ~1–2 h/week | No |
| Avatar art v0 | Founder | 40–80 h within P-4 | No (tools assist) |
| Avatar art v1 | Freelancers | Quote | No |
| Legal | Counsel | Quote | No |

## 7. Cost risks

- Hosting prices rose in 2026 at a major budget provider (secondary); stay provider-neutral (ADR-0017).
- Free tiers change; check monthly; alternatives in [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md).
- Claude subscription usage limits may push to Max; decide on evidence (D-13).
- SMS fraud if phone sign-in is ever enabled.
- Rive monthly billing is reported at nearly double the annual rate; buy annual only once avatar work is certain.
