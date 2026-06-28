# API conventions

Modular instruction file — endpoint shape and contracts. See plan §19 for the endpoint list.

## Shape

- REST, JSON in/out. Bodies match the data model (plan §16) field names.
- Resource-oriented paths. Key endpoints:
  - Student: `POST /profile`, `POST /documents`, `POST /documents/{id}/parse`,
    `POST /assessments`, `GET /assessments/{id}`, `GET /assessments/{id}/action-plan`,
    `POST /proof`, `POST /chat`
  - Advisor: `GET /students`, `GET /students/{id}/assessment`, `POST /reviews`,
    `POST /assessments/{id}/override`
  - Institution: `GET /cohorts/{id}/dashboard`, `/gap-by-program`, `/interventions`, `/report`
  - Admin: `GET/POST /taxonomy`, `GET/POST /target-roles`, `GET /llm-runs`

## Rules

- **Consent gate** runs before any endpoint that triggers an AI run — return 403 if absent.
- **RBAC** on every route: student / advisor / career-center / admin. Default deny.
- **Errors** are structured: `{ "error": { "code", "message" } }` with a correct HTTP status.
- **Audit**: mutating endpoints write to `audit_logs`; AI endpoints write to `llm_runs`.
- **Anonymization**: cohort/institution endpoints never expose individual identities.
- Pagination on any list endpoint that can grow (students, llm-runs).
