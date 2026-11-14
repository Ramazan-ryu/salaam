# ADR-0003: Mobile — Expo / React Native with dev builds

Status: Proposed (gated by spikes S-AV1 and S-MAP) · 2026-11-14

## Context
Android and iOS are required; the founder works in TypeScript; the avatar (Rive) and maps (MapLibre) need native modules.

## Decision
Use Expo (React Native) with **development builds** (not Expo Go). Build locally or with EAS; distribute via Play closed testing and TestFlight. Use Expo Router for navigation and deep links.

## Alternatives considered
- **Flutter** — strong Rive support and performance; no code sharing with TypeScript web/backend.
- **Native Swift + Kotlin** — best platform fit; double the work.
- **PWA/Capacitor** — fastest; weaker native feel and avatar performance risk; iOS push limitations.

## Consequences
+ One codebase; shared packages with web/backend; OTA updates possible later.
− Native module compatibility must be checked at each SDK upgrade; iOS builds need macOS or cloud builds.

## Solo-founder notes
Cost: framework $0; EAS Free plan has limited low-priority builds, Starter $19/month, local builds free (Expo docs, checked 2026-11-14). Introduce: spikes P-1, app P-4. Postpone: EAS Update, tablet layouts.

## Related
[ARCHITECTURE_REVIEW.md](../ARCHITECTURE_REVIEW.md#22-react-native--expo-mobile), [ADR-0012](./ADR-0012-avatar-rive-and-avatar-as-data.md), [ADR-0013](./ADR-0013-maps-maplibre-osm.md)
