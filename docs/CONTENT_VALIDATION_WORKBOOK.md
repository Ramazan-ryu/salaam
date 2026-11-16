# Content Validation Workbook (P-0)

Status: Draft 0.2 · 2026-11-16 · Related: [P0_VALIDATION_PLAN.md](./P0_VALIDATION_PLAN.md), [VALIDATION_METRICS.md](./VALIDATION_METRICS.md), [DATA_SOURCES_REGISTER.md](./DATA_SOURCES_REGISTER.md), [CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md)

Spreadsheet-ready templates live in [`p0/`](./p0/) as CSV files with headers only. Import them into any spreadsheet tool. The workbook is the P-0 "catalogue" and also the seed of the future gold set.

| File | Purpose |
|---|---|
| [`p0/content_items.csv`](./p0/content_items.csv) | One row per event/activity captured |
| [`p0/sources.csv`](./p0/sources.csv) | One row per evaluated source |
| [`p0/pilot_metrics.csv`](./p0/pilot_metrics.csv) | One row per pilot post (+ weekly poll) |
| [`p0/interview_log.csv`](./p0/interview_log.csv) | One row per interview (no names) |
| [`p0/outreach_log.csv`](./p0/outreach_log.csv) | One row per organizer contacted |
| [`p0/time_log.csv`](./p0/time_log.csv) | Founder hours by category |

## 1. Rules before collecting anything

1. **Facts, not copies.** Record facts (title, date, time, place, price) in your own words. Don't copy post text or images into the workbook or the pilot. Keep the original URL.
2. **Public ≠ permitted.** Public information is not automatically free to copy or redistribute. Each source gets a `permission_status`. Items from sources marked `terms_prohibit` or `declined` are not published in the pilot.
3. **Never invent.** Unknown time → `time_unknown = yes`; unknown price → leave empty (never "free" unless stated); never guess cancellation.
4. **Minimal personal data.** Don't record names of private individuals appearing in posts. Organizer contact details go only in the outreach log.
5. **Log time.** Fill `curator_minutes` per item (rough is fine). It feeds VM-04.

## 2. Content item schema (`content_items.csv`)

| Column | Type / allowed values | Required | Notes |
|---|---|---|---|
| `item_id` | `C0001`… | Yes | Sequential |
| `captured_at` | ISO date-time (Asia/Baku) | Yes | When first recorded |
| `title` | Text (own words) | Yes | |
| `category` | `music` · `exhibition_culture` · `workshop_talk` · `community_free` · `cinema` · `other` | Yes | Adjust to chosen pilot categories |
| `description_short` | ≤200 chars, own words | No | |
| `source_id` | `S001`… from sources sheet | Yes | |
| `source_type` | `official_site` · `organizer_social` · `organizer_submission` · `ticketing` · `telegram_channel` · `aggregator_repost` · `word_of_mouth` | Yes | VM-03 |
| `original_url` | URL | Yes (if any) | Link to where the fact was found |
| `organizer` | Text | If known | |
| `event_date` | YYYY-MM-DD | Yes | |
| `start_time` | HH:MM | If stated | |
| `time_unknown` | `yes` · `no` | Yes | |
| `end_time` | HH:MM | No | |
| `recurring` | `no` · `weekly` · `series` | No | |
| `venue_name` | Text | Yes | |
| `venue_address` | Text | If stated | |
| `district` | Baku district name | No | Coarse only |
| `price_stated` | `yes` · `no` | Yes | |
| `price_text` | As stated (e.g. "10 AZN", "free") | If stated | |
| `ticket_url` | URL | If stated | |
| `announcement_language` | `az` · `ru` · `en` · `mixed` | Yes | |
| `event_language` | `az` · `ru` · `en` · `mixed` · `none` · `unknown` | No | e.g. music = none |
| `confidence` | `high` · `medium` · `low` | Yes | See §4 |
| `verification_status` | See §5 | Yes | |
| `last_verified_at` | ISO date-time | Yes | Update on each check |
| `expiry_at` | ISO date-time | Yes | End time, or start + default duration (3 h) |
| `lifecycle_status` | `scheduled` · `postponed` · `cancelled` · `ended` | Yes | Only explicit signals change it |
| `availability` | `unknown` · `available` · `sold_out` | No | Only if stated |
| `change_count` | Integer | Yes | Times a key field changed after capture (VM-05) |
| `change_log` | Text | No | e.g. "time 19:00→20:00 on 2026-12-03" |
| `permission_status` | Copied from source row | Yes | |
| `published_in_pilot` | `no` · post id | Yes | |
| `curator_minutes` | Number | Yes | VM-04 |
| `gold_set_candidate` | `yes` · `no` | No | Original text must remain accessible at URL |
| `notes` | Text | No | |

## 3. Source evaluation template (`sources.csv`)

| Column | Allowed values / guidance |
|---|---|
| `source_id` | `S001`… |
| `name` | Human-readable |
| `source_type` | Same list as items |
| `url` | Main URL |
| `owner` | Organizer / institution / third party |
| `categories` | Which pilot categories it covers |
| `languages` | az / ru / en / mixed |
| `access` | `public_page` · `requires_login` · `app_only` · `feed_available` |
| `structured_format` | `none` · `ics` · `rss` · `json_ld` · `api` · `spreadsheet` |
| `permission_status` | `not_asked` · `asked` · `permitted` · `declined` · `terms_permit` · `terms_prohibit` · `unclear` |
| `terms_url` / `terms_checked_at` | Where the terms are and when they were read |
| `update_frequency` | Observed: `daily` · `weekly` · `irregular` · `rare` |
| `reliability` | 1–5 (see below) |
| `fields_available` | Checklist: title, date, time, venue, address, price, ticket link, description |
| `restrictions` | e.g. "no reuse of images", "Stories only", "login needed" |
| `maintenance_minutes_week` | Estimated founder minutes/week to follow |
| `items_contributed` | Running count (formula) |
| `decision` | `keep` · `ask_permission` · `drop` |
| `notes` | |

**Reliability scale:** 5 = official, timely, corrections posted · 4 = official, occasionally late · 3 = mostly accurate reposts · 2 = often incomplete/outdated · 1 = unreliable.

## 4. Confidence levels

| Level | Definition |
|---|---|
| `high` | Official/organizer source states date, time and place explicitly, checked within 48 h |
| `medium` | Official source but one field missing or checked >48 h ago; or two independent non-official sources agree |
| `low` | Single non-official source, or ambiguous wording ("this Friday" without a date) |

Low-confidence items are **not** published in the pilot unless verified.

## 5. Verification statuses (P-0) and product mapping

| P-0 status | Meaning | Product equivalent ([GLOSSARY.md](./GLOSSARY.md#status-model-two-independent-axes--availability)) |
|---|---|---|
| `unverified` | Captured, not checked | `pending_review` |
| `needs_check` | Conflict or ambiguity found | `pending_review` (+ conflict) |
| `verified_official` | Confirmed on organizer's/institution's own channel | `T1_official` + `staff_verified` |
| `verified_organizer` | Organizer submitted or confirmed directly | `T3_organizer_submitted` + `staff_verified` |
| `verified_cross_source` | Two independent sources agree, no official source | `T4/T5` + `staff_verified` (lower trust) |
| `rejected` | Not publishable (permission, quality) | `rejected` |

Lifecycle (`cancelled`, `ended`) is tracked separately, as in the product.

## 6. Weekly routine

1. Monday: check `keep` sources for new items (time-box per category).
2. Thursday morning: re-verify items for the weekend (update `last_verified_at`, `change_count`).
3. Thursday: publish the pilot post from `high`/`medium` verified items only.
4. Sunday: fill `pilot_metrics.csv` and `time_log.csv`; mark ended items.

## 7. Analysis formulas (for G0)

- VM-01: count of items with `verification_status` starting `verified_`, grouped by ISO week of `event_date`, excluding `category = cinema`.
- VM-02: sum of the top 30 `items_contributed` ÷ total items.
- VM-03: items with `source_type` ∈ {`official_site`, `organizer_social`, `organizer_submission`} ÷ total.
- VM-04: median of `curator_minutes` for verified items.
- VM-05: items with `change_count > 0` ÷ items with `event_date` in the past.
- VM-06: sources with `structured_format ≠ none` and `permission_status` ∈ {`permitted`, `terms_permit`}.
