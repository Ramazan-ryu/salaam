# ADR-0014: AI model gateway

Status: Proposed · 2026-11-14 · Decision D-15

## Context
LLMs are used for extraction, classification, translation and (later) the assistant. Cost, safety, provider changes and evaluation must be controlled centrally.

## Decision
All LLM calls go through an internal `model-gateway` module that provides: task-based routing (task → model id from config), structured-output requests with schema validation, prompt versioning (prompts stored in the repository), daily/monthly budget caps, per-call logging (tokens, cost, latency, prompt version — no personal data), retries and one fallback provider, and batch submission for non-urgent work. Default model: Claude Haiku 5.5 (reported $0.10/$0.50 per million input/output tokens for prompts ≤100k, checked 2026-11-14); harder cases may escalate to a larger model by rule. The gateway exposes **no tools/write actions** to models in the pipeline.

## Alternatives considered
- **Direct SDK calls in each module** — quicker start; scattered cost/safety control.
- **Third-party LLM routing services** — features out of the box; another vendor and data processor.
- **Agent frameworks** — unnecessary for deterministic pipelines.

## Consequences
+ Swappable providers; enforceable budgets; reproducible evaluations.
− Small amount of custom code to maintain.

## Solo-founder notes
Cost: code only; usage ≈ $1–7/month at MVP volumes (estimate). Introduce P-5. Postpone embeddings and multi-provider routing.

## Related
[AI_CITY_INTELLIGENCE.md](../AI_CITY_INTELLIGENCE.md#11-cost-control), [COST_AND_RESOURCE_ESTIMATE.md](../COST_AND_RESOURCE_ESTIMATE.md#21-llm-api)
