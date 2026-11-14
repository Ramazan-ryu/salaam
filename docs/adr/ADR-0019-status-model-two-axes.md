# ADR-0019: Content status model (trust, verification, lifecycle, availability)

Status: Proposed · 2026-11-14

## Context
The original brief listed statuses that mix "how much we trust this" with "what state the event is in". Mixing them causes impossible combinations (e.g. "AI extracted" and "cancelled" at once) and unclear UI.

## Decision
Store four independent fields on events/occurrences/places: `trust_tier` (T1–T5), `verification_status` (pending_review, auto_approved, staff_verified, rejected), `lifecycle_status` (scheduled, postponed, cancelled, ended), `availability` (unknown, available, sold_out, unavailable). Field-level verification lives in `field_provenance`. Public visibility rule: only auto_approved/staff_verified and not ended. Mapping to the original status list is in [GLOSSARY.md](../GLOSSARY.md#status-model-two-independent-axes--availability).

## Alternatives considered
- Single status enum — simpler; ambiguous and lossy.

## Consequences
+ Clear UI badges; correct filtering; auditability.
− Slightly more complex queries (indexed).

## Related
[DATABASE_DESIGN.md](../DATABASE_DESIGN.md#52-events-and-occurrences)
