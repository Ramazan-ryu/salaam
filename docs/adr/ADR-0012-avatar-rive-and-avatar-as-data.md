# ADR-0012: Avatar — Rive renderer, avatar-as-data

Status: Proposed · 2026-11-14 · Gate: spike S-AV1 · Decision D-08

## Context
The avatar is the central product identity; it must be customisable, state-driven, performant on web/iOS/Android, and able to evolve toward 3D objects.

## Decision
1. **Avatar-as-data:** store a versioned, renderer-independent avatar config referencing catalog ids ([AVATAR_ART_SPEC.md](../AVATAR_ART_SPEC.md#6-avatar-configuration-schema-renderer-independent)).
2. **Rive** renders the animated avatar (state machine + data binding for parts/colours) on all platforms.
3. A **static render path** (layered SVG/PNG composites) serves lists, notifications, share cards, low-end devices and reduced motion.
4. Lottie may be used for simple UI micro-animations only.

## Alternatives considered
- **Lottie** — mature, timeline playback; weak for interactive characters.
- **Spine** — strong skeletal animation; weaker RN integration; licensing to verify.
- **Custom SVG + Reanimated** — full control; high dev cost.
- **3D (Three.js/R3F)** — Later; heavy on mobile.

## Consequences
+ One asset works across platforms; renderer replaceable later.
− Rive exports require a paid plan (from 20 Oct 2026 per Rive's announcement); runtimes stay MIT. Customisation approach must be proven in the spike.

## Solo-founder notes
Cost ≈ $9/month (reported Cadet price) while producing exports. Introduce: spike P-1; production P-4. Postpone unlockables, inventory items, scene mode.

## Related
[AVATAR_ART_SPEC.md](../AVATAR_ART_SPEC.md#8-rive-evaluation)
