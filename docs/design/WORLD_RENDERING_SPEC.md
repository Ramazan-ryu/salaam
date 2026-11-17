# World rendering spec

Code: `apps/web/src/world/*`, route `apps/web/src/app/(world)`.

## Stack
React Three Fiber 9 + drei 10 + three 0.187. Client-only (`WorldCanvas`, `StudioCanvas`); the page itself is a server component that fetches events and passes them in.

## Scene schema (`scene.ts`) — renderer-independent
`WorldScene { id, room, objects: SceneObject[], character: { home, scale } }`
`SceneObject { id, asset, position[x,y,z], rotationY, scale?, feature?, approach?[x,z], labelY? }`
`feature ∈ music | exhibition_culture | workshop_talk | cinema | community_free | near` — only objects with a feature are interactive, and each maps to a real Discover filter. The scene could be rendered by another engine (native, Unity) from the same JSON.

## Avatar schema (`avatar.ts`)
`AvatarConfig { version: 1, body, colors: { skin, hair, shirt, pants } }`, stored in `localStorage["salaam.avatar.v1"]` (device only, no server, no personal data). Recolouring targets named materials Skin / Hair / Shirt / Pants in the GLB.

## Camera & light
Orthographic iso camera at (11, 10.5, 11). Zoom = width/9.2 in portrait (lifted 1 unit), else min(width/12, height/10.2). Orbit limited to small rotation, no pan/zoom. Light rigs per time of day `day | evening | night` from Baku time (`?tod=` override for review).

## Interaction
Pointer/keyboard on an object → companion walks to `approach` (Walk), plays PickUp/Victory, panel opens with that category. Labels are DOM (`Html`) so they are focusable and translated.

## Performance budget
GLB total ≈ 3 MB (characters ~0.6 MB each, furniture small), loaded lazily on `/` and `/studio` only; DPR capped at 2; no shadows-map on mobile beyond one directional light.

## Accessibility
Every object has a DOM label button; the event panel is a normal list, usable without WebGL. `prefers-reduced-motion` disables panel transitions.
