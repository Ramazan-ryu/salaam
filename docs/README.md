# Salaam — Documentation Package

| | |
|---|---|
| **Phase** | Phase 1.1 — Documentation corrections & P-0 validation preparation |
| **Package version** | 0.2 |
| **Date** | 2026-11-16 |
| **Status** | Working baseline (0.1 accepted with corrections); 0.2 changes await founder review. **No implementation is authorized.** |
| **Author** | Prepared with Claude (AI-assisted) for the founder |

> Documentation and validation preparation only. No application code, dependencies, frameworks, migrations, infrastructure, accounts or external contacts have been created.

## How to read this package

1. [DOCUMENTATION_REVIEW.md](./DOCUMENTATION_REVIEW.md) — what changed in 0.2, consistency check, approvals needed
2. [P0_VALIDATION_PLAN.md](./P0_VALIDATION_PLAN.md) → [WEEKLY_FOUNDER_PLAN.md](./WEEKLY_FOUNDER_PLAN.md) → [VALIDATION_METRICS.md](./VALIDATION_METRICS.md)
3. [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) — every decision with its status
4. [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) — recalculated for 10–15 h/week
5. Then the product, architecture and cost documents below

## Statement labels

| Label | Meaning |
|---|---|
| **[CONFIRMED]** | Confirmed by the founder (Phase 1 brief 2026-11-14 or Phase 1.1 brief 2026-11-16) |
| **[RECOMMENDED]** | Our recommendation; not final until approved |
| **[PROPOSED]** | New in 0.2; awaiting approval |
| **[ASSUMPTION]** | Believed true but not validated; has a validation method |
| **[OPEN]** | Unresolved question |
| **Blocked — legal / Blocked — spike** | Cannot be decided before counsel's answer / a technical spike |
| **[EXTERNAL]** | Depends on a third party |
| **Official / Secondary / Estimate / Quote needed** | Price and fact provenance ([COST_AND_RESOURCE_ESTIMATE.md](./COST_AND_RESOURCE_ESTIMATE.md#0-rules-for-this-document)) |
| **[UNVERIFIED]** | External claim we could not confirm |

Legal content is **not legal advice** ([LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md)).

## Identifier conventions

| Prefix | Meaning | Defined in |
|---|---|---|
| `F-nnn` | Feature | [FEATURE_CATALOG.md](./FEATURE_CATALOG.md) |
| `FR-nnn` / `NFR-nnn` | Requirement | [PRODUCT_REQUIREMENTS_DOCUMENT.md](./PRODUCT_REQUIREMENTS_DOCUMENT.md) |
| `S1–S4` | Platform stage | [PRODUCT_REQUIREMENTS_DOCUMENT.md](./PRODUCT_REQUIREMENTS_DOCUMENT.md#21-platform-stages-which-requirements-apply-where) |
| `D-nn` | Product decision | [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) |
| `ADR-nnnn` | Architecture decision | [adr/README.md](./adr/README.md) |
| `R-nn` / `Q-nn` / `QL-nn` / `AS-n` | Risk / open question / legal question / assumption | [RISKS_AND_OPEN_QUESTIONS.md](./RISKS_AND_OPEN_QUESTIONS.md), [LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md) |
| `DS-nnn` | Data source | [DATA_SOURCES_REGISTER.md](./DATA_SOURCES_REGISTER.md) |
| `VM-nn` | Validation metric | [VALIDATION_METRICS.md](./VALIDATION_METRICS.md) |
| `P-n` / `G-n` | Roadmap phase / gate | [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) |

## Document index and status

| # | Document | Purpose | Version |
|---|---|---|---|
| 1 | [PROJECT_VISION.md](./PROJECT_VISION.md) | Vision, problem, principles | 0.1 |
| 2 | [PRODUCT_DISCOVERY.md](./PRODUCT_DISCOVERY.md) | Segments, personas, JTBD, assumptions | **0.2** |
| 3 | [PRODUCT_REQUIREMENTS_DOCUMENT.md](./PRODUCT_REQUIREMENTS_DOCUMENT.md) | Requirements + platform stages | **0.2** |
| 4 | [MARKET_AND_COMPETITOR_ANALYSIS.md](./MARKET_AND_COMPETITOR_ANALYSIS.md) | Local market, alternatives | 0.1 |
| 5 | [FEATURE_CATALOG.md](./FEATURE_CATALOG.md) | Features, priority, phases | **0.2** |
| 6 | [MVP_SCOPE.md](./MVP_SCOPE.md) | Increments, Lean MVP-1, acceptance by stage, metrics | **0.2** |
| 7 | [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) | Decision log with statuses | **0.2** |
| 8 | [PARTNERSHIP_STRATEGY.md](./PARTNERSHIP_STRATEGY.md) | Outreach plan and targets | 0.1 |
| 9 | [INTEGRATION_RESEARCH.md](./INTEGRATION_RESEARCH.md) | Provider feasibility with sources | 0.1 |
| 10 | [DATA_SOURCES_REGISTER.md](./DATA_SOURCES_REGISTER.md) | Per-source legal/technical record | **0.2** |
| 11 | [CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md) | Human verification, automation ladder, workload | **0.2** |
| 12 | [AI_CITY_INTELLIGENCE.md](./AI_CITY_INTELLIGENCE.md) | Source-independent pipeline | **0.2** |
| 13 | [UX_UI_SPECIFICATION.md](./UX_UI_SPECIFICATION.md) | Navigation, avatar-first home, screens | 0.1 |
| 14 | [AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md) | Avatar product and art spec | 0.1 |
| 15 | [NOTIFICATION_ARCHITECTURE.md](./NOTIFICATION_ARCHITECTURE.md) | Push / in-app notifications | 0.1 |
| 16 | [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) | C4, modules, deployment | 0.1 |
| 17 | [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) | ERD, entities, retention | **0.2** |
| 18 | [API_SPECIFICATION.md](./API_SPECIFICATION.md) | API contracts | **0.2** |
| 19 | [SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md) | Threats, auth options, location privacy | **0.2** |
| 20 | [LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md) | Hosting options, questions for counsel | **0.2** |
| 21 | [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md) | Technology review | **0.2** |
| 22 | [COST_AND_RESOURCE_ESTIMATE.md](./COST_AND_RESOURCE_ESTIMATE.md) | Costs by category, scenarios | **0.2** |
| 23 | [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) | Roadmap at 10–15 h/week | **0.2** |
| 24 | [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) | Test levels, AI evals | 0.1 |
| 25 | [RISKS_AND_OPEN_QUESTIONS.md](./RISKS_AND_OPEN_QUESTIONS.md) | Risks, questions, assumptions | **0.2** |
| 26 | [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) | Standards, Claude Code workflow | 0.1 |
| 27 | [GLOSSARY.md](./GLOSSARY.md) | Vocabulary | 0.1 |
| 28 | [DOCUMENTATION_REVIEW.md](./DOCUMENTATION_REVIEW.md) | Review & approvals | **0.2** |
| 29 | [P0_VALIDATION_PLAN.md](./P0_VALIDATION_PLAN.md) | **New:** P-0 strategy, pilot, avatar test, G0 framework | 0.2 |
| 30 | [VALIDATION_METRICS.md](./VALIDATION_METRICS.md) | **New:** thresholds, measurement, G0 report template | 0.2 |
| 31 | [WEEKLY_FOUNDER_PLAN.md](./WEEKLY_FOUNDER_PLAN.md) | **New:** week-by-week P-0, build rhythm, time log | 0.2 |
| 32 | [USER_INTERVIEW_GUIDE.md](./USER_INTERVIEW_GUIDE.md) | **New:** user & organizer guides, templates | 0.2 |
| 33 | [ORGANIZER_OUTREACH.md](./ORGANIZER_OUTREACH.md) | **New:** az/ru/en messages, pilot explanation | 0.2 |
| 34 | [CONTENT_VALIDATION_WORKBOOK.md](./CONTENT_VALIDATION_WORKBOOK.md) | **New:** content & source schemas | 0.2 |
| 35 | [FEATURE_TRACEABILITY_MATRIX.md](./FEATURE_TRACEABILITY_MATRIX.md) | **New:** design → working-feature pipeline, per-feature status | 0.3 |
| 36 | [DOCKER_ARCHITECTURE.md](./DOCKER_ARCHITECTURE.md) | **New:** compose profiles, images, health, backups | 0.3 |
| 37 | [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) | **New:** one-command start guide, Windows/macOS/Linux | 0.3 |
| 38 | [design/CREATIVE_DIRECTION_BIBLE.md](./design/CREATIVE_DIRECTION_BIBLE.md) | Product and visual principles, connected-world experience, implementation quality bar | 1.0 |
| 39 | [design/LOCAL_PRODUCT_REFERENCES.md](./design/LOCAL_PRODUCT_REFERENCES.md) | Founder-supplied Baku product references, design principles, API and partnership feasibility notes | 1.0 |
| — | [`p0/`](./p0/) | **New:** CSV templates (items, sources, pilot metrics, interviews, outreach, time log) | 0.2 |
| — | [adr/README.md](./adr/README.md) | ADR index (21 ADRs; ADR-0010 reopened) | Proposed |

Related visual: design canvas **"Salaam — First Look: Home Concepts A & C"** (https://claude.ai/artifact/U3AeDKbdom2jQL59zARQom), with first mockups of the two home layouts for P-0 testing.

## Document status lifecycle

`Draft` → `In review` → `Approved` → `Superseded`. ADRs: `Proposed` → `Accepted` / `Rejected` → `Superseded by ADR-nnnn`.

## Approval record

| Date | Document(s) | Decision | By |
|---|---|---|---|
| 2026-11-16 | Phase 1 package 0.1 | Accepted as working baseline, subject to corrections | Founder |
| — | Package 0.2 | Awaiting review | Founder |

## Change process

Any change that alters scope, architecture or cost must update the affected documents, add or supersede an ADR if architectural, add a row to [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) if it is a product decision, and be recorded in the approval record.
