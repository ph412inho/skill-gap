---
name: deploy
description: >
  Guide a safe POC deploy to cloud or a university test server: run the pre-deploy gate,
  apply migrations, verify mocks, and confirm guardrails. Use when shipping a build.
---

# Deploy (POC)

Target: cloud or university test server. Auth is email login for the POC; SSO is mocked.

## Procedure

1. **Gate** — run the pre-deploy checklist (`commands/deploy.md`). Do not proceed on any failure.
2. **Eval thresholds** — confirm evidence kappa ≥ 0.7 and hallucination rate within budget on the
   latest eval run. These gate the technical core (assumptions 3/9).
3. **Migrations** — apply DB migrations; pin the skill-taxonomy version.
4. **Config** — env vars present on target; no secrets in the repo. Consent gate + RBAC active.
5. **Mocks** — SSO, employer/Tier-2 data, and large-cohort data are explicitly mocked with seed
   data, not silently broken.
6. **Smoke test** — one full student flow (consent → upload → analysis → action plan) and one
   advisor/cohort flow end-to-end.
7. **Rollback** — know the previous good build and how to revert before announcing.

Report each step's status. Stop and ask the human before the final cutover.
