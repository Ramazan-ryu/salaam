# Integration Research

Status: Draft 0.1 · 2026-11-14 · Related: [DATA_SOURCES_REGISTER.md](./DATA_SOURCES_REGISTER.md), [PARTNERSHIP_STRATEGY.md](./PARTNERSHIP_STRATEGY.md), [AI_CITY_INTELLIGENCE.md](./AI_CITY_INTELLIGENCE.md)

> Every claim below carries a source and the date it was checked. "Secondary" means a non-official source (news, aggregator, review site); such claims must be re-confirmed against the provider's own documentation or by direct contact before engineering depends on them. Platform terms change; re-check each item before building its connector.

> **Update 2026-11-21:** The founder-supplied provider review in [LOCAL_PRODUCT_REFERENCES.md](./design/LOCAL_PRODUCT_REFERENCES.md) is the current authority for CineMastercard, Park Cinema, iTicket, Wolt, Bolt, EduMap, Alinino, Baku Book Center, Libraff, and Eventeam. It supersedes older API status wording below where inconsistent. In particular, Bolt's official rider support says no public or private APIs are currently offered; Wolt's documented APIs are partner/merchant workflows, not open consumer discovery; Eventeam's terms restrict systematic downloads for database creation.

## 1. Classification summary

| Provider / source | Now | Target | Key limitation |
|---|---|---|---|
| Instagram — venue's own account, owner-authorized | Type 1 (after Meta App Review) | Type 1 | App Review; Stories and Reels on other accounts not available; storage/display rules |
| Instagram — accounts that have not authorized Salaam | Type 5 (except gated Business Discovery) | — | Not permitted at scale; Hashtag Search capped |
| Facebook Pages | Type 5 until researched | ? | [UNVERIFIED] Page public content access requires review |
| Telegram channels | Research needed | Type 1 (bot added by channel owner) | [UNVERIFIED] mechanics and terms |
| iTicket.az | Type 4 | Type 2 | No public third-party API documentation identified; partner approval needed |
| CineMastercard / Park Cinema / Nizami | Type 4 | Type 2 | No public third-party showtime/booking API documentation identified |
| Wolt | Type 4 | Type 2 only with approval | Partner/merchant APIs, not open consumer discovery |
| Bolt | Type 4 | Not assumed | Official rider support says no public or private API currently offered |
| EduMap, Alinino, Baku Book Center, Libraff | Type 4 | Type 2 only by agreement | No public third-party API/feed docs identified |
| Eventeam | Type 4 link-out only | Type 2 only by written permission | Terms prohibit systematic download/storage for database creation |
| McDonald's Azerbaijan, KFC Azerbaijan, BİR-İKİ | Type 4 | Type 2 only by agreement | No local public third-party restaurant/menu API docs identified |
| APAR | Type 4 | Type 2 (station data) | No public API found |
| Supermarkets (Bravo, Araz, OBA, Bazarstore) | Postponed | Type 2 | No public offer feeds found |
| OpenStreetMap | Type 3 (open data, ODbL) | — | Attribution & share-alike obligations |
| Weather (e.g. Open-Meteo) | Type 1 | — | [UNVERIFIED] licence for commercial use — check before P-4 |
| Organizer submissions | Owned channel | — | Moderation |
| RSS / ICS calendars, schema.org Event markup | Type 3 where terms permit | — | Per-site terms & robots rules |

## 2. Detailed findings

### 2.1 Instagram / Meta

| # | Question | Finding | Source (checked 2026-11-14) |
|---|---|---|---|
| 1 | Official API? | Yes — Instagram Graph API (Instagram API with Facebook Login) for Business/Creator accounts. Instagram Basic Display API ended 4 Dec 2024. | https://www.getphyllo.com/post/instagram-api-guide (secondary) ; https://developers.facebook.com/documentation/instagram-platform/changelog.md (official) |
| 2 | Data available | For an authorized professional account: its own media, comments, insights. Business Discovery: basic metadata/metrics and media of *other* professional accounts, queried via the app user's professional account. | https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-facebook-login/business-discovery (official) |
| 3 | Available to independent apps? | Yes, through Meta app registration, App Review and (for some features) business verification. | Official docs above; https://www.xpoz.ai/blog/guides/instagram-api-pricing-2026/ (secondary) |
| 4 | Approval needed? | Hashtag Search requires App Review for Instagram Public Content Access and `instagram_basic`. | https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-facebook-login/hashtag-search (official) |
| 5 | Restrictions | Hashtag Search: max 30 unique hashtags per professional account per rolling 7 days. Personal (non-professional) accounts cannot be accessed. Stories/Reels of third-party accounts are not available via these endpoints. | Hashtag Search docs (official); https://dev.to/agenthustler/instagram-data-api-in-2026-what-developers-use-when-the-official-api-wont-work-4e0 (secondary) |
| 6 | Rate limits | Business Discovery & Hashtag Search use Platform Rate Limits: 200 calls/hour × number of app users. | https://bundle.social/blog/instagram-api-rate-limits (secondary) |
| 7 | Public posts collection? | Only via the above endpoints and within their limits; no general public-post firehose. | As above |
| 8 | Storage? | Governed by Meta Platform Terms and developer policies [OPEN — read current terms before P-5; QL-07]. | — |
| 9 | Display in third-party app? | For owner-authorized accounts with consent: expected to be acceptable for the owner's own content [ASSUMPTION — confirm in Meta terms and in organizer consent]. For other accounts: high risk. | — |
| 10 | Attribution | Always show account name and link to original post (Salaam policy); check Meta brand guidelines. | — |
| 11 | Legal/policy limits | Third-party scrapers exist and charge per call; **excluded** by Salaam rules (no unauthorized scraping). | https://www.xpoz.ai/blog/guides/instagram-api-pricing-2026/ (secondary) |
| 12 | Alternatives | Organizer portal, email forwarding, Telegram bot (owner-added), official websites/ICS, manual curation. | — |

**Recommendation (D-09):** implement `instagram_owned_account` connector only: an organizer connects their own professional account via OAuth; Salaam imports their *posts* (not Stories) as drafts into the review pipeline. Do not use Business Discovery for unconnected accounts until legal review (QL-07). Submit Meta App Review during P-5; the product must work if it is rejected.

### 2.2 iTicket.az
- Ticketing since 2016; concerts, theatre, festivals, sports, attractions; 20+ Baku sales outlets. Source: https://iticket.az/en/page/about (official, checked 2026-11-14).
- Claims ~95% Baku market share; exclusive Baku F1 ticketing partner since 2018. Source: https://iticket.com.tr/en/pages/about (official group site, checked 2026-11-14).
- No public API or affiliate programme found [UNVERIFIED absence]. Robots/terms of website not reviewed — **no collection from the website** without permission.
- **Classification:** Type 4 now (link to event page provided by organizer or curator); Type 2 target.

### 2.3 Cinemas
- CineMastercard = rebranded CinemaPlus (March 2024), then 10 cinemas: https://www.mastercard.com/news/eemea/en/newsroom/press-releases/en/2024/march/mastercard-and-cinemaplus-announces-strategic-partnership-launching-cinemastercard (official, checked 2026-11-14). Venues include Ganjlik Mall, 28 Mall, Deniz Mall, Amburan Mall, Azerbaijan Cinema (Baku), plus Ganja and Sumgayit: https://cinematreasures.org/chains/2547/previous (secondary).
- Park Cinema (Aygun Mall, Flame Towers, Metro Park, Park Bulvar, Zaqulba) and Nizami Cinema: https://cinematreasures.org/theaters/azerbaijan/baku (secondary, checked 2026-11-14).
- "City Cinema / Baku Cinema": **could not be verified** as a separate operator.
- No public showtime APIs found. **Classification:** Type 4 + manual curation of showtimes for top films (from public pages, attributed, link-out) [OPEN — confirm website terms permit manual reference; QL-07]; Type 2 target.

### 2.4 Wolt
- Wolt Drive API is for merchants using Wolt as a last-mile carrier; marketplace APIs integrate merchant POS/menus: https://developer.wolt.com/docs/api/wolt-drive (official, checked 2026-11-14).
- Menu API rate limit: 1 call/15 min per venue (merchant-side): https://developer.wolt.com/docs/marketplace-integrations/retail-advanced/api-integration (official).
- No consumer discovery API found. Wolt operates in Baku: https://wolt.com/az/aze/baku.
- **Classification:** Type 4 (link to venue page on Wolt where the venue is listed). Ordering = Type 5.

### 2.5 Bolt
- Profiled as offering no public ride-booking API; business booking through its Ride Booker tool and private partnerships: https://apis.io/providers/bolt-eu/ (secondary, generated 2026-07-22, checked 2026-11-14).
- API connectivity offered to strategic partners: https://xcelerator.siemens.com/global/en/all-offerings/products/r/ride-hailing-shared-cars-and-scooters.html (secondary).
- Bolt operating in Baku: [UNVERIFIED in this research].
- **Classification:** Type 4. Deep-link format and permission must be confirmed [OPEN].

### 2.6 APAR (bike-sharing — not taxi)
- Baku's first bike-sharing service, hybrid and mechanical bikes; per-minute and subscription plans in the APAR app: https://tech.az/en/posts/apar-baku-s-first-bike-sharing-service-celebrates-its-1st-anniversary-5546 (secondary, checked 2026-11-14).
- Launched 24 Aug 2024; ~70 parking points; ~46,000 users at time of report: https://www.azernews.az/business/236282.html (secondary).
- No public API found. **Classification:** Type 4 (open APAR app); station locations as places only with permission or from open data [OPEN].

### 2.7 Supermarkets
- Bravo launched app and "Bravo Online" in 2025: https://tech.az/en/posts/bravo-introduced-its-online-sales-platform-and-a-renewed-store-network-in-2025-6383 (secondary).
- OBA Market app shows prices and weekly specials: https://mwm.ai/apps/oba-market/1553673117 (secondary). Araz runs regular discount campaigns: https://arazmarket.az/en/news/events/araz-supermarket-chain-adds-value-to-the-countrys-economy (official). Bazarstore iOS app exists: https://apps.apple.com/ru/app/bazarstore/id6463725121.
- No public offer feeds found. **Postponed** (F-100).

### 2.8 Event platforms & open formats
- RSS/Atom, iCalendar (ICS) and schema.org `Event` JSON-LD are standard, low-cost formats. Use **only** where the site's terms and robots rules permit automated access, recorded per source in the register.

### 2.9 Maps & places base data
- OpenStreetMap data (ODbL): attribution required; derived databases may carry share-alike obligations [OPEN — counsel/OSMF guidance before mixing OSM-derived place data with proprietary data; QL-09].
- Google Places: strict caching/storage limits in its terms [UNVERIFIED in this research] — not planned.

## 3. What this means for the product

1. The product must deliver value with **organizer submissions + curator entry + owned-account connections + permitted feeds** alone.
2. All "booking", "ordering" and "ride" actions are external links in the MVP.
3. Every new source requires a `DS` record with terms reviewed **before** a connector is enabled ([DATA_SOURCES_REGISTER.md](./DATA_SOURCES_REGISTER.md)).

## 4. Founder-supplied provider API review (2026-11-21)

This review checked public provider material. “No public API docs identified” does not prove private partner access is unavailable. Do not implement a connector until the provider confirms access, permitted fields, freshness, rate limits, attribution, retention, and commercial-use terms in writing.

| Provider | Current finding | Salaam path |
|---|---|---|
| CineMastercard / CinemaPlus | The official privacy notice mentions its first-party site/API, but no third-party developer API docs were identified. The described purchase flow processes account, session, seat, payment, and ticket data inside CinemaPlus. | Link to film/session; partner request before showtime sync or booking. |
| Park Cinema | Film, language, venue, and date filters are visible on the public site; no developer API docs identified. | Link-out; do not scrape schedules or imply booking access. |
| EduMap | The supplied site returned 403 to this research browser; no public API docs identified. | Organizer/provider submission or handoff. |
| iTicket | Official material describes online ticketing, venue maps, organizer services, QR tickets, refunds, and an AI assistant; no public third-party API docs identified. | Ask for a documented partner feed/API; otherwise link to the official event. |
| Wolt | Official APIs exist for merchant/retail integration. Wolt requires partner terms and credentials; restaurant onboarding includes a merchant and approval. This is not a public end-user restaurant search API. | Link to venue/order page now; only integrate with Wolt and merchant authorization. |
| Bolt | Official rider support explicitly says Bolt currently offers no public or private APIs. Separate Bolt Business / Ride Booker products do not establish consumer ride API access. | Destination handoff to Bolt; no live fare, driver, ETA, or status in Salaam. |
| Alinino / Baku Book Center / Libraff | No public third-party catalogue or event API docs identified. | Link to the provider; use only licensed feeds or directly submitted data. |
| Eventeam | No public API docs identified. Published terms prohibit systematically downloading and storing platform information to build a database. | Do not scrape or bulk-copy. Require explicit written permission and supported feed/API. |
| McDonald's Azerbaijan | No local third-party API docs identified. Its official McDelivery page directs customers to Wolt or Bolt Food. | Use an official handoff; no menu or order integration without a local agreement. |
| KFC Azerbaijan | No local third-party API docs identified; the supplied homepage was not readable in this browser review. | Link to the official site or authorized delivery provider; no scraping or assumed API. |
| BİR-İKİ Dönər | Official page exposes menu, delivery, branch, and external order destinations; no third-party API docs identified. | Link to the provider or use partner-supplied menu and branch data. |

Primary sources: [Bolt API support](https://bolt.eu/en/support/articles/360017256060/), [Wolt developer FAQ](https://developer.wolt.com/docs/faq), [Wolt restaurant onboarding](https://developer.wolt.com/docs/getting-started/restaurant), [iTicket About](https://iticket.az/en/page/about), [CineMastercard privacy notice](https://web.cinemastercard.az/ru/privacy-policy), [Eventeam terms](https://eventeam.az/terms-conditions), [McDonald's Azerbaijan McDelivery](https://www.mcdonalds.az/mcdelivery), [BİR-İKİ Dönər](https://bir-iki.az/). Full design interpretation and each founder-supplied URL are in [LOCAL_PRODUCT_REFERENCES.md](./design/LOCAL_PRODUCT_REFERENCES.md).
