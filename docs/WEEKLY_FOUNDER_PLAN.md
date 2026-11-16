# Weekly Founder Plan

Status: Draft 0.2 · 2026-11-16 · Related: [P0_VALIDATION_PLAN.md](./P0_VALIDATION_PLAN.md), [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md), [VALIDATION_METRICS.md](./VALIDATION_METRICS.md)

Capacity [CONFIRMED]: 10–15 focused hours/week. The P-0 plan below averages **~11 h/week** (8 weeks, ~90 h) so that a 10-hour week still covers the essentials. Items marked *(flex)* are dropped first in a short week.

## 1. P-0 week by week

### Week 1 — Set-up (≈10.5 h)
- **Objective:** be ready to collect, recruit and test.
- **Tasks:** approve this package (decisions in [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md)) · choose 3–4 pilot categories · create the workbook from [`p0/`](./p0/) templates (1.5 h) · list and evaluate ~25 candidate sources (4 h) · write and send the interview recruitment message to network/groups that allow it (2 h) · contact 2–3 Azerbaijani lawyers for quotes and send the QL brief (1.5 h) · create the Telegram channel, **not yet public** (0.5 h) · set up a weekly time log (0.5 h) · plan the week-2 interviews (0.5 h).
- **Deliverables:** workbook with ≥25 evaluated sources; recruitment sent; lawyer requests sent; channel created.
- **Success:** ≥5 interview candidates replied; ≥15 sources rated usable.
- **Risks:** slow recruitment → widen to second-degree contacts and communities.

### Week 2 — Baseline curation + first interviews (≈11.5 h)
- **Tasks:** curate baseline week (≥30 items, log minutes) (4 h) · 3 interviews incl. prototype test once prototypes exist (4.5 h) · build static prototypes A and C (3 h).
- **Deliverables:** baseline supply count; 3 interview notes; prototypes v1.
- **Success:** ≥30 items captured; median curation time measured.
- **Risks:** prototype takes longer → test with paper/slide version first.

### Week 3 — Pilot launch (≈12 h)
- **Tasks:** publish first weekend post (1.5 h incl. preparation) · curation (4 h) · 3 interviews (4.5 h) · organizer outreach batch 1, 8 contacts (2 h).
- **Deliverables:** channel public; first post; 6 interviews total; 8 organizer messages.
- **Success:** ≥20 subscribers by week end; ≥1 organizer reply.
- **Risks:** low initial reach → ask interviewees and communities (with admin permission).

### Week 4 — Rhythm (≈12 h)
- **Tasks:** curation (3.5 h) · 1–2 posts + poll (1 h) · 3 interviews (4.5 h) · prototype fixes (1 h, *flex*) · outreach batch 2 (7 contacts) + follow-ups (2 h).
- **Deliverables:** 9 interviews; 15 organizers contacted; first poll.
- **Success:** view rate ≥25% on posts; ≥1 organizer submission.

### Week 5 — Organizer conversations + gold set (≈12 h)
- **Tasks:** curation (3.5 h) · posts + poll (1 h) · 2 interviews (3 h) · organizer calls/follow-ups (2 h) · gold-set labelling from captured announcements (2 h) · metrics entry (0.5 h).
- **Deliverables:** 11 interviews; ≥25 gold-set items.

### Week 6 — Mid-point review (≈11 h)
- **Tasks:** curation (3.5 h) · posts + poll (1 h) · final interview(s)/prototype tests (3 h) · gold set (2 h, *flex*) · mid-point metrics review against thresholds (1.5 h).
- **Deliverables:** mid-point note: which metrics are at risk; corrective actions (e.g. channel/category change).
- **Risks:** demand metrics below minimum → act now (format, timing, categories) rather than at G0.

### Week 7 — Synthesis + legal brief (≈10 h)
- **Tasks:** curation (3 h) · posts + poll (1 h) · interview synthesis (3 h) · organizer follow-up (1.5 h) · choose counsel and send the written QL brief if quotes are acceptable (1.5 h).
- **Deliverables:** synthesis draft; counsel engaged (if budget approved).

### Week 8 — G0 (≈11 h)
- **Tasks:** curation (3 h) · final post + poll (1 h) · metrics analysis (2.5 h) · gold-set finalisation (1.5 h, *flex*) · G0 report (3 h).
- **Deliverables:** G0 report ([template](./VALIDATION_METRICS.md#5-g0-report-template)); outcome decision by founder.

### Weeks 9–10 — Extension (only if G0 outcome 3)
Targeted actions only (recruitment push, channel change, extra interviews), then re-run G0.

## 2. Week 1 founder checklist (actions only the founder can take)

1. Review and approve/decline the decisions marked **Owner approval** in [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) (at minimum D-04, D-21, D-22, D-23, D-24, D-27).
2. Revoke the GitHub token that was pasted in chat on 2026-11-14 (if not already done).
3. Pick 3–4 pilot categories.
4. Copy the CSV templates from [`p0/`](./p0/) into your spreadsheet tool.
5. Send the interview recruitment message ([USER_INTERVIEW_GUIDE.md](./USER_INTERVIEW_GUIDE.md#1-recruitment-and-screening)).
6. Request quotes from 2–3 lawyers; share the QL list ([LEGAL_AND_HOSTING_OPTIONS.md](./LEGAL_AND_HOSTING_OPTIONS.md#3-questions-for-azerbaijani-legal-counsel)).
7. Create (but don't publish) the pilot channel.
8. Start the weekly time log (§5).

## 3. Build-phase weekly rhythm (P-1 onward, expected 12.5 h)

| Session | Length | Content |
|---|---|---|
| Session 1 (weekday evening) | 2.5–3 h | One small, reviewable task with Claude Code (plan → implement → test → review) |
| Session 2 (weekday evening) | 2.5–3 h | Continue or a second task; merge only when tests pass |
| Session 3 (weekend) | 3–4 h | Larger task or device testing; weekly review of the roadmap |
| Content ops | 1.5–2.5 h | Pilot post / admin curation |
| Admin | ~1 h | Legal, outreach, accounts, time log |

Session rules: start by re-reading the task and the relevant docs (10 min). End by writing a 3-line handover note (what's done, what's next, open issues) to reduce warm-up next time.

## 4. Protecting the plan

- If a week drops below 8 hours, skip *(flex)* items first and never skip metrics entry.
- Don't start new tracks (e.g. Instagram channel, landing page) during P-0 without recording a decision.
- One day per week with zero project work protects sustainability over a multi-year timeline.

## 5. Weekly time log template

Use [`p0/time_log.csv`](./p0/time_log.csv). Columns: `week_start, category (research|content|outreach|legal|dev|admin|other), task, hours, notes`. Each Sunday, sum by category; these sums feed velocity and capacity re-estimates in [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md#10-re-planning-rules).
