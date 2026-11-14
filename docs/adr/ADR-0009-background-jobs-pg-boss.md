# ADR-0009: Background jobs — pg-boss (no Redis initially)

Status: Proposed · 2026-11-14

## Context
Scheduled collection, extraction, re-verification, notifications, purges and digests need a reliable queue with retries, scheduling and visibility. Local development should stay light.

## Decision
Use pg-boss (PostgreSQL-backed jobs and cron schedules) behind a small internal job interface. Domain events use a transactional outbox table processed by the worker.

## Alternatives considered
- **BullMQ + Redis** — mature, high throughput; adds Redis to run, secure and back up.
- **Cron + scripts** — no retries/observability.
- **Cloud queues** — vendor lock-in, conflicts with portability.

## Consequences
+ One fewer service; jobs are transactional with business data.
− Throughput ceiling far above MVP needs; swap possible behind the interface.

## Solo-founder notes
Cost $0. Introduce P-3. Postpone Redis until caching/rate-limit needs justify it.

## Related
[ARCHITECTURE_REVIEW.md](../ARCHITECTURE_REVIEW.md#27-background-jobs-pg-boss)
