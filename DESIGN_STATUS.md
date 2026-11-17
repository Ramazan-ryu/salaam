# Design Status

| Item | Kind | Status | Where |
|---|---|---|---|
| Home "Companion World" (founder direction FD-01/02) | **Implemented** | Full-body companion in the centre; 6 objects with live event counts; moods calm/energetic/curious/mixed steering the suggestion | `apps/web/src/app/(public)/{page,companion-world,avatar-alive}.tsx`; screenshots 01, 02, 06, 10–12 |
| Home Concept A "Companion Stage" | Hi-fi mockup | Superseded by Companion World | Design canvas |
| Home Concept C "Docked Companion" | Hi-fi mockup | Not implemented (A chosen for slice; C kept for P-0 comparison) | Design canvas |
| Discover screen | Implemented interface | Built from Concept A tokens | screenshots 03, 07 |
| Event details | Implemented interface | Trust + source + unconfirmed fields visible | screenshots 04, 05 |
| Staff portal | Implemented interface (utility styling) | Works; not yet in the public design language (TB-16) | screenshot 08 |
| Avatar | v2 SVG rig: semi-stylised adult, clay-style shading, rim light, 3 moods + mixed, reduced-motion | **Not final art** — illustrated/3D-look rig via TB-18; image generation not available in this environment |
| Scene | Baku waterfront by time of day, walkers, glowing windows | Implemented; screenshots 13–15 |
| Brand | Logo symbol (greeting bubble + sun) + `salaam` wordmark in Unbounded | First version; full brand kit in TB-17 | `components.tsx`; spec `docs/AVATAR_ART_SPEC.md` |
| Design tokens | In CSS variables | JSON/Figma-compatible export open (TB-14) | `public.css` |
| Figma | — | No connector in this environment (BL-06) | — |

Shareable preview: **https://claude.ai/artifact/GMnhhEdrQAW9ADZXbxbLYH** — a static snapshot of the real running pages (az/ru/en, home/discover/near me/event pages, sample data). Rebuild: run the app, then `python3 infra/scripts/preview/capture.py && python3 infra/scripts/preview/build.py`, republish. It is a snapshot, not a live deployment.

Screenshots in `design/screenshots/` are real captures of the running app (Chrome via Playwright), not mockups.

## Universe v1 (2026-11-17)
World `/` IMPLEMENTED · Studio `/studio` IMPLEMENTED (colours/bodies) · Experiences Discover IMPLEMENTED · Event page restyle NOT_STARTED · Real map NOT_STARTED (TB-22) · Original character art BLOCKED on FA-05.
