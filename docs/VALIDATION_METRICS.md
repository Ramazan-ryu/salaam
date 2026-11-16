# Validation Metrics (P-0)

Status: Draft 0.2 · 2026-11-16 · Related: [P0_VALIDATION_PLAN.md](./P0_VALIDATION_PLAN.md#8-g0-decision-framework), [CONTENT_VALIDATION_WORKBOOK.md](./CONTENT_VALIDATION_WORKBOOK.md), [USER_INTERVIEW_GUIDE.md](./USER_INTERVIEW_GUIDE.md)

All thresholds are **[RECOMMENDED] hypotheses** set before data exists. They may be adjusted once, before week 3, with the reason recorded, and never after results are seen. Values are not results: no data has been collected yet.

**Threshold meaning:** *Minimum viable* = below this the signal fails; *Target* = healthy signal; *Stretch* = clearly strong. For "max" metrics, lower is better.

**Evidence type:** O = opinion · I = interest · A = attention over time · X = action · B = past behaviour · S = supply/operations.

## 1. Supply and operations

| ID | Metric | How measured | Min | Target | Stretch | Type | Decision it informs |
|---|---|---|---|---|---|---|---|
| VM-01 | Verified events per week in pilot categories (average of last 4 weeks; cinema showtimes excluded) | Workbook rows with `verification_status` starting `verified_` and event date in that week | 30 | 50 | 80 | S | Category scope; G0 outcome 1 vs 2; G3 target |
| VM-02 | Share of items from the top 30 sources | Workbook pivot by `source_id` | 60% | 75% | 85% | S | Whether a small source set scales (content strategy) |
| VM-03 | Share of items with an official/organizer source (not only reposts) | `source_type` ∈ official/organizer | 50% | 70% | 85% | S | Trust model feasibility |
| VM-04 | Median curation minutes per verified item (max) | `curator_minutes` column + weekly time log | ≤8 | ≤5 | ≤3 | S | Workload feasibility; tooling priority |
| VM-05 | Change rate: items whose date/time/place/status changed after first capture | `change_count > 0` ÷ items | Decision trigger only: >15% → re-verification features earlier | | | S | Freshness features in Lean MVP-1 |
| VM-06 | Candidate sources with permitted structured data (ICS/RSS/JSON-LD/feeds) | Source evaluation sheet | 3 | 8 | 15 | S | Connector priorities (P-3) |

## 2. Demand (pilot channel)

| ID | Metric | How measured | Min | Target | Stretch | Type | Decision |
|---|---|---|---|---|---|---|---|
| VM-10 | Subscribers at end of week 8 | Channel counter | 60 | 150 | 300 | I | Validity precondition (sample size) |
| VM-11 | Median post view rate, weeks 6–8 (views ÷ subscribers at posting time) | Per-post views in `pilot_metrics.csv` | 25% | 40% | 60% | A | G0 demand |
| VM-12 | View-rate trend: median weeks 6–8 vs weeks 3–4 | Same | ≥ −20% | ≥ 0% | ≥ +10% | A | Retention proxy |
| VM-13 | "Used it" poll: share answering "went" or "planned" (needs ≥20 responses over weeks 6–8) | Native anonymous poll | 10% | 20% | 35% | X | G0 demand (strongest) |
| VM-14 | Median forwards per 100 subscribers per post, weeks 4–8 | Per-post forwards | 2 | 5 | 10 | X | Word-of-mouth potential |
| VM-15 | Unprompted messages (requests, corrections, suggestions) | Count in workbook | 5 | 15 | 30 | X | Engagement quality |
| VM-16 | Leave rate over the pilot (max) | (Peak − final) ÷ peak subscribers | ≤25% | ≤15% | ≤10% | A | Fatigue/relevance |

## 3. Interviews (past behaviour)

| ID | Metric | How measured | Min | Target | Stretch | Type | Decision |
|---|---|---|---|---|---|---|---|
| VM-20 | Completed qualifying interviews | Interview log | 8 | 12 | 15 | — | Validity precondition |
| VM-21 | Share who missed or nearly missed a wanted event in the last 30 days, **with a specific example** | Coded notes | 40% | 60% | 75% | B | Problem validation |
| VM-22 | Share using ≥3 different sources to find activities | Coded notes | 40% | 60% | 75% | B | Fragmentation hypothesis |
| VM-23 | Share describing a specific recent wrong/outdated information case | Coded notes | 25% | 40% | 60% | B | Trust/freshness value |
| VM-24 | Share who join the pilot after the interview **and** view ≥2 posts the following week | Self-report + channel (where they agree to say) | 30% | 50% | 70% | X | Problem–solution fit signal |

## 4. Organizers and avatar

| ID | Metric | How measured | Min | Target | Stretch | Type | Decision |
|---|---|---|---|---|---|---|---|
| VM-30 | Organizers contacted (personalised) | Outreach log | 12 | 15 | 20 | — | Effort check |
| VM-31 | Organizers who **submitted** ≥1 event via form or message | Outreach log + form | 2 | 4 | 6 | X | Organizer pull; content strategy |
| VM-32 | Organizers agreeing to a non-binding pilot | Outreach log | 3 | 5 | 8 | I | Supply pipeline for P-3 |
| VM-40 | Avatar prototype tests completed | Test log | 6 | 8 | 10 | — | Validity of avatar result |
| VM-41 | T1 success ("find something tonight") per concept | Observation | 80% | 90% | 100% | X | Navigation clarity |
| VM-42 | Median T1 time: A ÷ C (max) | Stopwatch | ≤1.3× | ≤1.1× | ≤1.0× | X | D-06 layout |
| VM-43 | Share preferring A or rating A more "mine" | Closing questions | 40% | 60% | 75% | O | D-06, art priority |
| VM-44 | Share describing the avatar as distracting or in the way in A (max) | Coded comments | ≤50% | ≤30% | ≤15% | O | D-06; avatar role |
| VM-45 | Share who open the avatar change option when offered (T4) | Observation | Informational | | | X | Customisation priority |
| VM-50 | Legal counsel quotes received | Log | 1 | 2 | 3 | — | Legal track readiness |
| VM-51 | Android tester interest list sign-ups | List | 10 | 20 | 40 | I | P-6 readiness |

## 5. G0 report template

```
G0 REPORT — Salaam P-0 — [date]
1. Validity: VM-10 = __ ; poll responses (wk 6–8) = __ ; VM-20 = __  → valid? Y/N
2. Metric table: ID | actual | min | target | stretch | status (fail/min/target/stretch)
3. Interview synthesis summary (link)
4. Avatar test summary: VM-40..45, key quotes (anonymised)
5. Supply: VM-01..06, category breakdown, top sources, structured sources
6. Organizer results: VM-30..32, quotes, concerns
7. Surprises and contradictions
8. Recommended outcome (1–6) + reasoning
9. Decisions required from founder (IDs)
10. Updated assumptions (A1–A8) status
```

## 6. Measurement hygiene

- Record weekly, same weekday, in [`p0/pilot_metrics.csv`](./p0/pilot_metrics.csv).
- Don't count the founder's own views or forwards from the founder's personal circle as evidence (note the share of subscribers who are close contacts).
- Code interview notes against VM-21–VM-24 **after** each interview, using the definitions in [USER_INTERVIEW_GUIDE.md](./USER_INTERVIEW_GUIDE.md#6-coding-guide-for-metrics).
- Keep raw counts; percentages are derived.
