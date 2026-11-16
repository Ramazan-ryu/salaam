# Design Status

| Item | Kind | Status | Where |
|---|---|---|---|
| Home Concept A "Companion Stage" | Hi-fi mockup → **implemented** | Implemented in web (mobile + desktop) | Design canvas; `apps/web/src/app/(public)/page.tsx`; screenshots 01, 02, 06 |
| Home Concept C "Docked Companion" | Hi-fi mockup | Not implemented (A chosen for slice; C kept for P-0 comparison) | Design canvas |
| Discover screen | Implemented interface | Built from Concept A tokens | screenshots 03, 07 |
| Event details | Implemented interface | Trust + source + unconfirmed fields visible | screenshots 04, 05 |
| Staff portal | Implemented interface (utility styling) | Works; not yet in the public design language (TB-16) | screenshot 08 |
| Avatar | Placeholder SVG with idle/blink/wave, reduced-motion | **Not final art** | `components.tsx`; spec `docs/AVATAR_ART_SPEC.md` |
| Design tokens | In CSS variables | JSON/Figma-compatible export open (TB-14) | `public.css` |
| Figma | — | No connector in this environment (BL-06) | — |

Shareable preview: **https://claude.ai/artifact/GMnhhEdrQAW9ADZXbxbLYH** — a static snapshot of the real running pages (az/ru/en, home/discover/near me/event pages, sample data). Rebuild: run the app, then `python3 infra/scripts/preview/capture.py && python3 infra/scripts/preview/build.py`, republish. It is a snapshot, not a live deployment.

Screenshots in `design/screenshots/` are real captures of the running app (Chrome via Playwright), not mockups.
