# Salaam — Art direction (Universe v1)

Status: IMPLEMENTED (web) · 2026-11-17 · Source directives: `CREATIVE_DIRECTIVE.md`, founder "SALAAM UNIVERSE"
brief and "Radical visual transformation" brief (7 reference images, used for mood only — nothing copied).

## 1. Audit — why the previous UI read as "generic AI app"

| Symptom (screens `design/screenshots/before/`) | Cause |
|---|---|
| Pastel card grid, every surface a rounded rectangle | Layout came from a component kit, not from a place or a story |
| Character = flat SVG shapes in a circle | No volume, no anatomy, no light; it decorated the page instead of living in it |
| "Objects" were icons floating around the avatar | No space to put them in, so nothing felt physical |
| Event cards: icon on a coloured tile | No imagery system; categories were indistinguishable at a glance |
| One light mood all day | Time of day only changed a gradient |

## 2. Four directions considered

| | Direction | For | Against | Score /25* |
|---|---|---|---|---|
| A | **Isometric 3D room** (clay/low-poly, orthographic camera); the character lives in the room; furniture = entry points | Strongest "my world" feeling; real volume, light and motion; CC0 assets exist; runs in the browser | Heavier first load (~3 MB GLB); needs WebGL fallback | 22 |
| B | Painterly 2D city panorama with parallax | Beautiful, light | Needs commissioned illustration we can't make here; static character | 15 |
| C | Full 3D night city (map-like) | "Travel" feeling | Confuses with the real map (founder: map is a separate tool); expensive | 14 |
| D | Premium dark editorial only (photo cards) | Practical, fast | No world, no character — loses the product's identity | 16 |

*Identity, founder fit, feasibility now, performance, accessibility (5 each).

**Selected: hybrid A + D.** My World and My Studio use the isometric 3D world (A). My Experiences
(Discover, event pages) switches to a calm dark editorial mode (D): image-first, factual, clear actions. The
founder brief asks for exactly that split ("when the user moves to real events the style becomes practical").
C is deferred to the real map (TB-22, MapLibre), kept as a separate tool.

## 3. Surfaces

| # | Surface | Route | State |
|---|---|---|---|
| 01 | My World — 3D room, time-of-day light (day / evening / night by Baku time), objects → companion walks over → panel with real events | `/` | IMPLEMENTED |
| 02 | My Character — rigged 3D character (Idle, Walk, PickUp, Victory), 4 bodies, recolourable skin/hair/top/trousers | in `/` and `/studio` | IMPLEMENTED (placeholder art, see §6) |
| 03 | My City — artistic city outside the window now; walkable city later | window texture | PARTIAL; real map = TB-22 |
| 04 | My Experiences — dark editorial Discover, featured hero, category cover art, date chips, trust + price | `/discover`, `/e/[id]` | IMPLEMENTED |
| 05 | My Studio — customise the character, saved on this device | `/studio` | IMPLEMENTED (clothes/items/room editing = next) |

The previous home is kept at `/classic` for comparison; it is not in navigation.

## 4. Visual language

- **Light first:** each time of day is a light rig (key, fill, lamp emissive, sky texture), not a colour swap.
- **Palette:** warm wood/clay interior; accent coral `#E8603C`, teal `#0D5F5B`; Experiences dark `#0E1014` with mint `#7FD6C8` for trust.
- **Type:** Unbounded (display) + Inter (text), self-hosted, covers ə ğ ş and Cyrillic.
- **UI over the world only where needed:** greeting, one hint button, bottom sheet / side panel, floating nav pill. Object labels appear on hover/selection or via "Show objects".
- **Event imagery:** licensed photos when we have them; otherwise original per-category covers (`covers.tsx`: stage lights, gallery wall, workshop table, cinema, park), with seeded variation so neighbours differ.

## 5. Honesty rules kept

Sample events stay labelled "Sample/Nümunə"; no invented times or prices; the room shows only destinations that exist.

## 6. Known gaps (honest)

- Characters and furniture are **CC0 low-poly packs** (Quaternius, KayKit — `public/world/LICENSES.md`), not original Salaam art. A Salaam-original character (own anatomy, faces, clothing) needs a 3D artist → FOUNDER_ACTIONS FA-05.
- No facial expressions yet (the pack has none); emotion is carried by animation only.
- WebGL is required for the world; without it the page still shows greeting + event panel.
- First visit downloads ~3 MB of models (cached afterwards).

See also `WORLD_RENDERING_SPEC.md` and `design/ASSET_MANIFEST.json`.

## 7. Path to the reference look (2026-11-17)
Free finish added (AO, bloom, string lights). Final art comes from founder-generated AI images (`AI_ART_PROMPTS.md`) — character sheet, emotions, room reference, window city, event covers — and optionally image→3D (Tripo3D/Meshy) + Mixamo rig to replace the CC0 characters.
