# Product Discovery

Status: Draft 0.1 · 2026-11-14 · Related: [PROJECT_VISION.md](./PROJECT_VISION.md), [MARKET_AND_COMPETITOR_ANALYSIS.md](./MARKET_AND_COMPETITOR_ANALYSIS.md), [MVP_SCOPE.md](./MVP_SCOPE.md), [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md)

## 1. Core user problems

| ID | Problem | Evidence status |
|---|---|---|
| UP-1 | "I have free time now/tonight and don't know what's worth doing nearby." | [ASSUMPTION] |
| UP-2 | "Event information is scattered across many Instagram accounts and channels." | [ASSUMPTION] — Phase 0 research found that many announcements appear in Instagram posts/Stories; not quantified |
| UP-3 | "I went and it was cancelled / sold out / at a different time." | [ASSUMPTION] |
| UP-4 | "Information isn't in my language." (expats, tourists, Russian- vs Azerbaijani-speaking residents) | [ASSUMPTION] |
| UP-5 | "I want to go with friends but coordinating is annoying." | [ASSUMPTION] |
| UP-6 (supply) | "As a small organizer I can't reach people beyond my followers." | [ASSUMPTION] |

## 2. User segments

All segments are part of the long-term vision ([CONFIRMED] not limited to one demographic). The table evaluates which segment should be the **initial** validation focus.

| Segment | Key needs | Languages | Frequency of need | Validation access | Fit for first pilot |
|---|---|---|---|---|---|
| **University students (18–24)** | Free/cheap, nearby, social, spontaneous | az, ru, en | High (weekly) | High — universities, student clubs, Telegram groups | **High** |
| **Young professionals (24–35)** | Quality evenings & weekends, reliability, booking links | az, ru, en | Medium–high | Medium — coworking, tech/creative communities | **High** |
| Local residents & families | Weekend activities, kids' events, parks | az, ru | Medium | Medium | Medium (needs family content, kid-safety review) |
| Tourists (short stay) | Top things now, English, safety, directions | en, ru, others | Very high but short-lived | Low for retention; good for web SEO | Low for app retention, **good for web pages** |
| Expats / long-stay foreigners | English info, community, culture | en, ru | Medium–high | Medium — expat groups | Medium–high (English completeness) |
| Teenagers (<18) | Social activities | az, ru | High | — | **Excluded pending legal review** (see [LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md#4-age-policy)) |
| Organizers / venues (supply) | Reach, easy submission, attribution | az, ru, en | Weekly | Founder outreach | **Required** — supply side |

### Recommended initial segment — [RECOMMENDED, D-04, owner approval required]

**Young adults aged 18–30 in Baku (students + young professionals), with English completeness for expats and tourists via the web.**

Reasons:
1. Highest frequency of the core job ("what can I do tonight/this weekend").
2. Reachable by a solo founder for interviews and beta recruitment (universities, student clubs, communities).
3. Social behaviour (going with friends) exercises the friend/invite features the architecture must support.
4. Adults only avoids the minors' rules adopted in August 2026, which are still under legal review (QL-01).
5. Tourists benefit from public web event pages without requiring app installation (no retention dependency).

Consequence: content sourcing prioritises nightlife-adjacent culture, concerts, exhibitions, cinema, workshops, cafés, free events; family/kids content is deferred.

## 3. Personas (draft, to be revised after interviews)

**Leyla, 21, student (az/ru).** Two-hour gaps between classes, small budget, Instagram-native. Wants free or cheap things nearby and to know where friends go. Success: finds a free exhibition 10 minutes away and invites a classmate in under a minute.

**Murad, 28, software developer (az/ru/en).** Busy weekdays, plans weekends on Thursday evening. Hates arriving at something cancelled. Success: a Thursday digest with three verified weekend options; one saved with a reminder.

**Anna, 33, expat (en/ru).** Two years in Baku, limited Azerbaijani. Wants trustworthy English information and new experiences. Success: reads an English event page with clear time, venue and ticket link; trusts the "Verified" badge.

**Kamran, 35, gallery manager (organizer).** Posts events on Instagram only. Success: connects the gallery's account once (or fills a 2-minute form) and sees events appear correctly, attributed to the gallery.

**Tourist Daniel, 40 (en).** Three days in Baku, finds a Salaam event page through search or a shared link. Success: decides on a concert tonight without installing anything.

## 4. Jobs to be done

| JTBD | When… | I want to… | So I can… |
|---|---|---|---|
| J1 | I have unexpected free time | see good options near me right now | use the time well without research |
| J2 | It's Thursday/Friday | see a short list of weekend options | plan ahead with confidence |
| J3 | I found something interesting | save it and get reminded | not forget it |
| J4 | I'm going somewhere | invite friends easily | go together |
| J5 | I'm unsure if info is current | see how trustworthy it is | avoid wasted trips |
| J6 | I express myself | personalise my avatar | feel the app is "mine" and show my style to friends |
| J7 (organizer) | I publish an event | have it appear correctly with attribution | reach new people |

## 5. Main user journeys (MVP)

1. **First run:** language → interests (incl. "I have a bike/car/camera") → avatar creation (≤ 90 s, skippable with a default avatar) → optional notifications → home.
2. **Tonight:** home → avatar's suggestion or "Tonight" chip → event detail (trust badge, time, place, map, ticket link) → Save / Invite / Directions.
3. **Weekend planning:** Thursday digest notification → weekend list → save two items → reminders.
4. **Social:** accept invite link → see friend's "going" → mark "going" (visibility: friends).
5. **Organizer:** web portal → submit event or connect owned Instagram account → review status → published.
6. **Curator (founder):** admin queue → review AI-extracted drafts → approve/edit/merge → publish.

## 6. Assumptions and validation plan

| ID | Assumption | Risk if false | Validation (solo-founder friendly) | Pass criterion |
|---|---|---|---|---|
| A1 | ≥100 publishable events/week exist in Baku for the target segment | No product | Manual curation sprint, 4 weeks, spreadsheet + public sources | ≥100/week for 3 of 4 weeks |
| A2 | Most announcements come from ≤300 identifiable sources | Unscalable sourcing | Record source of each curated item | 80% of items from ≤300 sources |
| A3 | Target users feel the pain and would use a dedicated product | No adoption | 12–15 interviews + Telegram/Instagram channel pilot | ≥40% of pilot members engage weekly by week 4 |
| A4 | Avatar-first home increases engagement without hurting task speed | Wasted art budget | Clickable prototype tests (Concept A vs C), 8–10 users | Task "find something tonight" ≤30 s in both; ≥60% prefer A or rate it more "mine" |
| A5 | Some venues will connect accounts or submit events free | Supply ceiling | Pitch 20 venues | ≥5 agree to try |
| A6 | Partners will share feeds | Lower data quality | Outreach (non-blocking) | Any signed pilot is upside |
| A7 | Users grant and keep notification permission | Weak re-engagement | Beta metrics | Opt-in ≥50%, monthly opt-out <10% |
| A8 | Curation workload is sustainable for one person | Founder burnout | Time tracking during A1 sprint | ≤6 h/week for 100 events with tooling (target after P-5) |

## 7. Validation questions for interviews (excerpt)

1. Tell me about the last time you went out for something other than work/study. How did you find it?
2. Where do you look for events? How many accounts/channels do you check?
3. When did information last turn out wrong? What happened?
4. How do you decide with friends where to go?
5. Which language do you prefer for this information?
6. (Show Concept A and C prototypes) Which feels more like yours? Find something for tonight.
7. Would you allow notifications? What would make you turn them off?

## 8. Discovery outputs required before P-2 (foundation)

- Interview synthesis (anonymised) appended to this document.
- Curation sprint results (counts by category/source) → updates [DATA_SOURCES_REGISTER.md](./DATA_SOURCES_REGISTER.md).
- Prototype test results → updates [UX_UI_SPECIFICATION.md](./UX_UI_SPECIFICATION.md) and D-06.
