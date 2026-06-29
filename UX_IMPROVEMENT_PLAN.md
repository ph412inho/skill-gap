# UX Improvement Plan — Career Readiness POC

Status: **proposal for approval** · Author: Claude (Opus) · Date: 2026-06-29
Scope: real-pilot pass. Read with `CLAUDE.md` (hard rules) and `POC_Plan_Career_Readiness_TH.md`.

---

## 0. The one thing this pass must achieve

> **Make it visible that the loop actually helps a student — not just that it scores them.**

You said it plainly: *"visual proof it actually helps students, not just another project. It must be
very important."* That is the north star. Every item below is ranked by how directly it serves it.

Today the app produces **one snapshot and stops.** A student sees "62%, your gap is evidence" — and
then nothing. There is no way to *act, prove, and watch the number move.* The product's own thesis
("the evidence **loop**") is asserted in copy but does not exist as a navigable experience. So the
single most important change is not visual polish — it is **closing the loop so impact becomes a
thing you can see happen.**

The proof that it helps is a **delta a student earns**:

```
  Baseline assessment        Student does proof-of-work       Re-assessment
  Role Readiness 62%   ──►    submits 2 artifacts        ──►   Role Readiness 78%
  3 skills "unverified"      advisor verifies 1 evidence       3 skills → "verified"
        (the gap)                  (human in loop)              (the gap closed, explainably)
```

That before→after, earned by real work and a human check, is the demo. Without it, this is a
resume scorer. With it, it is a readiness *loop*.

---

## Build status (2026-06-30)

| Phase | Status |
|---|---|
| **A0** Foundation — Postgres + data model | ✅ built & verified live (Supabase) |
| **A1** Proof submission + bounded auto-verify | ✅ built, unit-tested, verified e2e |
| **A2** Re-assessment (v2 from verified proofs) | ✅ built, exact-value tests, verified e2e |
| **A3** Before→after progress view (money shot) | ✅ built, verified e2e (62%→94%, Δ+32%) |
| **B** Advisor review (queue + override) | ✅ built, unit-tested, verified e2e (advisor-verify → 62%→79%, provenance=advisor) |
| **C** Navigation integrity | ✅ router nav (no context drop), cohort→queue drill, #now anchor fixed |
| **D** Affordances (mobile/tap, visible "why") | ✅ honeycomb tap/click/keyboard + detail panel, badge tooltips, visible "why", plain-language cone |
| **E** Expectation & pacing | ✅ refresh-instant + skip (~2s) + replay, honest AI framing, personality skip fixed |

End-to-end proven: baseline → submit 2 proofs (auto-verified) → re-assess → readiness
moved 62%→94% with flipped skills + explainable, employment-claim-free summary, persisted
to Postgres. Auto-verify is bounded by `verifyProof` so a dead/irrelevant link can't inflate
the score (routes to advisor instead).

## 1. Diagnosis — five clusters, ranked

| # | Cluster | Why it matters to "prove it helps" | Severity |
|---|---------|-----------------------------------|----------|
| A | **No proof-of-help loop** — no proof submission, no re-assessment, no before/after, runs are ephemeral | The impact is unprovable. This is the product thesis, missing. | **Blocker** |
| B | **Advisor review is fake** — flag says "sent to Advisor Queue" but no queue, no review, no override action | Violates a hard rule ("low-confidence → human"); the human-in-loop trust story is hollow | **Blocker** |
| C | **Broken navigation / dead-ends** — `window.location.href` drops context, no cohort↔student drill, RoleSwitcher dumps to landing | A pilot user gets lost; the loop can't be walked in either direction | High |
| D | **Invisible / unreachable interactions** — score cards look inert, honeycomb is hover-only (dead on tap), badge meanings unclear | Students on phones can't use the centerpiece; trust signals don't land | High |
| E | **Expectation & pacing** — 8–21s pipeline, no skip/replay, refresh restarts, AI scope not framed | Live pilot sessions drag; users over- or under-trust the AI | Medium |

---

## 2. Workstreams

Tagged **MUST / SHOULD / NICE** per `CLAUDE.md`. Each item: what changes, files, and the
acceptance test ("done when…"). Hard rules to preserve are called out where relevant.

### A — The Proof-of-Help Loop  · **MUST** · *the centerpiece*

The reason the whole pass exists. Build this first.

- **A0. Make assessments persist & versioned — on Postgres.** `lib/store/runs.ts` is an in-memory
  `Map` with a 30-min TTL — it cannot hold a baseline to compare against. **DECIDED: real
  PostgreSQL** per the target stack. This is **net-new infra** — there is no DB in the repo today —
  so A0 includes: schema + migrations, a connection/repository layer, env/secrets, and porting the
  in-memory store behind it. Introduce an `Assessment` record with a `version` and a parent link so
  v2 can diff against v1, plus `proof`, `evidence_verification`, `advisor_review`, `audit_logs`,
  and `llm_runs` tables.
  - This is the longest pole in the build; everything in A/B sits on it.
  - Done when: re-running analysis for the same student persists v1 and creates v2 across restarts.

- **A1. Proof submission + auto-verify on each action item.** `components/plan/ActionPlanCard.tsx`
  + `lib/domain/plan.ts`. Each `ActionItem` gets a state: `todo → submitted → verifying →
  verified | needs_advisor | rejected`. Student can "Mark done + attach proof" (paste a link or
  upload). **DECIDED: auto-verify strong proof** — but bounded by the no-fabrication rule:
  - The evidence-verifier runs on the submitted artifact and produces a confidence that the artifact
    is **real and relevant** (link resolves, contents actually evidence the claimed skill).
  - `confidence ≥ HIGH_THRESHOLD` → **auto-verify** (skill flips, `verified by system`, audit-logged).
  - Below threshold, unresolvable link, or skill mismatch → **`needs_advisor`**, routed to the queue
    (B1). A skill never flips on a student's assertion or a dead/unrelated link.
  - **[ASSUMPTION]** `HIGH_THRESHOLD` ≈ 0.8; tune against the red-team set in `rules/testing.md`.
  - Done when: a real GitHub link auto-verifies its skill; a dead/irrelevant link routes to advisor.

- **A2. Re-assessment.** A "Re-run readiness with my new evidence" action that produces assessment
  v2 from the submitted proofs (auto-verified + advisor-verified). Re-uses the existing pipeline;
  **consent gate still runs** (it's an AI run) and it logs to `llm_runs`.
  - Done when: after submitting proofs, the student gets a v2 with changed skill statuses + scores.

- **A3. The Progress / Before→After view — the money shot.** New surface (e.g.
  `app/(student)/dashboard/[runId]/progress` or a tab on the dashboard). Shows:
  - Readiness **v1 → v2** with the delta (`62% → 78%  ▲ +16`), each as a value *with its
    confidence interval* (no false precision; honor "no employment claims").
  - The skill chips that **flipped** `unverified → verified`, each linking to the proof + the XAI
    trace that explains *why the number moved* ("Stakeholder Mgmt verified by advisor → Evidence
    Strength +0.12 → Role Readiness +6"). Every delta is explainable, per the hard rule.
  - A plain-language line: *"You closed 2 of 3 evidence gaps. Your readiness rose because you now
    have proof for skills you already had — not because you learned something new in 14 days."*
  - Done when: the screen renders a real, traceable delta driven by A1+A2, on mobile and desktop.

### B — Advisor Review, for real  · **MUST** · *honor the human-in-loop rule*

- **B1. Advisor queue.** `LowConfidenceFlag` currently *claims* auto-queueing. Make it true: a
  flagged/low-confidence assessment lands in an advisor list. New `app/(advisor)/queue` route,
  RBAC-gated (default deny). Shows confidence, flags, student program (anonymization rules still
  apply to *cohort* views, but an advisor reviewing their own student sees identity by design —
  note the RBAC boundary).
  - Done when: a gaming/low-confidence scenario produces a queue item an advisor can open.

- **B2. Review actions.** Advisor opens the assessment, sees the same XAI traces, and can:
  **Approve · Override a score · Verify an evidence item · Request more proof.** An override/verify
  changes a skill's status (e.g. `unverified → verified`) and is **audit-logged** (`audit_logs`),
  shown to the student as *"verified by advisor,"* never silently. This is the human half of A3's
  delta.
  - Done when: an advisor verify action flips a skill and that change is visible + logged.

- **B3. Close the loop back to the student.** The student sees *"An advisor reviewed your evidence"*
  with the resulting change — connecting B to A3.
  - Done when: advisor action surfaces in the student's progress view.

### C — Navigation & context integrity  · **SHOULD** · *no dead-ends*

- **C1.** Replace `window.location.href` (AgentNode suggested-actions) with Next `<Link>` / router —
  stop nuking context. (`components/rail/AgentNode.tsx`, `ProgressRail.tsx`)
- **C2.** Cohort ↔ student drill-down: click a gap in `GapByProgramChart` → students with that gap →
  that student's assessment → breadcrumb back. Wire the reverse direction that's missing today.
  (`app/(institution)/cohort/page.tsx`, `components/cohort/*`)
- **C3.** `RoleSwitcher` returns to the role's last meaningful location, not the generic landing.
- **C4.** Validate anchor targets / add scroll-spy so "jump to scores" can't point at nothing.
- Done when: from any screen there is a visible back/exit, and no navigation loses the user's place.

### D — Affordances & trust signals  · **SHOULD**

- **D1.** Score cards: make "click for why" a *visible* affordance (icon + cursor), not hover-only;
  enlarge tap targets. (`components/scores/ScoreCard.tsx`)
- **D2.** Honeycomb: tap/click opens a skill-detail panel (works on mobile, keyboard-focusable);
  today it's hover-only and inert on touch — yet it's the visual centerpiece.
  (`components/evidence/SkillHoneycomb.tsx`)
- **D3.** Evidence legend always reachable; disambiguate terse labels ("missing" vs "no proof").
  (`components/evidence/EvidenceBadge.tsx`)
- **D4.** Confidence cone in plain language for non-technical students.
- Done when: every score's "why," every skill's evidence, and every badge's meaning is reachable by
  tap on a phone.

### E — Expectation & pacing  · **SHOULD**

- **E1.** Pipeline: cache the result so a **refresh shows the finished dashboard** instead of
  restarting; add **Skip / fast-forward** and **Replay** controls. (`useAgentStream.ts`, stream route)
- **E2.** Frame AI scope honestly up front: it *drafts and finds evidence*, it does **not** predict
  employment; unverified ≠ false. (landing + first-run microcopy) — supports trust calibration.
- **E3.** Fix the personality **skip dead-end**: skipping DiSC then "finish" can require `disc`.
  Make skip truly optional end-to-end. (`components/profile/PersonalitySetup.tsx`)
- Done when: a presenter can replay the demo twice in a row without a restart, and the AI's limits
  are stated before the first run.

### NICE (only if time; do not pull from CUT list)
- Editable/reorderable plan, "which tasks aren't feasible in 2 weeks" filter, per-state empty
  states with cause, export of an XAI trace. No employer score / marketplace / scraping (CUT).

---

## 3. Guardrails this plan must not break

Pulled straight from `CLAUDE.md` so we don't trade safety for polish:

- **Consent gate** before *every* AI run — including A2 re-assessment.
- **No fabrication** — auto-verify (A1) is gated on the evidence-verifier confirming the artifact is
  real *and* relevant at high confidence; otherwise it routes to an advisor. A skill never flips on
  student assertion or an unresolvable/irrelevant link.
- **Explainable** — the before→after delta (A3) and every override (B2) carry an XAI trace.
- **Audit** — proof submission, re-assessment, and advisor overrides write to `audit_logs`/`llm_runs`.
- **Anonymized cohort** — C2 drill-down respects the RBAC boundary (advisor↔own student is allowed;
  cohort aggregates stay anonymous).
- **No employment claims** — A3 phrases the delta as readiness/evidence, with confidence intervals.

---

## 4. Sequencing (recommended build order)

1. **A0 + A1 + B-data model together** — proof + verification + assessment versioning share one
   data shape; build them as one foundation.
2. **B1–B3 advisor review** — the human action that drives part of the delta.
3. **A2 + A3** — re-assessment and the before→after money shot (the proof-of-help).
4. **C navigation** — now that there are real destinations to move between.
5. **D affordances**, then **E pacing** — polish once the loop is walkable.

Rationale: A3 (the proof it helps) depends on A1/A2 and B2. So we build the plumbing, then the
human step, then reveal the payoff, then make it navigable and tappable.

**Acceptance test for the whole pass:** *In one sitting on a phone, a pilot student goes
baseline → submits 2 proofs → an advisor verifies one → sees Role Readiness move with an
explainable trace and a plain-language "why," and never hits a dead-end.* If that runs end to end,
the product demonstrably helps a student — visibly.

---

## 5. Decisions — LOCKED (2026-06-29)

1. **Storage — DECIDED + DONE: real PostgreSQL (Supabase, ap-northeast-1).** Schema, migration
   runner, `PostgresStore`, SSL handling, docker-compose all built. Migration applied and verified
   end-to-end with a live round-trip test (`RUN_DB_TESTS=1 npm run test:db` — 5/5 pass). The app
   uses Postgres whenever `DATABASE_URL` is set; otherwise the offline MemoryStore. ✅
2. **Verification — DECIDED: auto-verify strong proof, bounded.** Auto-verify only when the
   evidence-verifier confirms the artifact is real + relevant at `confidence ≥ HIGH_THRESHOLD`
   (≈0.8); everything else routes to the advisor queue. Preserves the no-fabrication rule while
   keeping the delta fast. See A1.
3. **[ASSUMPTION] One target role per assessment** in A3's delta (v2 re-scores against the same
   role as v1). Flag if you want cross-role comparison instead.

**Next step:** convert this into a task list and build the §4 foundation (A0 Postgres + data model),
pending your greenlight.
