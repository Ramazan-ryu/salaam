# ADR-0013: Maps — MapLibre + OSM data, self-hosted tiles first

Status: Proposed · 2026-11-14 · Gate: spike S-MAP · Decision D-14

## Context
Maps are needed on web and mobile. Commercial map SDKs charge per load; MapTiler's free plan is limited to non-commercial use and R&D for commercial products (MapTiler Cloud terms, checked 2026-11-14).

## Decision
Render with MapLibre (web + React Native). Serve vector tiles from a **self-hosted PMTiles extract** of Azerbaijan (OpenStreetMap data) on object storage. Fallback: a commercial tile plan (MapTiler paid plans reported from $25–$30/month). Display OSM attribution. Directions are handed off to the user's maps app.

## Alternatives considered
- **Google Maps SDK** — familiar; usage costs and restrictive terms.
- **Mapbox** — excellent tooling; usage pricing.
- **Leaflet + raster tiles** — simple; less modern look.

## Consequences
+ Near-zero map cost; no per-load fees.
− Periodic tile regeneration; RN MapLibre maturity to verify in spike; ODbL obligations (QL-09).

## Solo-founder notes
Cost ~$0 (estimate). Introduce P-4. Postpone in-app routing.

## Related
[ARCHITECTURE_REVIEW.md](../ARCHITECTURE_REVIEW.md#211-maplibre--osm-data)
