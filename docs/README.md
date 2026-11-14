# Salaam — Documentation Package

| | |
|---|---|
| **Phase** | Phase 1 — Product Documentation & Architecture Finalization |
| **Package version** | 0.1 (first complete draft) |
| **Date** | 2026-11-14 |
| **Status** | Draft — awaiting product-owner review. **No implementation is authorized.** |
| **Author** | Prepared with Claude (AI-assisted) for the product owner |

> This package is documentation only. No application code, dependencies, frameworks, migrations or external services have been created or configured.

## How to read this package

Recommended reading order for the product owner:

1. [DOCUMENTATION_REVIEW.md](./DOCUMENTATION_REVIEW.md) — executive summary, consistency check, approval list
2. [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) — every open decision with a recommended default
3. [PROJECT_VISION.md](./PROJECT_VISION.md) → [PRODUCT_REQUIREMENTS_DOCUMENT.md](./PRODUCT_REQUIREMENTS_DOCUMENT.md) → [MVP_SCOPE.md](./MVP_SCOPE.md)
4. [AI_CITY_INTELLIGENCE.md](./AI_CITY_INTELLIGENCE.md) and [CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md)
5. [UX_UI_SPECIFICATION.md](./UX_UI_SPECIFICATION.md) and [AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md)
6. [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md) → [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)
7. [COST_AND_RESOURCE_ESTIMATE.md](./COST_AND_RESOURCE_ESTIMATE.md) → [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)

## Statement labels (used in every document)

| Label | Meaning |
|---|---|
| **[CONFIRMED]** | Confirmed by the product owner in the Phase 1 brief (2026-11-14). |
| **[RECOMMENDED]** | Our recommendation. Not final until the owner approves it (see [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md)). |
| **[ASSUMPTION]** | Believed true but not validated; has a validation method. |
| **[OPEN]** | Unresolved question; tracked in [RISKS_AND_OPEN_QUESTIONS.md](./RISKS_AND_OPEN_QUESTIONS.md). |
| **[EXTERNAL]** | Depends on a third party (provider, platform, regulator, counsel). |
| **[VERIFIED yyyy-mm-dd]** | External fact checked against a cited source on that date. |
| **[UNVERIFIED]** | External claim we could not confirm; must not be relied on. |

Legal content is **not legal advice**. All legal points are questions for an Azerbaijani legal professional ([LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md)).

## Identifier conventions

| Prefix | Meaning | Defined in |
|---|---|---|
| `F-nnn` | Feature | [FEATURE_CATALOG.md](./FEATURE_CATALOG.md) |
| `FR-nnn` / `NFR-nnn` | Functional / non-functional requirement | [PRODUCT_REQUIREMENTS_DOCUMENT.md](./PRODUCT_REQUIREMENTS_DOCUMENT.md) |
| `D-nn` | Product decision | [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) |
| `ADR-nnnn` | Architecture decision record | [adr/README.md](./adr/README.md) |
| `R-nn` / `Q-nn` / `QL-nn` | Risk / open question / legal question | [RISKS_AND_OPEN_QUESTIONS.md](./RISKS_AND_OPEN_QUESTIONS.md), [LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md) |
| `DS-nnn` | Data source | [DATA_SOURCES_REGISTER.md](./DATA_SOURCES_REGISTER.md) |
| `P-n` | Roadmap phase | [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) |

## Document index and status

| # | Document | Purpose | Status |
|---|---|---|---|
| 1 | [PROJECT_VISION.md](./PROJECT_VISION.md) | Vision, problem, principles | Draft 0.1 |
| 2 | [PRODUCT_DISCOVERY.md](./PRODUCT_DISCOVERY.md) | Segments, personas, JTBD, assumptions, validation plan | Draft 0.1 |
| 3 | [PRODUCT_REQUIREMENTS_DOCUMENT.md](./PRODUCT_REQUIREMENTS_DOCUMENT.md) | Functional & non-functional requirements | Draft 0.1 |
| 4 | [MARKET_AND_COMPETITOR_ANALYSIS.md](./MARKET_AND_COMPETITOR_ANALYSIS.md) | Local market, alternatives, positioning | Draft 0.1 |
| 5 | [FEATURE_CATALOG.md](./FEATURE_CATALOG.md) | All features, priority, dependencies | Draft 0.1 |
| 6 | [MVP_SCOPE.md](./MVP_SCOPE.md) | Prototype / beta scope, acceptance criteria, metrics | Draft 0.1 |
| 7 | [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) | Decision log with recommended defaults | Draft 0.1 |
| 8 | [PARTNERSHIP_STRATEGY.md](./PARTNERSHIP_STRATEGY.md) | Solo-founder outreach plan and target list | Draft 0.1 |
| 9 | [INTEGRATION_RESEARCH.md](./INTEGRATION_RESEARCH.md) | Provider feasibility with sources & dates | Draft 0.1 |
| 10 | [DATA_SOURCES_REGISTER.md](./DATA_SOURCES_REGISTER.md) | Per-source legal/technical record | Draft 0.1 |
| 11 | [CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md) | Human verification workflow & automation ladder | Draft 0.1 |
| 12 | [AI_CITY_INTELLIGENCE.md](./AI_CITY_INTELLIGENCE.md) | Source-independent ingestion & AI pipeline | Draft 0.1 |
| 13 | [UX_UI_SPECIFICATION.md](./UX_UI_SPECIFICATION.md) | Navigation, avatar-first home, screen specs | Draft 0.1 |
| 14 | [AVATAR_ART_SPEC.md](./AVATAR_ART_SPEC.md) | Avatar product, art, rig, schema, pipeline | Draft 0.1 |
| 15 | [NOTIFICATION_ARCHITECTURE.md](./NOTIFICATION_ARCHITECTURE.md) | Push / in-app notifications | Draft 0.1 |
| 16 | [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) | C4 diagrams, modules, deployment | Draft 0.1 |
| 17 | [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) | ERD, entities, indexes, retention | Draft 0.1 |
| 18 | [API_SPECIFICATION.md](./API_SPECIFICATION.md) | API conventions & endpoint contracts | Draft 0.1 |
| 19 | [SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md) | Threat model, controls, privacy by design | Draft 0.1 |
| 20 | [LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md) | Hosting comparison, questions for counsel | Draft 0.1 |
| 21 | [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md) | Challenge of every technology choice | Draft 0.1 |
| 22 | [COST_AND_RESOURCE_ESTIMATE.md](./COST_AND_RESOURCE_ESTIMATE.md) | Scenarios A/B/C, prices with sources | Draft 0.1 |
| 23 | [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) | Solo-founder phased plan with gates | Draft 0.1 |
| 24 | [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) | Test levels, AI evals, device matrix | Draft 0.1 |
| 25 | [RISKS_AND_OPEN_QUESTIONS.md](./RISKS_AND_OPEN_QUESTIONS.md) | Risk register, open questions, dependencies | Draft 0.1 |
| 26 | [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) | Standards, Claude Code workflow, git | Draft 0.1 |
| 27 | [GLOSSARY.md](./GLOSSARY.md) | Shared vocabulary | Draft 0.1 |
| 28 | [DOCUMENTATION_REVIEW.md](./DOCUMENTATION_REVIEW.md) | Final review & approval list | Draft 0.1 |
| — | [adr/README.md](./adr/README.md) | ADR index (20 ADRs) | Proposed |

## Document status lifecycle

`Draft` → `In review` (owner reading) → `Approved` (owner sign-off recorded below) → `Superseded` (replaced; link kept).
ADRs use: `Proposed` → `Accepted` / `Rejected` → `Superseded by ADR-nnnn`.

## Approval record

| Date | Document(s) | Decision | By |
|---|---|---|---|
| — | — | Awaiting first review | Product owner |

## Change process

Any change that alters scope, architecture or cost must: (1) update the affected documents, (2) add or supersede an ADR if architectural, (3) add a row to [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) if it is a product decision, and (4) be recorded in the approval record.
