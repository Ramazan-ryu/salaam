# Partnership Strategy (Solo Founder)

Status: Draft 0.1 · 2026-11-14 · Related: [INTEGRATION_RESEARCH.md](./INTEGRATION_RESEARCH.md), [DATA_SOURCES_REGISTER.md](./DATA_SOURCES_REGISTER.md), [MARKET_AND_COMPETITOR_ANALYSIS.md](./MARKET_AND_COMPETITOR_ANALYSIS.md)

[CONFIRMED] The founder handles outreach personally. Partnerships are desirable but **must not block** the technical prototype. Every product flow works with Type 4 (external link) integrations.

## 1. Principles

1. **Give before asking.** Offer organizers free reach and attribution before asking for data feeds.
2. **Small first.** Independent venues and organizers say yes faster than large chains; they also fill the unticketed long tail.
3. **Consent on record.** Every data arrangement is recorded in the [DATA_SOURCES_REGISTER.md](./DATA_SOURCES_REGISTER.md) with scope, permitted use, attribution and retention.
4. **No exclusivity, no payments** in MVP.

## 2. Partnership tiers

| Tier | Partner type | What we ask | What we give | Integration type |
|---|---|---|---|---|
| P1 | Independent venues, galleries, clubs, workshop hosts, student clubs | Submit events via portal, or connect their own Instagram professional account | Free listing, attribution, link to their profile, basic stats (later) | Type 1 (owned account) / organizer portal |
| P2 | Cultural institutions (museums, philharmonic, theatres, cultural centres) | Permission to use their official calendar (website/ICS/RSS) | Attribution, accurate multilingual listings | Type 3 (permitted) or Type 2 |
| P3 | Cinema chains (CineMastercard, Park Cinema, others) | Showtime feed (file or API) | Traffic to booking pages | Type 2; fallback Type 4 + curated showtimes |
| P4 | Ticketing (iTicket.az) | Event feed or affiliate/deep-link programme | Traffic, discovery for unticketed audience | Type 2; fallback Type 4 |
| P5 | Mobility & city bodies (APAR, transport agency) | Station locations / open data; deep-link permission | Promotion of cycling activities | Type 2/3 |
| P6 | Universities & communities | Help recruiting beta testers | Early access, campus event listings | — |

## 3. Initial target list (candidates — none contacted; details to verify)

| Target | Tier | Why | Status |
|---|---|---|---|
| iTicket.az | P4 | Dominant ticketing in Baku (self-reported ~95% share) | Not contacted |
| CineMastercard | P3 | Largest chain identified (former CinemaPlus) | Not contacted |
| Park Cinema | P3 | Separate chain with several Baku venues | Not contacted |
| Nizami Cinema | P3 | Independent cinema listed | Not contacted [UNVERIFIED operator] |
| Major cultural venues (e.g. Heydar Aliyev Center, YARAT, Baku Jazz Center, Mugham Center, Philharmonic, Opera & Ballet Theatre) | P2 | High-quality official calendars | Not contacted [names from general knowledge; verify official sites & terms] |
| 20 independent venues identified in the curation sprint | P1 | Long tail; fastest yes | To be listed in P-0 |
| APAR | P5 | Bike-sharing; cycling activities | Not contacted |
| ADA University, Baku State University, UNEC, BHOS student unions | P6 | Beta recruitment, campus events | Not contacted [verify contacts] |

## 4. Outreach requirements (what must exist before contacting)

| Asset | Needed for | Ready by |
|---|---|---|
| One-page product description (az/ru/en) | All tiers | P-0 |
| Organizer value proposition + attribution policy | P1, P2 | P-0 |
| Data-use terms template (scope, attribution, retention, removal on request) — reviewed by counsel | P2–P5 | Before first signed arrangement |
| Organizer submission form (even a simple form in MVP-0) | P1 | P-3 |
| Instagram connection consent text and help page | P1 | P-5 (after App Review) |
| Demo (clickable prototype → working beta) | P3, P4 | P-4+ |
| Contact log (CRM-light: spreadsheet or Tasks artifact) | All | P-0 |

## 5. Outreach sequence (solo-founder cadence)

| Step | When | Volume | Goal |
|---|---|---|---|
| 1 | P-0 weeks 1–4 | 20 independent venues | ≥5 agree to submit or connect (A5) |
| 2 | P-0/P-1 | 5 cultural institutions | ≥2 permit calendar use |
| 3 | P-4 (with demo) | 2 cinema chains | 1 showtime feed pilot (upside) |
| 4 | P-6 (with beta metrics) | iTicket.az | Feed or deep-link agreement (upside) |
| 5 | Ongoing | Universities | 12+ Android closed testers, 50–200 beta users |

Time budget: ~2–3 h/week of outreach during P-0/P-1, ~1 h/week afterwards.

## 6. Fallbacks if partners say no

| Partner gap | Fallback |
|---|---|
| No cinema feed | Curator enters showtimes for top films weekly from public cinema pages (manual entry, attributed, link-out); scope limited to what is sustainable |
| No iTicket feed | Organizers submit events they sell on iTicket with the ticket link; curators add major events manually |
| No Instagram App Review approval | Organizer portal + email/Telegram forwarding + manual curation |
| No institutional permission | Link to their official calendar; list only facts curators verify |

All fallbacks are documented per source in [DATA_SOURCES_REGISTER.md](./DATA_SOURCES_REGISTER.md).
