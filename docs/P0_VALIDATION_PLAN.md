# P-0 Product Validation Plan

Status: Draft 0.2 · 2026-11-16 · Owner: founder · Related: [VALIDATION_METRICS.md](./VALIDATION_METRICS.md), [WEEKLY_FOUNDER_PLAN.md](./WEEKLY_FOUNDER_PLAN.md), [USER_INTERVIEW_GUIDE.md](./USER_INTERVIEW_GUIDE.md), [ORGANIZER_OUTREACH.md](./ORGANIZER_OUTREACH.md), [CONTENT_VALIDATION_WORKBOOK.md](./CONTENT_VALIDATION_WORKBOOK.md), [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)

> P-0 does **not** build the application. It uses only free or existing tools, and no code is written for it. The founder performs all external actions (posting, contacting, interviewing). Nothing here has been done yet: no interviews, organizer contacts or pilot results exist.

## 1. Scope, duration, effort

| Item | Plan |
|---|---|
| Duration | **8 weeks** expected (6 optimistic, 10 conservative incl. one 2-week extension) |
| Founder effort | ~90 hours total (≈10–12.5 h/week) — see [WEEKLY_FOUNDER_PLAN.md](./WEEKLY_FOUNDER_PLAN.md) |
| Money | $0 required beyond the existing Claude subscription; optional legal consultation (quote), optional small thank-you for interviewees (founder's choice) |
| Tools | Spreadsheet (CSV templates in [`p0/`](./p0/)), Telegram channel, a free form tool for organizer submissions, a free prototyping tool or slide deck for clickable prototypes (verify plan limits before use) |

### Changes versus the 0.1 P-0 scope (recalibrated for 10–15 h/week)

| 0.1 target | 0.2 target | Reason |
|---|---|---|
| 4-week curation sprint at ≥100 events/week | **6 weeks** of curation at 30→50 events/week in 3–4 categories | ~4–5 min/item manual → 100/week alone would take 7–8 h/week |
| 12–15 interviews | **8 minimum / 12 target** | ~1.5 h each incl. recruiting and notes |
| 20 venue pitches | **12 minimum / 15 target** contacts, measured by actual submissions | Quality of follow-up matters more than volume |
| Gold set ≥150 items | **50 minimum / 80 target** in P-0; grows to 300 by P-5 | Labelling ≈3 min/item; gold set only needed in P-5 |
| Telegram/Instagram pilot | **One channel** (Telegram recommended, confirmed by early interviews) for 6 weeks | Two channels double the effort |
| Legal consultation | **Quotes + written brief** in P-0; answers needed only before G6 | Legal answers take calendar time, not founder time |
| ≥12 Android testers recruited | **Interest list** (target 20) | Testers are needed in P-6, about a year later; commitments now would go stale |

## 2. Validation strategy (A)

### 2.1 What we are validating

| Hypothesis | Assumption IDs ([PRODUCT_DISCOVERY.md](./PRODUCT_DISCOVERY.md#6-assumptions-and-validation-plan)) | Core question |
|---|---|---|
| H1 Demand | A3 | Do people **repeatedly** use curated city information, not just say it is a good idea? |
| H2 Supply | A1, A2 | Can one person find enough reliable, current events from a manageable set of sources? |
| H3 Workload | A8 | Can curation fit into ~3–5 h/week? |
| H4 Trust | (UP-3) | Is "verified and current" a felt problem, and does information actually change? |
| H5 Organizer pull | A5 | Will organizers *act* (submit events), not only express interest? |
| H6 Avatar | A4 | Does an avatar-centred home help or distract when finding events? |
| H7 Channel & language | — | Which channel and languages does the target segment actually use? |

### 2.2 Most dangerous assumptions (ranked)

1. **H1 repeat demand.** If people don't come back weekly, nothing else matters.
2. **H2/H3 supply × workload.** A solo founder can run out of hours before running out of events.
3. **H5 organizer pull.** Organizers are the scalable source of trustworthy data.
4. **H6 avatar value.** It is the identity bet and the most expensive part to build.
5. Legal scope (QL-01, QL-04) is dangerous but is answered by counsel, not by validation.

### 2.3 Cheap tests

| Test | Cost | Tests |
|---|---|---|
| Curated weekly list in one channel | Founder time only | H1, H2, H3, H4, H7 |
| Workbook + time log | Free | H2, H3, H4 |
| 8–12 behavioural interviews incl. 10-minute prototype test | Founder time | H1, H4, H6, H7 |
| Organizer outreach with a submission form | Free | H5 |
| Static clickable prototypes A vs C | Free tool, ~4 h | H6 |

### 2.4 Findings that would change the MVP

| Finding | MVP change (proposed, needs approval) |
|---|---|
| Supply in target categories < 30/week | Narrow categories; consider different segment or city scope |
| Curation > 8 min/item | Prioritise organizer form and ICS/RSS connectors; delay avatar polish |
| Most information appears only in Stories/unofficial reposts | Organizer-first content strategy before building more consumer features |
| Avatar seen as distracting by most participants | Default home to Concept C (avatar docked); avatar-first identity kept, role re-designed (D-06) |
| Target segment disengaged, another segment engaged | Change initial audience (D-04) |
| Information changes often (>15% of items) | Bring re-verification features into Lean MVP-1 |
| Telegram not used by target segment | Switch pilot channel; reconsider Telegram-related sources |

### 2.5 Evidence that is sufficient to proceed

Defined numerically in [VALIDATION_METRICS.md](./VALIDATION_METRICS.md) and applied by the G0 framework (§8). In short: **behavioural** demand signals at or above minimum thresholds, sustainable supply at ≥40 verified events/week, and at least two organizers who actually submitted events.

## 3. Interest versus demand

| Evidence type | Examples | Weight |
|---|---|---|
| **Opinion (weak)** | "Interesting idea", "I'd use it", likes on a launch post | Recorded, **never** a pass criterion |
| **Interest (moderate)** | Joining the channel, signing up for the tester list | Sample-size enabler; not proof of value |
| **Attention over time (strong)** | View rate stable or rising across weeks 3–8 | Demand signal |
| **Action (strongest)** | Poll: "I went to / planned something from the list"; forwards to friends; unprompted requests; organizers submitting events | Primary demand signals |
| **Past behaviour (interviews)** | Specific recent example of missing an event or using many sources | Validates the problem, not the solution |

Interview rule: questions ask about **past behaviour** ("last time…"), not future intentions ("would you…").

## 4. Pilot experiment (G) — minimum meaningful experiment

| Option | Evidence it produces | Effort | Recommendation |
|---|---|---|---|
| Telegram channel with weekly curated lists | Views per post, forwards, polls, DMs over time | Low (1–1.5 h/week from the workbook) | **Run** (if early interviews confirm Telegram use; otherwise use the channel they use) |
| Manually maintained event catalogue (spreadsheet) | Supply, workload, change rate | Already needed for curation | **Run (internal)** |
| Organizer submission form (free form tool) | Organizer action | 1 h setup | **Run** |
| Clickable prototype (A vs C) | Avatar and navigation usability | ~4 h build | **Run, in interviews only** |
| Landing page | Sign-up interest (weak evidence) | 2–4 h + upkeep | **Skip** in P-0 |
| Instagram account | Reach in an Instagram-native audience | Higher (visual design per post) | Fallback only |

### 4.1 Pilot design

- **Name:** working name only, e.g. "Salaam — Baku this week (pilot)"; the description says it is an **experiment by an independent founder**, with no app, partners or sponsors.
- **Cadence:** Thursday "This weekend in Baku" (8–12 items); Monday "This week" (optional, 5–8 items). At most 2 posts/week to respect attention.
- **Languages:** Azerbaijani + Russian in each post; one English line per item where cheap (D-23 proposed).
- **Categories (3–4):** concerts & live music; exhibitions & culture; workshops & talks; free & community events. Confirm with early interviews.
- **Item format:** title (own words), date & time, place, price only if stated, link to the original source, "checked on [date]" marker. **No copied text or images**; facts only, with attribution (QL-07 pending).
- **Polls:** a weekly anonymous native poll: "Did you go to or plan anything from last week's list?" (Yes, went / Yes, planned / No, but interested / No).
- **Recruitment:** founder's network, interviewees, university and community groups **only where the group's admins allow it**. No paid promotion in P-0.
- **Corrections:** any reported error is fixed and logged as a change (VM-05).
- **Privacy:** no personal data collected outside Telegram's own features; polls anonymous; DMs answered and not stored beyond the anonymised counts in the workbook.

### 4.2 Measurement

Post views and forwards are visible on each channel post. Detailed channel statistics may require a minimum subscriber count [UNVERIFIED], so the plan relies only on per-post counters, polls and DMs, recorded weekly in [`p0/pilot_metrics.csv`](./p0/pilot_metrics.csv). Link-click tracking is **not** used in P-0, to avoid adding tools and collecting extra data. Optional later decision.

## 5. Avatar validation (F)

**Goal:** test whether an avatar-centred home helps or distracts **before** any production avatar is built. No Rive work, no animation production.

### 5.1 Prototypes

| Prototype | Content |
|---|---|
| **Concept A — Companion Stage** | Home frame per [UX_UI_SPECIFICATION.md](./UX_UI_SPECIFICATION.md#3-avatar-first-home--alternative-layouts): placeholder avatar (simple flat illustration or silhouette) with a speech-bubble suggestion, time-lens chips, 3 widgets. Linked frames: event list, event detail, avatar quick menu, simple "change outfit" frame |
| **Concept C — Docked Companion** | Same content, feed-first, avatar in a corner bubble opening suggestions |
| Shared | Same 10 real-looking but **fictional** events (clearly marked "sample data"), same detail page |

Optional: a short looping image of the placeholder avatar waving, to hint at motion. It is not a measure of animation quality.

**Starting point (exists, 2026-11-16):** the design canvas "Salaam — First Look: Home Concepts A & C" (https://claude.ai/artifact/U3AeDKbdom2jQL59zARQom) holds both home screens in Azerbaijani with sample data and a placeholder character. The founder adds linked list, detail and "saved" frames, or recreates them in a prototyping tool, for tasks T1–T4.

### 5.2 Test protocol (≈12 minutes, at the end of a user interview)

1. **5-second impression** for each concept (order counterbalanced: odd participants A first, even C first). Ask: "What is this app for? What stood out?"
2. **Task T1:** "Find something to do tonight and open it." Record success, time, wrong taps.
3. **Task T2:** "Save it so you don't forget."
4. **Task T3:** "Find something for this weekend."
5. **Optional T4 (A only):** "If you wanted to change how your character looks, where would you go?"
6. After each concept: Single Ease Question (1–7) for T1.
7. Closing questions: "Did the character help you, get in your way, or make no difference? Why?" "Which version felt more like *yours*?" "Which would you open on a Friday evening?"

### 5.3 What is evaluated

First impression (did they understand it is about city activities?), navigation clarity (wrong taps), discoverability (time to the tonight list), help vs distraction (coded from comments), speed (T1 time), and preference. Thresholds: VM-40–VM-45.

**Limitations:** static frames, placeholder art and a small sample (6–10). Results guide D-06 (layout) and art priorities; they do not prove long-term engagement. The avatar-first direction is **confirmed** and is not decided by this test.

## 6. Content validation (D)

Run in the workbook: [CONTENT_VALIDATION_WORKBOOK.md](./CONTENT_VALIDATION_WORKBOOK.md). Outputs: supply counts (VM-01), source concentration (VM-02/03), curation time (VM-04), change rate (VM-05), structured-source availability (VM-06), and gold-set candidates.

## 7. Organizer validation (E)

Run per [ORGANIZER_OUTREACH.md](./ORGANIZER_OUTREACH.md). Success is measured by **submissions**, not replies (VM-31).

## 8. G0 decision framework

G0 is held at the end of week 8 (or after the extension). The founder decides; this framework structures the decision. Metric IDs refer to [VALIDATION_METRICS.md](./VALIDATION_METRICS.md).

**Validity precondition:** the decision can only be "proceed" or "stop" if VM-10 ≥ 60 subscribers, ≥ 20 poll responses in total over weeks 6–8, and VM-20 ≥ 8 interviews. Otherwise the outcome is **Extend validation**.

| Outcome | Criteria (all must hold unless stated) | Next step |
|---|---|---|
| **1. Proceed to P-1** | VM-01 ≥ 40 · VM-04 ≤ 6 min · VM-11 ≥ 25% · VM-12 ≥ −20% · VM-13 ≥ 10% · VM-21 ≥ 40% · VM-31 ≥ 2 · VM-41 ≥ 80% for at least one concept | P-1 with Lean MVP-1 (if D-21 approved) |
| **2. Proceed with a reduced MVP** | Demand thresholds of outcome 1 met, **but** VM-01 is 30–39 **or** VM-04 is 6–8 min **or** VM-31 < 2 | Narrow to 2–3 categories; organizer form and ICS/RSS first; cinema link-out only |
| **3. Extend validation (once, 2–4 weeks)** | Validity precondition not met **or** signals contradict (e.g. strong interviews, weak pilot) | Targeted fixes (more recruitment, different channel), then re-run G0 |
| **4. Change the initial audience** | Target segment below minimum on VM-11/VM-13/VM-21 **while** another observed segment (e.g. expats, families) meets target values | Re-scope D-04; adjust categories/languages; possibly extend 2 weeks |
| **5. Change the content strategy** | Demand thresholds met **but** VM-02 < 60% or VM-03 < 50%, or most items are discoverable only through Stories/reposts | Organizer-first strategy: recruit organizers and form usage before P-3; revise DS register |
| **6. Stop or reconsider** | After an extension: VM-11 < 25% **and** VM-13 < 10% **and** VM-21 < 40%; **or** VM-01 < 30 with VM-31 = 0 | Write a short post-mortem; decide whether to pivot (different problem/segment) or stop |

**Avatar result (applies to any proceed outcome):** if VM-44 > 50% or VM-42 > 1.3×, the default home becomes Concept C and the avatar's role is redesigned. The avatar-first identity stays (confirmed). If participants strongly reject the avatar concept itself, escalate to the founder as a product decision. Do not change it silently.

**G0 report contents:** metric table (actual vs thresholds), interview synthesis, avatar test summary, supply/source analysis, risks, recommended outcome, and decisions needed. Template in [VALIDATION_METRICS.md](./VALIDATION_METRICS.md#5-g0-report-template).

## 9. Research ethics and data handling

- Ask interviewees for consent before notes; record audio **only** with explicit consent; tell them they can stop at any time.
- Notes are anonymised (participant code P01…); the contact list is stored separately and deleted after P-0 unless the person joined the tester list.
- Audio recordings (if any) are deleted within 30 days after synthesis.
- No sensitive personal data is collected (health, religion, exact home address).
- Personal-data rules apply to research data too; counsel question QL-15 covers interview consent and storage.

## 10. After P-0: documents to update

[PRODUCT_DISCOVERY.md](./PRODUCT_DISCOVERY.md) (synthesis, personas), [DATA_SOURCES_REGISTER.md](./DATA_SOURCES_REGISTER.md) (evaluated sources), [CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md) (measured minutes/item), [UX_UI_SPECIFICATION.md](./UX_UI_SPECIFICATION.md) and D-06 (prototype results), [MVP_SCOPE.md](./MVP_SCOPE.md) (targets), [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) (measured capacity), [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) (G0 outcome).
