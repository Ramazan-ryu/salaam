# UX/UI Specification

Status: Draft 0.1 · 2026-11-14 · Related: [AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md), [PRODUCT_REQUIREMENTS_DOCUMENT.md](./PRODUCT_REQUIREMENTS_DOCUMENT.md), [NOTIFICATION_ARCHITECTURE.md](./NOTIFICATION_ARCHITECTURE.md)

> Wireframes are textual/ASCII by design (specification level). High-fidelity design happens in P-1/P-4 after the prototype test (A4).

## 1. Design principles

1. **Useful in 30 seconds** — practical content visible without scrolling on the home screen.
2. **The avatar is the companion** — it greets, explains, reacts and represents the user; it never blocks a task.
3. **Trust is visible** — badges, source and "last checked" on every item.
4. **Calm, premium, friendly** — generous spacing, warm colour, purposeful motion.
5. **Three languages are first-class** — layouts tolerate +30% text length (Russian), no text in images.
6. **Accessible by default** — WCAG 2.2 AA on web, platform accessibility on mobile, reduced motion honoured.

## 2. Information architecture & navigation

**Mobile bottom tabs (MVP):**

| Tab | Contents |
|---|---|
| **Home** | Avatar-first home (Concept A or C), suggestions, widgets |
| **Discover** | Time lenses, filters, search, list ⇄ map |
| **Saved** | Saved occurrences (upcoming / past), saved places, reminders |
| **Profile** | Avatar, profile, friends, things I have, settings |

Global: notification bell (top-right of Home/Discover), search entry (Discover), share sheet on detail pages.

**Web (Next.js):** public pages (event, place, city "this week", film) without login; logged-in web app mirrors mobile tabs in a top nav; `/organizer` portal; `/admin` console (role-gated).

**Deep link scheme:** `salaam://` + universal/app links on the web domain: `/e/{occurrenceId}`, `/p/{placeId}`, `/u/{username}`, `/invite/{token}`.

## 3. Avatar-first home — alternative layouts

### Concept A — Companion Stage (recommended default, D-06)

```
┌─────────────────────────────────────┐
│ Good evening, Leyla        🔔  ⚙    │
│ Baku · Nasimi (approx) · 14°C ☁     │  ← context row (area, weather if source approved)
│                                     │
│        ╭──────────────────────╮     │
│        │ "Free 2 hours? A     │     │  ← speech bubble = top suggestion + reason
│        │  photo exhibition    │     │
│        │  is 900 m away."     │     │
│        ╰─────────┬────────────╯     │
│              (avatar)  👋           │  ← animated avatar, ~35–40% height
│   [ Now ] [ Tonight ] [ Weekend ]   │  ← time-lens chips
├─────────────────────────────────────┤
│ Tonight in Baku               See all│  ← widget: horizontal cards
│ ┌────┐ ┌────┐ ┌────┐                │
│ └────┘ └────┘ └────┘                │
│ Friends are going             See all│  ← widget (hidden if no friends)
│ Cinema today                  See all│  ← widget
│ Saved — coming up                    │  ← widget
└─────────────────────────────────────┘
```
- Tapping the avatar cycles to the next suggestion (with "thinking" animation) or opens a quick menu: *Surprise me · Tonight · Edit avatar*.
- Speech bubble always offers a primary action ("Show me") and a dismiss.
- **Pros:** avatar has a clear job; content above the fold; modular widgets. **Cons:** less immersive than a scene; requires good suggestion quality.

### Concept B — Avatar in the City (future "city mode")

```
┌─────────────────────────────────────┐
│  [stylised Baku street scene]       │
│   🎬 cinema   ☕ café   🖼 gallery    │  ← tappable buildings = categories
│        (avatar walking) 🚲           │  ← inventory item next to avatar
│  ─────────── bottom sheet ───────── │
│  Tonight · 12 things nearby   ▲     │
└─────────────────────────────────────┘
```
- **Pros:** most distinctive; natural path to 3D objects. **Cons:** expensive art; slower navigation by metaphor; harder accessibility/localization. **Not in MVP.**

### Concept C — Docked Companion (fallback, feature-flagged)

```
┌─────────────────────────────────────┐
│ Tonight in Baku          🔔         │
│ [ Now ][ Tonight ][ Weekend ]       │
│ ┌──────── large card ────────┐      │
│ └────────────────────────────┘      │
│ Friends are going …                 │
│ Cinema today …                ╭───╮ │
│                               │ 🙂│ │  ← docked avatar bubble; reacts; tap = suggestions
└───────────────────────────────╰───╯─┘
```
- **Pros:** fastest; lowest risk. **Cons:** weaker identity.

**Decision method:** prototype test (A4) measures time-to-task and preference; default A unless A is slower by >20% on the core task.

## 4. Screen specifications

Each screen lists purpose, layout, key components, states, accessibility and localization notes.

### 4.1 Onboarding
- **Purpose:** personalise quickly, gain consent properly.
- **Steps:** (1) language (az/ru/en; device locale preselected) → (2) value intro with avatar animation (1 screen, skippable) → (3) age confirmation per D-03 → (4) interests (multi-select chips from taxonomy, min 0) → (5) "Things I have" (bike/car/camera/none) → (6) area (choose district on map or "skip"; precise location permission *not* requested here) → (7) avatar creation (4.3) → (8) notification permission pre-prompt explaining value, then OS prompt.
- **States:** back navigation everywhere; progress indicator; all optional except language and age.
- **A11y:** chips are toggle buttons with state announced.

### 4.2 Login & registration
- Buttons: Continue with Apple · Continue with Google · Continue with email (6-digit code). Equal prominence (App Store 4.8).
- Legal: links to terms & privacy in the chosen language; consent checkboxes for optional purposes are **not** pre-checked.
- Errors: code expired, too many attempts (rate limited), provider cancelled.

### 4.3 Avatar creation
- Split view: avatar preview (top 55%), slot tabs (Body · Skin · Hair · Face · Outfit · Extras), option grid below.
- "Randomise" and "Done"; default avatar if skipped; edits later from Profile.
- Preview plays a short reaction on each change (e.g. smile on new hair).
- **Performance:** option thumbnails are static images; only the preview runs Rive.
- **A11y:** every option has a text label ("Curly hair, dark brown"); colour options include names, not colour alone.

### 4.4 Avatar-first home — see §3. Widget rules in §5.

### 4.5 Discover
- Header: search field; time lenses; filter button (category, price, distance, language); list/map toggle.
- Results: cards with image or category illustration, title, time, place, distance (if area known), trust badge, friends-going avatars.
- **Empty state:** avatar "sorry" + suggestions to widen filters.
- **Loading:** skeleton cards; avatar not animated here.

### 4.6 Event detail
- Hero image (source-permitted) or illustration; title; trust badge with tap-to-explain ("Verified by Salaam on 12 Nov from the organizer's account").
- Occurrence selector (if multiple); date/time (with "time unconfirmed" when applicable); place row → map; price (only if stated) ; organizer row (follow); description (with "translated from Russian" label if machine translated); ticket/external button; Save · Going/Interested (visibility picker) · Invite · Directions.
- Source attribution block: source name, link to original post/page, last verified.
- Cancelled: red banner, actions disabled except share/remove.

### 4.7 Map
- MapLibre map; clustered pins coloured by category; bottom sheet list synchronized with viewport; "search this area".
- User location dot only if permission granted and only on device (never sent precisely; see [SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md#5-location-privacy)).
- OSM attribution visible.

### 4.8 Social — Friends & activity (no feed)
- Friends list, requests, "add by username / invite link / QR".
- "Friends' plans": upcoming occurrences friends marked going (respecting visibility). Not a posting feed.
- Block/report from friend profile.

### 4.9 User profile
- Avatar (animated, large), name, username, interests, upcoming "going" (per visibility), followed places.
- Own profile: edit avatar, edit profile, audience per field (only me / friends / public).

### 4.10 Digital inventory — "Things I have"
- MVP: simple toggles (bike, car, camera, backpack, sports gear) with explanation "used only to suggest relevant places; never shared".
- Next: items appear on the avatar (bike beside avatar).

### 4.11 AI assistant (post-MVP placeholder)
- Entry from avatar quick menu: "Plan my evening". Conversational sheet with suggestion cards that carry trust badges; clear "I couldn't find verified options" state. Not built in MVP (D-16).

### 4.12 Notifications
- Inbox grouped by Today / Earlier; types with icons; tap → deep link; swipe to dismiss; link to notification settings.

### 4.13 Settings & privacy
- Language; notifications (categories, quiet hours, daily budget, digests); privacy (profile field audiences, going default visibility, who can send friend requests); location (approximate area, "use precise location for nearby results on this device"); consents (view/withdraw each); account (sign-in methods, export data [Next], delete account).
- Each privacy control shows the current visibility in plain language.

### 4.14 Admin console
- Web, role-gated. Sections: Review queue (task list + review screen per [CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md#3-review-queue)), Content (events, occurrences, places, organizers, films), Sources (DS records, connectors, schedules, automation levels), Jobs (runs, failures, retry), Quality (accuracy, workload, freshness), Moderation (reports, users), Notifications (delivery stats), Audit log.
- Keyboard-first; dense tables; English UI acceptable for admin in MVP [RECOMMENDED], content editing supports all three languages side by side.

### 4.15 Organizer portal
- Sign in (same identity system, organizer role); claim/create organizer profile; submit event (multilingual tabs, occurrences, place search, price, ticket link, image upload with rights checkbox); submissions list with statuses; connect Instagram (when available) with clear consent text.

### 4.16 Public web pages
- Event page, place page, "This week in Baku" page, film page. Server-rendered, Open Graph image (event image or generated card with avatar of sharer if invite), schema.org `Event` markup, language alternates (hreflang), "Open in app".

## 5. Home widget architecture

- Home is a list of **widget descriptors** returned by the API (`GET /v1/home`): `{type, id, title, params, items?}`. Clients render known widget types and ignore unknown ones (forward compatible).
- Widget types (MVP): `avatar_stage`, `time_lens_chips`, `occurrence_carousel`, `friends_going`, `cinema_today`, `saved_upcoming`, `onboarding_tip`.
- Order and visibility controlled server-side by rules + feature flags; user can hide widgets (Next: reorder).
- New features ship as new widget types without redesigning the home screen.

## 6. Design system (initial)

| Token group | Initial decisions |
|---|---|
| Colour | Warm primary (to be defined with art direction), neutral greys, semantic: success/warning/danger/info; trust badge colours distinct and colour-blind safe; dark & light themes from day one |
| Typography | One family with full Azerbaijani Latin (ə, ğ, ı, ö, ü, ç, ş) and Cyrillic coverage; scale 12/14/16/20/24/32 |
| Spacing | 4-pt grid; 16-pt screen padding |
| Radius | 8 (controls) / 16 (cards) / 24 (sheets) |
| Motion | 150–250 ms UI transitions; avatar animations follow [AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md#4-animation-states) |
| Iconography | Single open-licensed icon set (licence recorded) |

Core components: Button, Chip, Card (event/place/film), TrustBadge, AvatarView (animated/static), BottomSheet, Map, ListItem, Toast, EmptyState, Skeleton, VisibilityPicker, LanguageTabs (admin/organizer).

Tokens live in a shared package consumed by mobile and web ([SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md#5-repository--module-structure-planned)).

## 7. Accessibility

- Contrast ≥4.5:1 text; touch targets ≥44×44 pt; screen-reader labels on all controls; avatar has an accessible description ("Your avatar is waving") and is decorative when appropriate.
- Reduced motion → static avatar with expression swaps only.
- Never convey trust or category by colour alone.

## 8. Localization

- ICU message format; plural rules for az, ru, en; date/time via locale formatter, timezone Asia/Baku.
- Language switch without restart. Content shows a "Translated" label when machine-translated.
- Azerbaijani-specific: sorting/collation for ə, ı; uppercase/lowercase rules for "i/İ" and "ı/I".

## 9. States catalogue

| State | Pattern |
|---|---|
| Loading | Skeletons; avatar "thinking" only on Home |
| Empty | Avatar "sorry" + concrete next action |
| Error (network) | Inline retry; cached content shown with "offline" label |
| Error (server) | Friendly message + retry; error ID for support |
| Permission denied | Explain value; link to settings; product still works |
| Content cancelled/ended | Banner; actions limited |
