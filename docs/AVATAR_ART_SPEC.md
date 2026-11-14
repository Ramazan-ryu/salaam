# Avatar Product & Art Specification

Status: Draft 0.1 · 2026-11-14 · Related: [UX_UI_SPECIFICATION.md](./UX_UI_SPECIFICATION.md), [ADR-0012](./adr/ADR-0012-avatar-rive-and-avatar-as-data.md), [COST_AND_RESOURCE_ESTIMATE.md](./COST_AND_RESOURCE_ESTIMATE.md)

[CONFIRMED] The avatar-first experience is a central product identity. The avatar is **not** a profile picture.

## 1. Product role

| Role | What the avatar does |
|---|---|
| Identity | Represents the user in profile, friends' lists, invites and share cards |
| Companion | Greets, delivers the top suggestion with its reason, reacts to actions |
| Feedback | Communicates loading (thinking), success (celebrate), empty/error (sorry), night/quiet hours (sleepy) |
| Personal expression | Customisation of body, hair, face, outfit, accessories; later unlockable items and inventory objects |
| Bridge to the future | Same identity can move to a scene (Concept B) or to 3D objects later |

Success signals: ≥80% complete avatar creation; avatar edits after day 1 (engagement); share-card usage; prototype preference (A4).

## 2. Character design direction

- **Style:** flat-to-soft-shaded 2D, rounded geometry, slightly stylised proportions (head ≈ 1/4 of height), expressive eyes and brows, clean outlines optional. Friendly, modern, premium; not childish; not a copy of any existing avatar system.
- **Identity:** its own silhouette language (e.g. distinctive rounded hands and a signature idle "bounce"), and a palette derived from the brand.
- **Local relevance:** outfits and accessories that feel at home in Baku (e.g. seasonal jackets for wind, sunglasses, scarves, headscarf option, football jersey with generic colours — no club/brand IP).
- **Neutrality:** no national, religious or political symbols as default items; inclusive body types and skin tones.
- **Readability:** recognisable at 32 px (static thumbnail) and expressive at 300 px.

## 3. Customisation (MVP v0 slots)

| Slot | MVP options | Technique |
|---|---|---|
| Body type | 3 | Separate rig variants or bone scaling (spike decides) |
| Skin tone | 8 (inclusive palette) | Colour property (data-bound), not separate art |
| Hair style | 8 | Swappable part (front/back layers) |
| Hair colour | 8 | Colour property |
| Eyes | 4 shapes | Swappable part; animated blink |
| Brows | 3 | Swappable; animated |
| Mouth | Driven by expression | Expression states |
| Facial hair | 3 + none | Swappable |
| Top | 8 | Swappable part (arm sleeves follow arm bones) |
| Bottom | 4 | Swappable |
| Shoes | 3 | Swappable |
| Accessories | 8 (glasses ×2, cap, beanie, headscarf, headphones, earrings, bag) | Swappable, slot conflicts defined (e.g. cap vs headscarf) |
| Held/nearby item | 0 in MVP; bike, camera, backpack in Next | Separate attachment points |

Combinatorics are handled by **parts + colour properties**, not pre-rendered combinations.

## 4. Animation states

| State | Trigger | Duration / loop | Notes |
|---|---|---|---|
| `idle` | Default | Loop: breathe, blink (random 3–6 s), small weight shift | Lowest CPU cost |
| `greet` | App open (≤1×/session) | 1.5 s | Wave |
| `pointing` | New suggestion in bubble | 1 s then idle | Points toward bubble |
| `thinking` | Loading suggestions | Loop until done (max 5 s) | |
| `happy` | Positive event (save) | 1 s | |
| `celebrate` | Milestones (first save, first "going") | 2 s | Rare to stay special |
| `sorry` | Empty results / error | 1.2 s | Gentle, not sad-faced drama |
| `sleepy` | Quiet hours / late night | Loop | Slower idle |
| `listening` | Assistant (Next) | Loop | |
| `edit_react` | Avatar editor change | 0.6 s | Quick smile/pose |

Rules: max one non-idle animation at a time; queue length 1 (newest wins); never loop attention-seeking animations; respect reduced motion (§11).

## 5. Interaction model

- **Tap avatar:** next suggestion (with `thinking` → `pointing`) or quick menu (Surprise me · Tonight · Edit avatar).
- **Long-press:** edit avatar.
- **Swipe bubble:** dismiss suggestion (feeds recommendation negative signal).
- **App events → state machine inputs:** `onSave`, `onEmpty`, `onError`, `onSuggestion`, `onQuietHours`, `onEditChange`.
- The avatar never covers interactive controls; hit area limited to the avatar body.

## 6. Avatar configuration schema (renderer-independent)

Stored per user as versioned JSON in `avatar_configs` ([DATABASE_DESIGN.md](./DATABASE_DESIGN.md)). Field specification:

| Field | Type | Example | Rule |
|---|---|---|---|
| `schemaVersion` | integer | 1 | Migrations upgrade old configs |
| `bodyType` | catalog id | `body.b` | Must exist in catalog |
| `skinTone` | palette id | `skin.05` | |
| `hair.style` / `hair.color` | catalog / palette id | `hair.curly_short` / `haircolor.03` | |
| `face.eyes` / `face.brows` / `face.facialHair` | catalog ids | `eyes.round` | `facialHair` may be `none` |
| `outfit.top` / `outfit.bottom` / `outfit.shoes` | catalog ids | `top.windbreaker` | |
| `accessories[]` | list of catalog ids (≤3) | `["acc.glasses_round"]` | Conflict rules from catalog |
| `heldItem` | catalog id or null | null | Next |
| `defaultExpression` | enum | `neutral` | |
| `updatedAt` | timestamp | — | |

Illustrative instance (data, not code):

```json
{
  "schemaVersion": 1,
  "bodyType": "body.b",
  "skinTone": "skin.05",
  "hair": { "style": "hair.curly_short", "color": "haircolor.03" },
  "face": { "eyes": "eyes.round", "brows": "brows.soft", "facialHair": "none" },
  "outfit": { "top": "top.windbreaker", "bottom": "bottom.jeans", "shoes": "shoes.sneakers" },
  "accessories": ["acc.glasses_round"],
  "heldItem": null,
  "defaultExpression": "neutral"
}
```

The **catalog** (items, slots, conflicts, unlock rules, art asset references per renderer) is versioned content managed in admin. Renderers map catalog ids → their own assets (Rive part names today; 3D meshes later).

## 7. Asset pipeline

```mermaid
flowchart LR
  A[Concept sketches] --> B[Vector parts per slot (SVG)]
  B --> C[Rive: master rig, bones, state machine, data binding]
  C --> D[Export .riv (paid Rive plan required for exports)]
  B --> E[Static compositor layers (SVG/PNG per part)]
  D --> F[App bundle / CDN]
  E --> G[Static render service or client compositor]
  H[Catalog entries in admin] --> F & G
```

- **Naming convention:** `slot.variant` ids identical across SVG layers, Rive parts and catalog.
- **Budgets (targets):** master `.riv` ≤300 KB; static part PNGs ≤20 KB each @2x; total avatar assets ≤2 MB in app bundle; remote catalog additions downloadable without app release.
- **Versioning:** `.riv` and static layers tagged with catalog version; app requests compatible version.
- **Licensing:** all art owned by Salaam (work-for-hire/assignment for freelancers); fonts/icons with recorded licences.

## 8. Rive evaluation

| Criterion | Assessment | Source / status |
|---|---|---|
| Web / iOS / Android / React Native runtimes | Open-source runtimes for web, iOS, Android, React, React Native and more | rive.app blog (checked 2026-11-14) |
| Interactivity | State machines + inputs + data binding fit a reactive character | rive.app; secondary comparisons |
| Runtime licence | Runtimes remain open-source under MIT | https://rive.app/blog/rive-s-new-9-mo-plan (checked 2026-11-14) |
| Editor cost | Editor free; **exports for production moved to paid plans** (from 20 Oct); "Cadet" plan reported at $9/month billed annually | Rive blog (official) ; https://toolradar.com/tools/rive/pricing (secondary) |
| Shipped files | Exports keep working; files do not depend on an active subscription | Rive blog (official) |
| Expo | Native module → requires Expo dev build, not Expo Go | [ASSUMPTION — verify in spike] |
| Customisation at scale | Swapping parts and recolouring via data binding | [ASSUMPTION — validate in spike S-AV1] |
| Memory/CPU | Expected low for one character; measure on reference devices | Spike |

**Alternatives considered:** Lottie (great for linear UI animations, weak for state-driven characters; keep for micro-animations); Spine (strong skeletal animation, weaker RN story, editor/runtime licensing to verify); Three.js/R3F (3D, heavy on mobile; Later); custom SVG + Reanimated (full control, high dev cost).

**Spike S-AV1 (P-1, ~3–5 dev-days):** build a 2-slot proof (hair + top swap, 3 skin tones, idle/greet/happy) and measure: fps, memory, file size, swap latency on a mid-range Android, an older iPhone and desktop Chrome; verify Expo dev-build integration; verify static export path. **Exit:** ≥50 fps, swap ≤100 ms, no memory growth over 10 min.

## 9. Future 3D compatibility

- The avatar config (§6) is renderer-independent; a 3D renderer maps the same catalog ids to meshes/materials.
- Environment objects (bike, camera) are catalog items with optional 3D assets; first 3D use would be *objects next to* the 2D avatar on web (Three.js/R3F), not a 3D avatar.
- Keep attachment points (hand, side, back) as abstract anchors in the catalog.

## 10. Production scenarios

| Scenario | Who makes art | Scope | Cost type |
|---|---|---|---|
| **v0 — Solo founder (MVP-0/MVP-1)** | Founder in Rive, deliberately simple geometric style (shapes, flat colours); AI image tools may be used **only for ideation**, not shipped assets, unless licensing is clear | Slots in §3 reduced: 2 body types, 8 skin tones, 6 hair, 4 tops, 3 bottoms, 4 accessories; 6 states | Rive plan + founder time (est. 40–80 h) |
| **v1 — Freelance illustrator + Rive animator (MVP-2)** | Freelancers under work-for-hire contract | Full §3 slots + 10 states + share cards | One-time; quote-based (see cost doc) |
| **v2 — Ongoing items** | Freelance per item pack | Seasonal items, unlockables, inventory objects | Per pack |

Brief for freelancers is derived from §2–§7 plus a style board approved by the founder.

## 11. Accessibility & performance

- Reduced motion: static pose + expression swaps; no looping.
- Screen reader: avatar labelled with state ("Your avatar is pointing to a suggestion").
- Performance targets: ≥50 fps on reference mid-range Android; avatar initialised after first content paint; paused when off-screen/backgrounded; single Rive instance on Home; thumbnails static.
- Battery: idle loop CPU target ≤5% on reference device (measure in spike).

## 12. Low-end device fallback

| Condition | Behaviour |
|---|---|
| Device class "low" (RAM/benchmark heuristic) or user setting "Battery saver" | Static composite avatar with 3 expression frames |
| Reduced motion enabled | Static + expression swaps |
| Rive load failure | Static composite; error logged |
| Notifications, lists, share cards, web previews | Always static renders |

Static renders are composed from the same layer set (§7) either on device or by a small render job (decided in spike).

## 13. Cultural & inclusivity review

Before v1 release: review options with 5–8 target users (az/ru speakers) for appropriateness of outfits, headwear, skin tones, gestures (e.g. some hand gestures have local meanings). Avoid IP-protected likenesses, brands, team kits.

## 14. Open questions

- Q-AV1: Body-type technique (separate rigs vs bone scaling) — spike.
- Q-AV2: Static render on device vs server — spike.
- Q-AV3: Do users want gender-neutral body options by default? — interviews.
