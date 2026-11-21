# Salaam Local Product References

Status: founder-supplied reference review · reviewed 2026-11-21.

This document extracts product and interaction principles from the local services the founder named. These sites are reference-only. Their brand assets, photos, copy, data, and interface layouts are not licensed for Salaam by appearing in this list. The API notes record what was visible in official public material during this review; “not found” means no public developer documentation was identified, not that a private partnership API cannot exist.

## Product lessons for Salaam

| Reference | User job it demonstrates | Principle Salaam can use | What Salaam should not copy |
|---|---|---|---|
| [CineMastercard](https://cinemastercard.az/) | Choose a film, compare cinema sessions and formats, select seats, and buy a ticket | Make cinema discovery specific: film, date, cinema, language, format, session, seat availability, and price are distinct facts. Keep the path from discovery to the ticket provider clear. | Its brand, ticket flow, member/payment UI, or any assumption that Salaam can book through its systems. |
| [Park Cinema](https://new.parkcinema.az/az) | Browse films and filter by cinema, language, and date | Let users narrow by the constraints that matter to an outing; show cinema and schedule context before a purchase handoff. | Its identity, layout, or unverified schedule and booking data. |
| [EduMap](https://edumap.az/) | Find education-related opportunities and information | Treat learning as a real city-life interest: courses, talks, workshops, and education events can sit beside entertainment when the user chooses that interest. | Treating the reference as proof of a public events API or copying its content. The page was not readable in this review, so this is a category-level product inference from the supplied URL. |
| [iTicket](https://iticket.az/en) | Discover events across categories, dates, venues, and price ranges, then purchase tickets | Use strong event imagery and useful metadata together. Build editorial collections such as “this weekend” while preserving date, venue, age suitability, starting price, and ticket-source context. A purchase handoff should retain the selected event. | Its event artwork, event database, ticketing UI, or presenting its tickets as Salaam inventory. |
| [Bolt Rides](https://bolt.eu/en-az/rides/) | Arrange transport to a destination | Put transport at the end of an intent-led plan: “go to this event” can hand off destination details. Make clear when the user is leaving Salaam and what information is passed. | Simulating a live ride, fare, vehicle, driver, safety status, or booking when Salaam has no authorized ride integration. |
| [Wolt · BIR-IKI](https://wolt.com/az/aze/baku/restaurant/biriki-doner) | Check a restaurant's menu, options, descriptions, and prices, then order | Food needs item-level data and availability, not only a venue photo. Distinguish dine-in discovery from delivery ordering; show menu freshness and route order actions to the provider. | Wolt’s ordering interface, menu imagery, prices, availability, delivery estimates, or treating its merchant APIs as a public restaurant-search API. |
| [McDonald's Azerbaijan](https://www.mcdonalds.az/) | Find official information and continue to delivery using a supported ordering channel | Clearly separate brand discovery from fulfilment, and name the delivery provider before handing off. The Azerbaijan McDelivery page directs customers to Wolt or Bolt Food; this makes the third-party boundary explicit. | Brand materials, product imagery, promotions, menu data, or inferring API access from links to delivery partners. |
| [KFC Azerbaijan](https://kfc.az/az/home) | Use the official site as the intended destination for local restaurant information | Keep Salaam’s listing concise and hand off to the provider for current menus and transactions. The research browser could not read this page, so no specific interface feature is asserted. | Menu, locations, availability, prices, or ordering flow unless confirmed from an accessible authorized source. |
| [BİR-İKİ Dönər](https://bir-iki.az/) | Find the menu, branches, and delivery route | A local restaurant can connect multiple branches, menu information, and an ordering provider. In Salaam, show the closest confirmed branch and offer separate “visit” and “order” actions when their data is verified. | Brand assets or menu details without permission; do not present the delivery website as an API. |
| [Alinino](https://alinino.az/) | Browse a broad retail catalogue by language, subject, and product type | Represent books and retail as structured interests with useful facets, rather than generic “shopping” cards. Use this as inspiration for personal collections and local book-related events. | Product images, catalogue content, prices, inventory, or the shop’s information architecture wholesale. |
| [Baku Book Center](https://bakubookcenter.az/) | Find books, recommendations, events, projects, and a physical cultural destination | A venue may be both a place to visit and a source of events. Connect a book talk or recommendation to the actual venue and its map destination. | Their content and photography, or implying live stock or schedules without a source. |
| [Libraff](https://www.libraff.az/) | Explore a deep book taxonomy and find themed titles | Good taxonomy makes niche interests discoverable. Use explicit user-selected interests and human-readable categories to improve event relevance. | Scraping its catalogue or copying category taxonomies as if they were Salaam-owned. |
| [Eventeam](https://eventeam.az/) | Discover social events, see participation context, and follow ticket or registration actions | Event discovery can connect naturally to “invite a friend”, “interested”, and “make a plan”. Keep participation counts and ticket availability visibly sourced and current. | Its event content, user/participant data, social graph, or storing systematically downloaded listings. Its public terms expressly prohibit systematic downloading and storing application information to build a database. |

## Cross-reference principles

1. **Start with the user's moment.** Ask what they want to do, when, and how far they are willing to travel; then reveal a small set of relevant options.
2. **Keep discovery and fulfilment connected.** Salaam can help compare and plan, while the authorized provider remains responsible for ticket purchase, ride booking, food orders, or retail checkout unless a formal integration changes that boundary.
3. **Show the facts that decide an outing.** Time, date, venue, distance, language, age restrictions, price, availability, and source should be visible when applicable. Unknown data stays unknown.
4. **Use content-specific compositions.** Film posters, event photography, restaurant menus, learning opportunities, and bookstores need different image ratios and information hierarchies within one shared Salaam design system.
5. **Treat a place as a node in a plan.** Connect an event to its venue, map position, route handoff, nearby options, and the people the user chooses to invite.
6. **Make partner boundaries visible.** Label a provider, show when an external page or app will open, and avoid implying that Salaam owns the transaction or guarantees a provider's availability.
7. **Use local context without becoming a directory clone.** Salaam's distinct value is joining interests, timing, location, people, and a clear next step—not reproducing each provider's catalogue.

## Public API and integration review

This is an initial public-documentation review, not a partnership negotiation or a live API test. Verify coverage, permissions, terms, commercial use, rate limits, data freshness, attribution, and credentials before implementation.

| Provider | Public API finding | Practical Salaam route today |
|---|---|---|
| CineMastercard / CinemaPlus | Public developer documentation was not found. Its privacy notice mentions a site/API in its technical operations, but that does not document an API available to third-party developers. | Link to the relevant movie/session page. Ask CinemaPlus about an authorized listing or booking partnership before syncing showtimes or booking seats. |
| Park Cinema | No public developer API documentation was identified in this review. | Show provider-attributed links until Park Cinema confirms a data or booking integration. |
| EduMap | No public developer API documentation was identified. The supplied site could not be inspected by the research browser (403). | Link to the relevant education listing or organizer. Do not ingest its catalogue without permission. |
| iTicket | No public API documentation for third-party event discovery or ticketing was identified. Its official material describes ticket sales, venue/seat maps, organizer services, refunds, and an AI assistant, indicating a mature ticketing ecosystem but not public API access. | Request a partnership and a documented feed/API. Until approved, link to the official event page and record Salaam's own source/refresh metadata. |
| Bolt | Bolt's rider support page explicitly says it currently offers no public or private APIs. Separate Bolt Business and Ride Booker materials exist for eligible business use; they are not evidence of a general consumer ride API. | Deep-link to Bolt with the destination when supported. Do not show live fare, driver, ETA, or ride status in Salaam. |
| Wolt | Official developer documentation exists for restaurant/retail merchant and integration-partner workflows. Wolt says partner access requires terms/contract and credentials; it is not an openly available consumer search/menu API. | Link to the restaurant for discovery/order. Explore API access only with merchant authorization and Wolt approval for a defined integration scope. |
| Alinino | No public developer API documentation was identified. | Link to a book/product page. Use only a licensed feed or partnership for catalogue data. |
| Baku Book Center | No public developer API documentation was identified. | Link to venue, event, or catalogue pages; contact the center for an authorized event feed. |
| Libraff | No public developer API documentation was identified. | Link to a relevant page. Use licensed feeds or first-party submissions for book-related listings. |
| Eventeam | No public developer API documentation was identified. Its terms prohibit systematically downloading and storing application information to create a database. | Do not scrape or build a copied event catalogue. Use organizer-submitted data or a written Eventeam partnership/feed. |
| McDonald's Azerbaijan | No public third-party developer documentation was identified for its local site. Its official McDelivery page sends users to Wolt or Bolt Food. | Official provider handoff for ordering; request a formal local partnership before any in-app catalogue or ordering. |
| KFC Azerbaijan | No public third-party developer documentation was identified in this review; the homepage could not be read by the research browser. | Link to the official site/app or authorized delivery provider; no scraping or assumed API. |
| BİR-İKİ Dönər | The official homepage exposes menu, delivery, branches, and an external ordering destination, but no public developer API documentation was identified. | Link to menu/order/branch pages; use partner-supplied location and menu data if Salaam needs to display it directly. |

### Implementation rule

Implement each provider behind a documented adapter only after lawful access and the actual contract are confirmed. Keep these source classes explicit in the data model:

- **Authorized live integration:** API/feed access confirmed, with source, last refresh, and permission scope.
- **Organizer-submitted:** supplied directly to Salaam by an authorized organizer.
- **External handoff:** Salaam stores only the permitted link and any minimal metadata needed for the user's saved plan.
- **Development sample:** synthetic and clearly labelled; never represented as a live local listing.

Do not scrape consumer pages, reverse-engineer private endpoints, replay browser sessions, or infer inventory from visible pages. Do not route payments, tickets, ride requests, or food orders through Salaam until the relevant provider has approved the integration and security model.

## Source notes

- [Bolt: Public API support article](https://bolt.eu/en/support/articles/360017256060/) — explicit statement that Bolt currently offers no public or private APIs.
- [Wolt for Developers: FAQ](https://developer.wolt.com/docs/faq) — partner terms, access, limits, and country-specific considerations.
- [Wolt for Developers: Restaurant integration onboarding](https://developer.wolt.com/docs/getting-started/restaurant) — merchant integration requirements and approval process.
- [iTicket: About](https://iticket.az/en/page/about) — official ticketing and organizer-service description.
- [CineMastercard: Privacy policy](https://web.cinemastercard.az/ru/privacy-policy) — CinemaPlus operator, ticket workflow, payment boundary, and technical API mention.
- [Eventeam: Terms](https://eventeam.az/terms-conditions) — restrictions on systematic downloading and database creation.
