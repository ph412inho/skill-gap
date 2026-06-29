-- 0001_init — Career Readiness pilot schema.
-- Backs PostgresStore (lib/store/postgresStore.ts) and the proof-of-help loop.
--
-- Design: queryable keys are real columns; deep nested snapshots (the full
-- AnalysisResult, a proof's verification detail) are JSONB — faithful to the
-- domain types without over-normalizing a POC. PDPA: consent + audit are
-- first-class tables; cohort reads must aggregate (no PII) at the query layer.

BEGIN;

-- ── Students ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id              TEXT PRIMARY KEY,
  name            TEXT,
  program_label   TEXT,
  year_of_study   INT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Consent (PDPA gate; one row per grant) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS consent_records (
  id          TEXT PRIMARY KEY,
  student_id  TEXT NOT NULL,
  granted_at  TIMESTAMPTZ NOT NULL,
  purposes    TEXT[] NOT NULL,            -- ai_analysis | advisor_sharing | research_use
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_consent_student ON consent_records (student_id);

-- ── Runs (the transient analyze request + its result) ───────────────────────
-- Persisted (not just in-memory) so POST /analyze and the SSE GET can share a
-- run across instances. created_at supports a periodic TTL sweep.
CREATE TABLE IF NOT EXISTS runs (
  run_id      TEXT PRIMARY KEY,
  request     JSONB NOT NULL,            -- AnalyzeRequest
  result      JSONB,                     -- AnalysisResult (null until the stream completes)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Assessments (versioned snapshots; A0) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS assessments (
  id              TEXT PRIMARY KEY,
  student_id      TEXT NOT NULL,
  run_id          TEXT NOT NULL,
  version         INT  NOT NULL,                       -- 1 = baseline
  parent_id       TEXT REFERENCES assessments (id),    -- previous version this re-scores from
  target_role_id  TEXT NOT NULL,
  result          JSONB NOT NULL,                      -- full AnalysisResult snapshot
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, version)
);
CREATE INDEX IF NOT EXISTS idx_assessments_student ON assessments (student_id, version);

-- ── Proofs (A1) ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS proofs (
  id              TEXT PRIMARY KEY,
  assessment_id   TEXT NOT NULL REFERENCES assessments (id),
  action_item_id  TEXT NOT NULL,
  skill_id        TEXT NOT NULL,
  proof_type      TEXT NOT NULL,
  source          TEXT NOT NULL,                       -- link | file
  url             TEXT,
  filename        TEXT,
  state           TEXT NOT NULL,                       -- todo|submitted|verifying|verified|needs_advisor|rejected
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  verification    JSONB                                -- EvidenceVerification (null until checked)
);
CREATE INDEX IF NOT EXISTS idx_proofs_assessment ON proofs (assessment_id);
CREATE INDEX IF NOT EXISTS idx_proofs_state ON proofs (state);

-- ── Advisor reviews (B1/B2 — the human half of the loop) ────────────────────
CREATE TABLE IF NOT EXISTS advisor_reviews (
  id                TEXT PRIMARY KEY,
  assessment_id     TEXT NOT NULL REFERENCES assessments (id),
  advisor_id        TEXT NOT NULL,
  action            TEXT NOT NULL,        -- approve|override_score|verify_evidence|request_more_proof|reject
  target_skill_id   TEXT,
  target_score_id   TEXT,
  override_value    DOUBLE PRECISION,
  new_skill_status  TEXT,
  note              TEXT NOT NULL,
  reviewed_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reviews_assessment ON advisor_reviews (assessment_id);

-- ── Audit log (PDPA; every mutating + AI action) ────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id          TEXT PRIMARY KEY,
  actor_id    TEXT NOT NULL,
  actor_role  TEXT NOT NULL,             -- student|advisor|career_center|admin|system
  action      TEXT NOT NULL,
  subject_id  TEXT NOT NULL,
  detail      TEXT,
  at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_subject ON audit_logs (subject_id);

-- ── LLM runs (AI endpoints log here; api-conventions.md) ────────────────────
CREATE TABLE IF NOT EXISTS llm_runs (
  id                 TEXT PRIMARY KEY,
  run_id             TEXT NOT NULL,
  agent              TEXT NOT NULL,
  confidence         DOUBLE PRECISION NOT NULL,
  flags              TEXT[] NOT NULL DEFAULT '{}',
  prompt_tokens      INT,
  completion_tokens  INT,
  at                 TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_llm_runs_run ON llm_runs (run_id);

COMMIT;
