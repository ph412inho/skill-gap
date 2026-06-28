---
description: Pre-deploy checklist for the POC (cloud or university test server)
---

Run the pre-deploy checklist before shipping to the cloud or university test server.

1. Tests pass (`rules/testing.md`) and AI eval metrics are within thresholds
   (evidence-classification kappa ≥ 0.7, hallucination rate within budget).
2. Consent gate active on every AI entry point; RBAC roles enforced.
3. No secrets in committed files; env vars present on target.
4. DB migrations applied; taxonomy version pinned.
5. Audit logging enabled.
6. Mock surfaces (SSO, employer/Tier-2 data, large cohort) are clearly mocked, not silently broken.

Report the status of each item. Stop and ask before deploying if any item fails.
