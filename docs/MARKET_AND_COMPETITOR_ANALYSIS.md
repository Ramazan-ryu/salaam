# Market and Competitor Analysis

Status: Draft 0.1 · 2026-11-14 · Related: [INTEGRATION_RESEARCH.md](./INTEGRATION_RESEARCH.md), [PARTNERSHIP_STRATEGY.md](./PARTNERSHIP_STRATEGY.md)

> Scope note: this is desk research done in Phase 0/1 with limited depth. Market sizing is **not** estimated because no reliable figures were gathered; inventing numbers would violate the project rules. Competitor states are point-in-time and must be re-checked.

## 1. Local market observations (Baku / Azerbaijan)

| Observation | Status | Source (checked 2026-11-14) |
|---|---|---|
| iTicket.az launched 2016; sells tickets for concerts, theatre, festivals, sports, attractions; runs 20+ sales outlets in Baku | [VERIFIED 2026-11-14] | https://iticket.az/en/page/about |
| iTicket claims ~95% market share in Baku (self-reported) and has been Baku F1's exclusive ticketing partner since 2018 | [VERIFIED as company claim] | https://iticket.com.tr/en/pages/about |
| CineMastercard is the rebranded CinemaPlus chain (announced March 2024, 10 cinemas at the time) | [VERIFIED 2026-11-14] | https://www.mastercard.com/news/eemea/en/newsroom/press-releases/en/2024/march/mastercard-and-cinemaplus-announces-strategic-partnership-launching-cinemastercard |
| Park Cinema is a separate chain with several Baku locations; Nizami Cinema also operates | [VERIFIED 2026-11-14, secondary] | https://cinematreasures.org/theaters/azerbaijan/baku |
| Wolt operates in Baku and lists supermarkets (Bravo, Araz) | [VERIFIED 2026-11-14] | https://wolt.com/az/aze/baku |
| APAR bike-sharing launched Aug 2024; ~70 parking points and ~46,000 users at time of report | [VERIFIED, date of report unclear] | https://www.azernews.az/business/236282.html |
| Supermarkets run their own apps/loyalty with weekly offers (Bravo app 2025, OBA Market app) | [VERIFIED 2026-11-14] | https://tech.az/en/posts/bravo-introduced-its-online-sales-platform-and-a-renewed-store-network-in-2025-6383 ; https://mwm.ai/apps/oba-market/1553673117 |
| Instagram is a primary announcement channel for Baku venues | [ASSUMPTION] | Phase 0 observation; validate in A1/A2 |
| Telegram channels are a significant discovery channel | [UNVERIFIED] | Validate in A1/A2 |
| Android share in Azerbaijan exceeds iOS | [UNVERIFIED] | Affects D-07; check StatCounter-type data before P-4 |

## 2. Existing alternatives (how users solve the job today)

| Alternative | What it does well | Gap Salaam targets | Threat level |
|---|---|---|---|
| **Instagram** (venues, promoters, influencers) | Where announcements originate; visual; social proof | Fragmented, follower-bound, Stories disappear, no "tonight near me", no verification | **High** — default behaviour |
| **iTicket.az** | Dominant ticketing; official event pages | Only ticketed events; not personalised; not free/unticketed culture, cafés, places | Medium — also a potential partner |
| **Cinema chain sites/apps** | Authoritative showtimes | One chain at a time | Low — partner candidates |
| **Google Maps** | Places, reviews, directions | Weak events; no curation; not social | Medium for places |
| **Telegram "afisha"-style channels** | Curated, timely | Not personalised, not searchable by time/place, no reminders | Medium [UNVERIFIED landscape] |
| **2GIS** | Maps/places in CIS markets | Presence and event coverage in Baku [UNVERIFIED] | Unknown |
| **Word of mouth / friends** | Trust | Doesn't scale | — |

Global players (Eventbrite, Meetup, Fever, DICE) are not assessed for local presence here — [UNVERIFIED]; re-check before public launch.

## 3. Positioning

**Salaam = verified + personal + social + playful, across all city life, in three languages.**

| Dimension | Instagram | iTicket | Google Maps | Salaam |
|---|---|---|---|---|
| Time-aware ("tonight") | ✗ | Partial | ✗ | ✓ |
| Trust labelling | ✗ | ✓ (own events) | Partial | ✓ (all items) |
| Unticketed/free events | Partial | ✗ | ✗ | ✓ |
| Places + events together | ✗ | ✗ | Partial | ✓ |
| Friends going | Partial | ✗ | ✗ | ✓ |
| Personal avatar identity | ✗ | ✗ | ✗ | ✓ |
| az / ru / en | Mixed | Partial [UNVERIFIED] | ✓ | ✓ |

## 4. Opportunities

1. **Aggregation of the unticketed long tail** (galleries, workshops, free events, community events) — not served by ticketing.
2. **Trust layer** — explicit verification/freshness is rare and directly addresses UP-3.
3. **English completeness** for expats and tourists; web event pages indexed by search engines.
4. **Organizer tooling** — a free, simple submission/connection path gives small organizers reach.
5. **Avatar identity** — differentiation and shareability (avatar cards when inviting friends).

## 5. Risks

| Risk | Note | Mitigation |
|---|---|---|
| Instagram remains "good enough" | Habit is strong | Win on "tonight near me + verified + friends"; share links back into Instagram/Telegram |
| Supply thinness | Core risk (R-01) | Curation sprint (A1), organizer portal, owned-account connections |
| Large-platform entry | A global or regional super-app adds events | Local depth, three languages, trust model, organizer relationships |
| Partner dependency | iTicket/cinemas could decline | Product designed to work on Type 4 links ([INTEGRATION_RESEARCH.md](./INTEGRATION_RESEARCH.md)) |
| Regulatory | New social-platform rules (Aug 2026) | Legal review before beta ([LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md)) |

## 6. Research still required (P-0)

- Catalogue Baku event/announcement channels (Instagram, Telegram, websites) during the curation sprint.
- Check presence and features of 2GIS, Telegram afisha channels and any local listing sites.
- Obtain mobile OS share for Azerbaijan from a citable source.
