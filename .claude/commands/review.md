---
description: Review the current diff for correctness, PDPA, and guardrail compliance
---

Review the pending changes on this branch. In addition to ordinary correctness and
simplification, check the project's hard rules:

1. **PDPA / privacy** — is there a consent gate before any AI run? Is cohort data anonymized?
   Is every sensitive action audit-logged? Is employer sharing OFF by default?
2. **No fabrication** — does any AI path invent skills/experience? Are unverified claims labelled
   rather than hidden? Is every score traceable (XAI "why")?
3. **No employment claims** — does any copy or score imply predicting getting a job?
4. **No scraping** — does any data source pull from job sites instead of approved open data?
5. **Low-confidence → human** — are low-confidence results flagged into the advisor queue?

Report findings grouped by severity. Cite `file:line`. Do not auto-fix unless asked.
