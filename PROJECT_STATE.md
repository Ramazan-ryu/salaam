# Project State

Updated: 2026-11-17 · by Claude (autonomous execution directive, see CLAUDE.md §Autonomy)

## Current status

**Milestone M-VS1 "first vertical slice" — reached (local), pending container run on a real machine.**

A visitor can open the avatar-first home, switch Now / Tonight / Weekend, find events near them using a coarse
area, open an event page and add it to their calendar — in Azerbaijani, Russian or English. Staff can review
organizer submissions and publish them; nothing becomes public without a person approving it.

## Completed milestones

| ID | Milestone | Evidence |
|---|---|---|
| M0 | Phase 0 analysis, Phase 1 docs + 20 ADRs, Phase 1.1 corrections + P-0 kit | `docs/`, commits b72250a, 40f300f |
| M1-a | Visual first look: home Concepts A & C | Design canvas (link in docs/README.md) |
| S1 | API + staff web: catalog, sources, organizer submissions, review queue, human publish, discovery | commit 1f9a13c, 29 tests |
| M-VS1 | Public web slice (home, discover, nearby, details, ics), Docker env, CI, backups, traceability | this commit, 31 tests, `design/screenshots/01–08` |

## Quality gates (directive §23)

| Gate | Status | Notes |
|---|---|---|
| 1 Research | ✅ | INTEGRATION_RESEARCH, DATA_SOURCES_REGISTER (Phase 1) |
| 2 Design | ⚠️ partial | Concept A implemented; design-system package (tokens JSON, component specs) open — TB-14 |
| 3 Architecture | ⚠️ partial | Modules, DB, security defined; machine-readable OpenAPI missing — TB-05 |
| 4 Engineering foundation | ⚠️ | Native: ✅. Docker config validated + image file sets executed natively; containers not run here (BL-03) |
| 5 Feature quality | ✅ for F-01…F-11 | see docs/FEATURE_TRACEABILITY_MATRIX.md |
| 6 Integration | ⚠️ | No external providers yet; synthetic data isolated (F-11); E2E is scripted screenshots, not assertions — TB-12 |
| 7 Release readiness | ❌ | Real auth (S-AUTH), hosting, legal review of organizer terms outstanding |

## Active work

None in progress at end of session. Next: see NEXT_ACTIONS.md.

## Known risks (top 5; full list in docs/RISKS_AND_OPEN_QUESTIONS.md)

1. **Content supply** — the product is only as good as verified Baku events; P-0 validation was skipped by founder choice.
2. **Auth decision** — staff/organizer access is a dev stand-in; nothing can go to production before S-AUTH.
3. **Docker unverified on a real engine** — config and image contents verified, `docker compose up` not yet run (BL-03).
4. **Solo-founder review load** — D-25 requires a human for every publication; queue tooling must stay fast.
5. **Repository not yet on GitHub** — work exists only as local commits + delivered bundles (BL-01).
