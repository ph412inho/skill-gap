# CLAUDE.md — Career Readiness Intelligence Platform (POC)

Team instructions for Claude. Committed to git. See `POC_Plan_Career_Readiness_TH.md` for the full plan.

## What this project is

An **evidence-based career readiness loop** for universities — NOT an AI resume builder.
Flow: student profile → skill/evidence extraction → gap + resilience → 2–4 week proof-of-work
plan → advisor review → cohort insight → university intervention.

The product is the **evidence loop**, not the resume. A resume is just one input/output artifact.

## Guiding principle

This is a **validation-first POC**, not a full build. Every module is a "test that can kill the
project," not just a feature. When in doubt, prefer the cheapest thing that tests a killer
assumption (see plan §3). Do not over-build (no model training, no job-site scraping, no MAS).

## Tech stack (target)

- **Frontend:** Next.js / React (dashboard-first; chat is secondary)
- **API:** FastAPI or NestJS — orchestration + scoring + RBAC
- **DB:** PostgreSQL (+ pgvector optional for semantic skill/role search)
- **Storage:** S3-compatible file store
- **AI orchestration:** LLM structured output + RAG + rule-based scoring — **no model training**
  - Pipeline: Profile → Evidence Verifier → Role Fit → Skill Gap → Resilience → Action Plan →
    **Critic/Guardrail (veto + flag)** → Institution Insight

## Hard rules (non-negotiable)

- **PDPA first.** Consent gate before every AI run. RBAC (student / advisor / career-center /
  admin). Anonymized cohort data. Audit-log every action. Employer sharing = opt-in OFF by default.
- **No fabrication.** AI must never invent experience or skills. Unverified claims are labelled,
  not hidden. Every score is explainable (XAI trace, clickable "why").
- **No employment claims.** Scores measure skill-match readiness, never predict getting a job.
  Resilience Score is a forecast shown with a confidence interval.
- **No scraping job sites.** Use open data only (ESCO/O*NET-style + data.go.th / catalog.doe.go.th).
- **Low-confidence → human.** Any low-confidence result is flagged and routed to the advisor queue.

## Conventions

Modular rules live in `.claude/rules/`. Read them before working in the relevant area:
- `rules/code-style.md` — naming, structure, language
- `rules/testing.md` — what/how to test (incl. AI eval: kappa, F1, hallucination rate)
- `rules/api-conventions.md` — endpoint shapes, errors, auth

## Working agreement

- Thai + technical English is fine in docs and comments; code identifiers stay English.
- Tag risky assumptions inline with `[ASSUMPTION]` and prioritize MUST / SHOULD / NICE / CUT.
- Don't add anything in the CUT list (employer score, job marketplace, real-time scraping, full
  LMS, payments, mobile app, certificates, social features) without an explicit decision.
