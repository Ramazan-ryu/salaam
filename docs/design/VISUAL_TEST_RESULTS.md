# Visual test results — Universe v1 (2026-11-17)

Captured with Playwright + Chrome (SwiftShader WebGL), production build (`next build` standalone) against the local API with sample data.

| Screen | Viewport | File | Result |
|---|---|---|---|
| World, evening | 390×844 @2x | `design/screenshots/after/20-world-mobile-evening.png` | Pass — room fills screen, peek sheet shows title + interests only |
| World, night | 390×844 @2x | `21-world-mobile-night.png` | Pass — lamp-lit night rig (loads in ~9–12 s under software GL) |
| World, day | 1440×900 | `22-world-desktop-day.png` | Pass — side panel, room centred |
| Object → walk → panel (cinema) | 390×844 | `23-world-mobile-cinema-flow.png` | Pass — character walks to sofa, Cinema list filtered |
| Studio | 390×844 / 1440×900 | `24-…`, `25-studio-desktop.png` | Pass — full body visible, save reflected in world |
| Discover (Experiences) | 390×844 / 1440×900 | `26-…`, `27-discover-desktop.png` | Pass — dark editorial, featured hero, covers, Sample tags |

No page errors and no ≥400 responses on any capture. Before: `design/screenshots/before/`.

Fixed during testing: upright curtain rod (stray vertical line), small low room on mobile, overlapping labels, lamp hiding the character, `/studio` 404, studio camera cutting off the head, blue link colour on the wordmark, event row under the nav pill, "Option 1–4" body labels.

Not tested: real GPUs on low-end Android (needs device), iOS Safari, screen readers on the 3D labels.
