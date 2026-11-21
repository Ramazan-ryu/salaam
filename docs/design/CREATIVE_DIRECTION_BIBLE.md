# Salaam Creative Direction Bible

Status: governing product and visual direction · written 2026-11-21 from the founder's creative brief.

This document turns the founder's long-form creative direction into decisions that can guide implementation. It complements `CREATIVE_DIRECTIVE.md`, `ART_DIRECTION.md`, and `WORLD_RENDERING_SPEC.md`; it does not replace their technical detail.

## 1. The product in one sentence

Salaam helps a person move from “I have free time and do not know what to do” to a trusted, personal plan in the real city around them.

Salaam is not a dashboard, event directory, chatbot, or social feed with an avatar added afterward. It is a connected city-life experience. The digital world gives the product identity; verified local information gives it usefulness; personal choice connects the two.

The measure of success is whether Salaam makes real life feel easier to explore and share. Time spent in the app is not the goal.

## 2. The emotional promise

On opening Salaam, a person should feel that they have arrived somewhere familiar and welcoming. Their world should feel personal, their city should feel close, and a worthwhile possibility should be easy to find. The interface can be beautiful and expressive while remaining calm, legible, and honest.

Every screen should support these qualities:

- **Belonging:** the environment and character can become recognizably the user's own.
- **Curiosity:** relevant possibilities invite exploration without creating pressure or noise.
- **Warmth:** character, language, and motion feel considerate and human in tone.
- **Freedom:** users can explore through the world or use direct, conventional navigation.
- **Trust:** verified facts, recommendations, synthetic examples, and unknown information are visibly distinct.
- **Continuity:** the world can remember explicit choices and plans without inventing a personality or private history.
- **Calm:** each screen has one clear focus and room to breathe.

## 3. One universe, several connected experiences

These are different modes of the same product, not unrelated apps in one menu.

| Experience | User purpose | Visual role | Repository status |
|---|---|---|---|
| **My World** | Return to a personal place and choose where to go next | Spatial, atmospheric, character-led | Web world exists at `/`; models are CC0 placeholders |
| **My City** | Explore the city visually, then find real places accurately | Artistic city is expressive; geographical map is factual and separate | Window scene exists; real map is not started |
| **My Experiences** | Find real events, culture, cinema, and places | Editorial, image-first, practical, source-aware | Discover exists; event page has a new editorial pass |
| **My People** | Invite friends and share real plans | Social, optional, privacy-led | Future capability; no social activity should be fabricated |
| **My Life** | Keep interests, saved ideas, plans, and calendar together | Personal organization that grows from explicit choices | Calendar export exists; saved plans/profile depend on auth |
| **My Companion** | Get useful help finding or planning something | A contextual assistant connected to real discovery data | Current suggestions are rule-based; AI is not implemented |
| **My Studio** | Shape the character and personal environment | A creative workspace, not a settings form | `/studio` supports a first set of body and color choices |

Movement between modes should preserve context where the product supports it: an object may open a real discovery filter, an event may be added to a calendar, and a plan may eventually appear back in the personal world. A visual shortcut must never imply a feature that does not exist.

## 4. The core user journey

1. A person finishes class, work, or another responsibility and has a few free hours.
2. Salaam opens to a familiar world, with the character present and the atmosphere reflecting local time when that information is available.
3. One useful path to discovery is immediately visible; the person can also use normal navigation, search, or filters.
4. Salaam presents only available information. A suggestion is clearly a suggestion; event time, price, location, and availability are never invented.
5. The person compares an experience, checks its source and trust state, then opens directions, registration, or a calendar action.
6. The person leaves the app and experiences the city. Returning to Salaam should be optional and useful, not driven by engagement tricks.

## 5. Two city layers that must stay distinct

**Artistic city:** a stylized, emotionally engaging interpretation of Baku and the Caspian. It can tell a story about place, support exploration, and connect naturally to the user's world. It is artwork, not a navigational map.

**Real map:** an accurate geographical tool for locations, distance, and routes. It must use permitted map data, protect location privacy, and offer an accessible list alternative. A beautiful scene must never be mistaken for factual geography.

## 6. Visual language by surface

### My World

Begin with the environment, not with a panel or grid. Compose a believable personal place with spatial depth, coherent perspective, directional light, and intentional negative space. Place the character and objects in that space so they belong there. Labels and controls should appear only where they help. On small screens, preserve a direct practical route to discovery and keep the immersive scene optional.

### My Experiences

When the user moves from personal space into real activities, shift to a mature editorial language. Let a strong image or illustration establish atmosphere; use typography and factual metadata to make the decision easy. Use different crops and compositions for different kinds of experiences. Keep verification, source, time, place, and stated price visible without turning every fact into a separate decorative card.

The event detail pass uses the existing category-cover system because the current data is synthetic. It is an implemented layout with a temporary illustration system, not commissioned event photography or final Salaam artwork. Replace that art only with licensed photography or original assets that are clearly not presented as documentary evidence.

### My Studio

Treat customization as creative play. The user should see changes on the character, understand what will change, and be able to undo or reset. Prefer a small coherent collection of high-quality choices to a large set of inconsistent assets.

### My People and My Life

Introduce these only when their data, privacy controls, and interaction flows exist. Do not fill empty space with invented friends, attendance, plans, recommendations, or personal history.

## 7. Character and world standards

The avatar is the user's representation, not a mascot sticker. Its anatomy, face, silhouette, clothing, materials, and motion must share one coherent art style and work for adult users. Expressions should be subtle and context-appropriate. The character may react to a chosen object or action; it must not pretend to know the user's feelings.

The scene should use intentional layers for sky, distant city, architecture, furniture, interactive objects, character, foreground, lighting, effects, and accessible interface controls. Each object needs a real destination, a clear label, keyboard/touch behavior, selection feedback, and a conventional navigation path. Decorative objects with no useful action should not be presented as interactive.

The current low-poly assets are licensed placeholders. They establish a working spatial prototype, not final Salaam art. Preserve that distinction in documentation and previews. Original character/environment production remains a separate art task; no generated or commissioned asset should be claimed unless it actually exists and its source/license is recorded.

## 8. Motion, accessibility, and performance

Motion should communicate presence, focus, and state. Prefer slow environmental movement and restrained character reactions. Avoid continuous effects that compete with reading or consume mobile resources. Respect reduced-motion settings and provide static, keyboard-accessible, screen-reader-accessible paths for every world interaction.

The immersive layer is an enhancement, never a gate. Users must be able to discover an event, read details, use the map, and reach the main sections without understanding game mechanics or waiting for an animation.

## 9. Trust and product honesty

- Nothing becomes public without a human decision.
- Keep synthetic data clearly marked and out of production.
- Do not invent event facts, local businesses, ratings, prices, friends, availability, or AI capabilities.
- Distinguish confirmed information from unconfirmed information and from missing information.
- Do not imply that map, social, saved-plan, mobile, or AI features exist until they are implemented and verified.
- Keep exact location on the device; send only the coarse area already supported by the product.

## 10. Practical creative workflow

1. **Audit:** inspect the actual app, screenshots, assets, data, and working journeys. Record what is real, what is placeholder, and what is missing.
2. **Set the direction:** use the connected-world model above. Keep the spatial world for personal identity and the editorial system for real-world discovery.
3. **Prove one screen:** choose a representative journey and make a high-quality responsive screen before multiplying layouts.
4. **Source the art:** use original or licensed material. If only a placeholder exists, label it and document the production brief needed to replace it.
5. **Connect interaction to product behavior:** every control has an intention, destination, data source, loading/empty/error state, and accessible alternative.
6. **Run the real product:** use the existing API and synthetic fixtures; do not replace working backend behavior with static mockups.
7. **Inspect at mobile and desktop sizes:** capture actual running pages, check information hierarchy, clipping, focus, reduced motion, and fallback behavior, then improve the composition.
8. **Report honestly:** separate concept, implemented UI, verified behavior, visual capture, and production readiness. A successful render alone does not make artwork or a feature final.

## 11. Current implementation checkpoint

- `/` is a working 3D personal-world prototype; the art is placeholder quality.
- `/studio` provides early character customization.
- `/discover` is the dark editorial experience for events.
- `/e/[id]` now uses a large category-cover hero, clear event facts, direct actions, and an explicit trust/source area. Mobile and desktop captures are in `design/screenshots/after/28-event-details-*.png`.
- The event illustration is not final licensed photography. The wider product areas My People, accurate map, saved plans, and AI companion remain future work.

The next visual quality step is to replace the placeholder world and category art with a coherent, licensed art package, then review the actual screens again at phone and laptop sizes. Do not attempt to build every future product area before one art direction is proven with real assets.
