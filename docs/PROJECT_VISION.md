# Project Vision

Status: Draft 0.1 · 2026-11-14 · Related: [PRODUCT_DISCOVERY.md](./PRODUCT_DISCOVERY.md), [PRODUCT_REQUIREMENTS_DOCUMENT.md](./PRODUCT_REQUIREMENTS_DOCUMENT.md), [MVP_SCOPE.md](./MVP_SCOPE.md)

## 1. Vision statement

**Salaam is a city companion for Azerbaijan: a trusted, personal, playful way to discover what to do — now, nearby, with the people you care about — guided by your own avatar.**

It is a unified discovery layer over city life (events, places, cinema, culture, later offers and mobility), not a replacement for ticketing, delivery or ride-hailing providers.

## 2. Problem statement

[ASSUMPTION — to validate in P-0, see [PRODUCT_DISCOVERY.md](./PRODUCT_DISCOVERY.md#6-assumptions-and-validation-plan)]

Information about city life in Baku is fragmented across venue Instagram posts and Stories, ticketing sites, cinema sites, Telegram channels, retailer apps and word of mouth. Finding a good plan for "tonight" or "this weekend" takes effort, information is often stale (cancelled, sold out, wrong time), and much of it is not available in all three languages people use (Azerbaijani, Russian, English). People miss things they would have enjoyed, and organizers struggle to reach people beyond their existing followers.

## 3. Who it is for

[CONFIRMED] Initial pilot city: Baku. Long-term initial market: Azerbaijan as a whole. Languages: Azerbaijani, Russian, English from the beginning.

The vision is not limited to one demographic. Segments analysed in [PRODUCT_DISCOVERY.md](./PRODUCT_DISCOVERY.md#2-user-segments): students, young professionals, local residents and families, tourists, expats, and organizers/venues (supply side).

[RECOMMENDED — D-04] Initial validation segment: young adults (18–30) in Baku — students and young professionals — with English-language completeness serving expats and tourists via the web.

## 4. Value proposition

| For | Salaam gives | Unlike |
|---|---|---|
| Residents | One place to find verified things to do that fit their time, location, interests and company | Scrolling dozens of Instagram accounts and channels |
| Visitors / expats | Trustworthy city information in English (and Russian) | Azerbaijani-only posts, outdated listicles |
| Organizers | Free reach to an interested local audience, with their own content attributed | Paid promotion or follower-only reach |

## 5. Product principles

These principles resolve trade-offs. When two conflict, the higher one wins.

1. **Trust over volume.** Never present unverified or AI-generated information as fact. A smaller set of correct listings beats a large set of doubtful ones. (See the status model in [GLOSSARY.md](./GLOSSARY.md#status-model-two-independent-axes--availability).)
2. **Privacy by default.** Private location by default, explicit consent, no continuous tracking, data minimisation. The product works without live location.
3. **Useful in 30 seconds.** A user should find something worth doing within 30 seconds of opening the app. Delight never blocks utility.
4. **The avatar is the identity, not decoration.** The avatar is a central product concept: it greets, reacts, delivers suggestions and represents the user socially. It must earn its space and never slow down or obscure practical functions.
5. **Legitimate data only.** Official APIs, authorized integrations, permitted public sources, organizer submissions and human curation. No unauthorized scraping, no bypassing protections.
6. **Deterministic first, AI where it is better.** Use AI for language understanding and extraction; use rules, schemas and databases for everything that must be exact.
7. **Respectful attention.** Notifications are a privilege: few, relevant, controllable, never spam.
8. **Solo-sustainable.** Every component must be operable by one person with a small budget. Prefer fewer moving parts.
9. **Modular and extensible.** New cities, sources, categories and modules are added without redesigning the core.

## 6. What Salaam is not (scope guardrails)

- Not a general social network (no open feed, posts or communities in the MVP) — [CONFIRMED].
- Not a ticketing, payment, food-ordering or ride-booking platform until a provider authorizes such integration — [CONFIRMED].
- Not a scraper of social media.
- Not a 3D world in the MVP — [CONFIRMED]; the architecture keeps 3D possible ([AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md#9-future-3d-compatibility)).

## 7. Long-term direction (not commitments)

| Horizon | Direction |
|---|---|
| MVP | Baku: verified events, places, cinema showtimes; avatar-first home; save/remind/invite; light social; organizer portal; admin & review pipeline. |
| Next | AI city assistant over verified data; richer social (plans, groups); digital inventory as avatar items; deals from authorized sources. |
| Later | Sumgait, Ganja and other cities; partner integrations (booking handoffs, showtime feeds); 3D environment objects; business tools and monetization. |

## 8. How success will be judged

See [MVP_SCOPE.md](./MVP_SCOPE.md#5-success-metrics). In short: enough verified supply, high accuracy, users saving/sharing plans, and retention — achieved with workload one founder can sustain.
