# ADR-0016: Push via Expo Push Service behind a provider interface

Status: Proposed · 2026-11-14

## Context
Push to iOS (APNs, requires paid Apple Developer membership) and Android (FCM). A solo founder benefits from one API.

## Decision
Use the Expo Push Service as relay (reported free) behind a `PushProvider` interface. Payloads contain notification ids and minimal text; details are fetched in-app. Web push (VAPID) optional. In-app inbox is the source of truth.

## Alternatives considered
- **Direct APNs + FCM** — no relay third party; more credential and protocol work.
- **OneSignal/Pushwoosh etc.** — segmentation features; extra vendor, often per-MAU pricing.

## Consequences
+ Simple integration; free.
− Payload metadata passes through Expo (cross-border question QL-04) → minimal payloads; switch to direct providers if counsel requires.

## Solo-founder notes
Cost $0 (+ Apple $99/yr already needed). Introduce P-6.

## Related
[NOTIFICATION_ARCHITECTURE.md](../NOTIFICATION_ARCHITECTURE.md#5-channels)
