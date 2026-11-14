# API Specification (specification level)

Status: Draft 0.1 · 2026-11-14 · Related: [ADR-0020](./adr/ADR-0020-api-rest-openapi-contract-first.md), [DATABASE_DESIGN.md](./DATABASE_DESIGN.md), [SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md)

> Contract-first: the OpenAPI document will be written in P-2 from this specification before implementation. No code is generated now.

## 1. Conventions

| Topic | Convention |
|---|---|
| Base | `https://api.<domain>/v1` |
| Format | JSON, UTF-8; `camelCase` fields |
| Versioning | URI major version (`/v1`); additive changes only within a version; deprecation header + 6-month window |
| Localization | `Accept-Language: az|ru|en`; localized fields returned as resolved strings plus `locale` and `translated` flag |
| Time | ISO 8601 with offset; occurrences include `timeUnknown` |
| Pagination | Cursor-based: `?cursor=...&limit=20` → `{items, nextCursor}` (max limit 50) |
| Filtering | Explicit query params (no generic query language) |
| Idempotency | `Idempotency-Key` header on POST that create resources (saves, invites, submissions) |
| Errors | RFC 9457 Problem Details: `{type, title, status, detail, instance, code, errors[]}`; stable `code` values (e.g. `AUTH_CODE_EXPIRED`, `VISIBILITY_FORBIDDEN`) |
| Rate limiting | Per IP and per user; `429` with `Retry-After`; stricter on auth endpoints |
| Caching | Public GETs send `Cache-Control` + `ETag`; personalised responses `private` |
| Trust fields | Every content object includes `trust: {tier, verification, lastVerifiedAt, badge, unconfirmedFields[]}` and `attribution: {sourceName, url}` |

## 2. Authentication & authorization

- Sign-in issues a short-lived access token (≈15 min, JWT or opaque) and a rotating refresh token (stored hashed). Web uses httpOnly secure cookies; mobile uses secure storage.
- Roles: `user`, `organizer` (scoped to organizer ids), `curator`, `moderator`, `admin`.
- Authorization checks at object level in each module (ownership, organizer membership, visibility rules). Admin endpoints under `/v1/admin/*` require role + are audit-logged.

## 3. Endpoints (MVP)

### 3.1 Auth & account

| Method | Path | Purpose | Auth |
|---|---|---|---|
| POST | `/auth/email/start` | Send 6-digit code | Public (rate-limited) |
| POST | `/auth/email/verify` | Verify code → tokens | Public |
| POST | `/auth/oidc/{provider}` | Exchange Google/Apple ID token → tokens | Public |
| POST | `/auth/refresh` | Rotate refresh token | Refresh token |
| POST | `/auth/logout` | Revoke session | User |
| GET | `/me` | Current user, profile summary, roles | User |
| DELETE | `/me` | Request account deletion | User (re-auth) |
| GET/PUT | `/me/consents` | List / update optional consents | User |
| POST | `/me/age-confirmation` | Record age confirmation per policy | User |

### 3.2 Profile & avatar

| Method | Path | Purpose |
|---|---|---|
| GET/PATCH | `/me/profile` | Own profile incl. interests, things I have, home area |
| GET/PATCH | `/me/privacy` | Field audiences, defaults |
| GET | `/users/{username}` | Public/friend-visible profile (filtered by viewer) |
| GET | `/avatar/catalog?version=` | Catalog items available to the user |
| GET/PUT | `/me/avatar` | Avatar config (validated against catalog) |
| GET | `/users/{id}/avatar.png?size=` | Static render (redirect to signed object URL) |

### 3.3 Discovery & content

| Method | Path | Purpose |
|---|---|---|
| GET | `/home` | Widget descriptors for home ([UX_UI_SPECIFICATION.md](./UX_UI_SPECIFICATION.md#5-home-widget-architecture)) |
| GET | `/discover` | Params: `lens=now|tonight|weekend|date`, `date`, `categories`, `price=free|paid`, `near=geohash6`, `radiusKm`, `lang`, `cursor` |
| GET | `/search` | `q`, `type=event|place|film`, locale-aware |
| GET | `/occurrences/{id}` | Detail incl. event, place, trust, attribution, friends going (visible) |
| GET | `/events/{id}` | Event with occurrences |
| GET | `/places/{id}` | Place with upcoming occurrences |
| GET | `/places` | Map viewport query: `bbox`, `categories`, `lens` (returns clusters/pins) |
| GET | `/cinema/showtimes` | `date`, `placeId?`, `filmId?` |
| GET | `/films/{id}` | Film detail with showtimes |
| GET | `/categories` | Taxonomy |
| GET | `/recommendations` | Ranked suggestions with `reasons[]` (used by avatar bubble) |

`near` accepts only a coarse geohash (precision ≤6). Precise coordinates are never accepted by discovery endpoints ([SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md#5-location-privacy)).

### 3.4 Saves, reminders, attendance

| Method | Path | Purpose |
|---|---|---|
| GET | `/me/saves` | List (upcoming/past) |
| PUT/DELETE | `/me/saves/{targetType}/{targetId}` | Save / unsave (idempotent) |
| GET/PUT | `/me/reminders/{occurrenceId}` | Reminder offsets |
| PUT/DELETE | `/occurrences/{id}/attendance` | `{intent, visibility}` |

### 3.5 Social

| Method | Path | Purpose |
|---|---|---|
| GET | `/me/friends` | Accepted friends |
| GET | `/me/friend-requests` | Incoming/outgoing |
| POST | `/friend-requests` | `{username}` or `{inviteToken}` |
| POST | `/friend-requests/{id}/accept` · `/decline` | Respond |
| DELETE | `/me/friends/{userId}` | Unfriend |
| POST/DELETE | `/me/blocks/{userId}` | Block / unblock |
| GET | `/me/friends/plans` | Friends' visible upcoming attendances |
| PUT/DELETE | `/me/follows/{targetType}/{targetId}` | Follow / unfollow |
| POST | `/invites` | Create invite link `{targetType, targetId?}` → `{url, expiresAt}` |
| GET | `/invites/{token}` | Resolve (public, minimal info) |
| POST | `/reports` | Report user/event/place |

### 3.6 Notifications

| Method | Path | Purpose |
|---|---|---|
| POST | `/me/devices` | Register push token |
| DELETE | `/me/devices/{id}` | Unregister |
| GET/PUT | `/me/notification-preferences` | Categories, quiet hours, budget, digests |
| GET | `/me/notifications` | Inbox (cursor) |
| POST | `/me/notifications/{id}/read` | Mark read |

### 3.7 Organizer portal

| Method | Path | Purpose |
|---|---|---|
| POST | `/organizer/claims` | Claim/create organizer profile |
| GET | `/organizer/me` | Organizations the user belongs to |
| POST | `/organizer/{orgId}/submissions` | Submit event (multilingual) |
| GET | `/organizer/{orgId}/submissions` | Status list |
| POST | `/organizer/{orgId}/connections/instagram` | Start OAuth (when approved) |
| DELETE | `/organizer/{orgId}/connections/{id}` | Disconnect (purges raw items per DS rules) |
| POST | `/uploads` | Get signed upload URL (images; type/size limited) |

### 3.8 Admin (role-gated, audit-logged)

| Area | Endpoints (summary) |
|---|---|
| Review | `GET /admin/review-tasks?type&status`, `GET /admin/review-tasks/{id}`, `POST /admin/review-tasks/{id}/decision` |
| Content | CRUD under `/admin/events`, `/admin/occurrences`, `/admin/places`, `/admin/organizers`, `/admin/films`, `/admin/categories` |
| Sources | CRUD `/admin/sources`, `POST /admin/sources/{id}/run`, `PUT /admin/sources/{id}/automation-level` |
| Jobs | `GET /admin/jobs`, `POST /admin/jobs/{id}/retry` |
| Quality | `GET /admin/metrics/quality`, `/workload`, `/freshness`, `/ai-cost` |
| Moderation | `GET /admin/reports`, `POST /admin/reports/{id}/action`, `POST /admin/users/{id}/suspend` |
| Flags | `GET/PUT /admin/feature-flags` |
| Audit | `GET /admin/audit-logs` |

## 4. Representative contract (excerpt, illustrative)

`GET /v1/occurrences/{id}` → `200`

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `startsAt` / `endsAt` | string (ISO) / nullable | |
| `timeUnknown` | boolean | UI shows date only |
| `lifecycle` | enum | `scheduled/postponed/cancelled/ended` |
| `availability` | enum | `unknown/available/sold_out/unavailable` |
| `event` | object | `{id, title, description, locale, translated, categories[], ticketUrl?, price?: {min, max, currency, isFree}}` — `price` omitted if not stated by source |
| `place` | object | `{id, name, address, location: {lat, lng}, kind}` (venue coordinates are public data) |
| `trust` | object | `{tier, verification, lastVerifiedAt, badge, unconfirmedFields[]}` |
| `attribution` | object | `{sourceName, url}` |
| `viewer` | object | `{saved, attendance?, reminder?}` (if authenticated) |
| `friendsGoing` | array | Avatars + names visible to viewer; max 5 + count |

## 5. Webhooks / inbound integrations

- Instagram (Meta) webhooks for connected accounts — optional, after App Review; endpoint verifies signatures.
- Partner feeds pulled by worker (no inbound webhooks in MVP).

## 6. Non-functional

p95 latency ≤400 ms for discover at beta load (NFR-002); payload size ≤150 KB for list endpoints; gzip/brotli; OpenAPI published at `/v1/openapi.json` in non-production environments.
