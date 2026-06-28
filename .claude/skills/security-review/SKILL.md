---
name: security-review
description: >
  Review changes for PDPA/privacy, consent, RBAC, and AI-guardrail safety in the Career
  Readiness Platform. Use before merging anything touching student data, AI runs, or auth.
---

# Security & privacy review

Run this when changes touch student data, consent, auth, cohort aggregation, or any AI agent.

## Checklist

1. **Consent (PDPA)** — Is consent recorded and checked before this data is processed or shared?
   Purpose/scope honored? Employer sharing OFF by default? Deletion/retention respected?
2. **RBAC** — Is the route/action gated to the right role (student/advisor/career-center/admin)?
   Default deny? No privilege escalation via IDs in the path/body?
3. **Anonymization** — Do cohort/institution surfaces leak any individual identity?
4. **Audit** — Mutations → `audit_logs`; AI runs → `llm_runs` with confidence + flags?
5. **AI guardrails** — Can the Critic veto bad output? Are low-confidence results flagged to the
   advisor queue? Is fabrication of skills/experience blocked? Is prompt-injection from uploaded
   documents contained (treat document text as untrusted)?
6. **Secrets** — No keys, connection strings, or PII in committed files or logs.

## Output

List findings by severity (critical / high / medium / low) with `file:line` and a concrete fix.
Call out anything that weakens a killer assumption test (plan §3).
