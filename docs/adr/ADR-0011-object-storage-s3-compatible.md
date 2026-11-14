# ADR-0011: Object storage — S3-compatible API

Status: Proposed · 2026-11-14 · Depends on D-02

## Context
Need storage for images, static avatar renders, map tiles (PMTiles), exports and backups, with the freedom to move providers when the hosting jurisdiction is decided.

## Decision
Use only the S3-compatible API through a thin storage interface. Local development: MinIO. Prototype: a provider with a free tier and no egress fees (e.g. Cloudflare R2: 10 GB-month storage, 1M Class A and 10M Class B operations/month free, egress free — official docs, checked 2026-11-14) **for non-personal content**. User-uploaded personal media follows the D-02 decision. Private buckets with signed URLs for anything non-public.

## Alternatives considered
- Provider-specific SDK features — lock-in.
- Local disk — not durable.

## Consequences
+ Swappable providers; cheap at MVP scale.
− Must keep personal and public media in separate buckets to allow different jurisdictions.

## Solo-founder notes
Cost ~$0 at MVP volumes (estimate). Introduce P-2 (MinIO).

## Related
[LEGAL_AND_HOSTING_OPTIONS.md](../LEGAL_AND_HOSTING_OPTIONS.md#2-hosting-options-compared)
