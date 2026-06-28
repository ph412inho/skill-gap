# Testing

Modular instruction file — how to test in this project.

## Software tests

- Unit-test scoring logic (Role Readiness, Evidence Strength, Skill Gap Severity, Resilience,
  Actionability — plan §11). These are deterministic; they must have exact-value tests.
- Integration-test each API endpoint against the data model (plan §16): auth, RBAC, consent gate.
- Test empty / error / low-confidence states, not just the happy path.

## AI evaluation (treat as first-class)

Each AI change must state which metric it affects and not regress it:

- **Evidence classification accuracy** — Cohen's kappa vs advisor labels; gate ≥ 0.7 (assumption 3).
- **Skill extraction** — F1 vs ground-truth set.
- **Hallucination rate** — measured on the red-team set (gaming profiles, weak resumes,
  Thai-English mixed). Must catch fake skills (assumption 9).
- **Bias check** — score reflects evidence, not English fluency (stress test §6).
- **Advisor override rate / low-confidence rate** — tracked, not optimized away.

## Guardrail tests

- Scenario gaming ("Python/SQL/AI expert" with no evidence) must surface as `unverified`.
- Weak-resume-but-strong-student case must be rescuable via self-report + transcript + override.
- No AI path may fabricate experience — assert the guardrail blocks it.
