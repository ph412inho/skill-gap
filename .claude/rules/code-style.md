# Code style

Modular instruction file — applies across the codebase.

## General

- Match the style of the file you're editing. Don't reformat unrelated code.
- Identifiers in English; comments may be Thai + technical English.
- Prefer clarity over cleverness. This is a POC read by BAs and advisors, not only engineers.
- Keep functions small and named after what they do. No dead code, no commented-out blocks.

## Frontend (Next.js / React)

- Dashboard-first. Chat is a secondary surface — don't make it the primary path.
- Every displayed score is clickable to its "why" (XAI trace). No bare numbers without provenance.
- Unverified skills carry a visible badge; low-confidence results show a flag, not a confident value.
- Handle empty / error / low-confidence states explicitly (see plan §9).

## API (FastAPI / NestJS)

- Thin controllers; scoring and orchestration logic in services.
- Validate input against the data model (plan §16) with schemas.
- Never trust resume wording as truth — require an evidence object before marking `verified`.

## AI orchestration

- LLM calls use **structured output** (JSON schema), validated before use.
- Rule-based scoring stays deterministic and testable; keep it out of the LLM.
- Every agent run logs to `llm_runs` with confidence + flags. The Critic can veto.
