// PostgreSQL Store implementation — the pilot backend (durable, cross-session).
// Selected by getStore() when STORE=postgres or DATABASE_URL is set. Schema lives
// in db/migrations/0001_init.sql; run `npm run db:migrate` before first use.
//
// Mapping: queryable keys are columns; deep snapshots (AnalysisResult, a proof's
// verification) are JSONB and come back already parsed. Timestamps are stored as
// TIMESTAMPTZ and surfaced to the domain as ISO strings.

import { Pool } from 'pg'
import type { Store } from './types'
import type { AnalyzeRequest } from '@/lib/orchestrator/types'
import type { AnalysisResult } from '@/lib/domain/analysis'
import type { ConsentRecord } from '@/lib/domain/profile'
import type { Assessment, Proof, AdvisorReview, AuditLog, LlmRun } from '@/lib/domain/loop'

// Remote hosts (Supabase, Neon, …) require SSL; local docker does not. node-postgres
// does not enable SSL from the URL by default, so we set it explicitly for non-local hosts.
// rejectUnauthorized:false is acceptable for a POC (avoids bundling each provider's CA).
function sslFor(url: string | undefined): false | { rejectUnauthorized: boolean } {
  if (!url) return false
  const local = url.includes('localhost') || url.includes('127.0.0.1')
  return local ? false : { rejectUnauthorized: false }
}

// One pool per process. Pinned to global so hot reloads in dev don't leak pools.
const g = global as typeof global & { __pgPool?: Pool }
function pool(): Pool {
  const url = process.env.DATABASE_URL
  return g.__pgPool ?? (g.__pgPool = new Pool({ connectionString: url, ssl: sslFor(url) }))
}

const iso = (v: Date | string): string => (v instanceof Date ? v.toISOString() : v)

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToAssessment(r: any): Assessment {
  return {
    id: r.id,
    studentId: r.student_id,
    runId: r.run_id,
    version: r.version,
    parentId: r.parent_id,
    targetRoleId: r.target_role_id,
    result: r.result as AnalysisResult,
    createdAt: iso(r.created_at),
  }
}

function rowToProof(r: any): Proof {
  return {
    id: r.id,
    assessmentId: r.assessment_id,
    actionItemId: r.action_item_id,
    skillId: r.skill_id,
    proofType: r.proof_type,
    source: r.source,
    url: r.url ?? undefined,
    filename: r.filename ?? undefined,
    state: r.state,
    submittedAt: iso(r.submitted_at),
    verification: r.verification ?? undefined,
  }
}

function rowToReview(r: any): AdvisorReview {
  return {
    id: r.id,
    assessmentId: r.assessment_id,
    advisorId: r.advisor_id,
    action: r.action,
    targetSkillId: r.target_skill_id ?? undefined,
    targetScoreId: r.target_score_id ?? undefined,
    overrideValue: r.override_value ?? undefined,
    newSkillStatus: r.new_skill_status ?? undefined,
    note: r.note,
    reviewedAt: iso(r.reviewed_at),
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export class PostgresStore implements Store {
  // ── Run lifecycle ──
  async storeRun(req: AnalyzeRequest): Promise<void> {
    await pool().query(
      `INSERT INTO runs (run_id, request) VALUES ($1, $2)
       ON CONFLICT (run_id) DO UPDATE SET request = EXCLUDED.request`,
      [req.runId, req],
    )
  }

  async getActiveRun(runId: string): Promise<AnalyzeRequest | null> {
    const { rows } = await pool().query('SELECT request FROM runs WHERE run_id = $1', [runId])
    return rows[0]?.request ?? null
  }

  async storeResult(runId: string, result: AnalysisResult): Promise<void> {
    await pool().query('UPDATE runs SET result = $2 WHERE run_id = $1', [runId, result])
  }

  async getResult(runId: string): Promise<AnalysisResult | null> {
    const { rows } = await pool().query('SELECT result FROM runs WHERE run_id = $1', [runId])
    return rows[0]?.result ?? null
  }

  // ── Consent ──
  async saveConsent(c: ConsentRecord): Promise<void> {
    await pool().query(
      `INSERT INTO consent_records (id, student_id, granted_at, purposes) VALUES ($1,$2,$3,$4)`,
      [crypto.randomUUID(), c.studentId, c.grantedAt, c.purposes],
    )
  }

  async getLatestConsent(studentId: string): Promise<ConsentRecord | null> {
    const { rows } = await pool().query(
      'SELECT student_id, granted_at, purposes FROM consent_records WHERE student_id = $1 ORDER BY granted_at DESC LIMIT 1',
      [studentId],
    )
    const r = rows[0]
    return r ? { studentId: r.student_id, grantedAt: iso(r.granted_at), purposes: r.purposes } : null
  }

  // ── Assessments ──
  async saveAssessment(a: Assessment): Promise<void> {
    await pool().query(
      `INSERT INTO assessments (id, student_id, run_id, version, parent_id, target_role_id, result, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO UPDATE SET result = EXCLUDED.result`,
      [a.id, a.studentId, a.runId, a.version, a.parentId, a.targetRoleId, a.result, a.createdAt],
    )
  }

  async getAssessment(id: string): Promise<Assessment | null> {
    const { rows } = await pool().query('SELECT * FROM assessments WHERE id = $1', [id])
    return rows[0] ? rowToAssessment(rows[0]) : null
  }

  async getAssessmentByRun(runId: string): Promise<Assessment | null> {
    const { rows } = await pool().query(
      'SELECT * FROM assessments WHERE run_id = $1 ORDER BY version DESC LIMIT 1',
      [runId],
    )
    return rows[0] ? rowToAssessment(rows[0]) : null
  }

  async listAssessmentsByStudent(studentId: string): Promise<Assessment[]> {
    const { rows } = await pool().query(
      'SELECT * FROM assessments WHERE student_id = $1 ORDER BY version ASC',
      [studentId],
    )
    return rows.map(rowToAssessment)
  }

  async getLatestAssessment(studentId: string): Promise<Assessment | null> {
    const { rows } = await pool().query(
      'SELECT * FROM assessments WHERE student_id = $1 ORDER BY version DESC LIMIT 1',
      [studentId],
    )
    return rows[0] ? rowToAssessment(rows[0]) : null
  }

  // ── Proofs ──
  async saveProof(p: Proof): Promise<void> {
    await pool().query(
      `INSERT INTO proofs (id, assessment_id, action_item_id, skill_id, proof_type, source, url, filename, state, submitted_at, verification)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [p.id, p.assessmentId, p.actionItemId, p.skillId, p.proofType, p.source,
       p.url ?? null, p.filename ?? null, p.state, p.submittedAt, p.verification ?? null],
    )
  }

  async getProof(id: string): Promise<Proof | null> {
    const { rows } = await pool().query('SELECT * FROM proofs WHERE id = $1', [id])
    return rows[0] ? rowToProof(rows[0]) : null
  }

  async updateProof(p: Proof): Promise<void> {
    await pool().query(
      `UPDATE proofs SET state = $2, verification = $3, url = $4, filename = $5 WHERE id = $1`,
      [p.id, p.state, p.verification ?? null, p.url ?? null, p.filename ?? null],
    )
  }

  async listProofsByAssessment(assessmentId: string): Promise<Proof[]> {
    const { rows } = await pool().query(
      'SELECT * FROM proofs WHERE assessment_id = $1 ORDER BY submitted_at ASC',
      [assessmentId],
    )
    return rows.map(rowToProof)
  }

  // ── Advisor review ──
  async saveReview(r: AdvisorReview): Promise<void> {
    await pool().query(
      `INSERT INTO advisor_reviews (id, assessment_id, advisor_id, action, target_skill_id, target_score_id, override_value, new_skill_status, note, reviewed_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [r.id, r.assessmentId, r.advisorId, r.action, r.targetSkillId ?? null, r.targetScoreId ?? null,
       r.overrideValue ?? null, r.newSkillStatus ?? null, r.note, r.reviewedAt],
    )
  }

  async listReviewsByAssessment(assessmentId: string): Promise<AdvisorReview[]> {
    const { rows } = await pool().query(
      'SELECT * FROM advisor_reviews WHERE assessment_id = $1 ORDER BY reviewed_at ASC',
      [assessmentId],
    )
    return rows.map(rowToReview)
  }

  async listAdvisorQueue(): Promise<Assessment[]> {
    const { rows } = await pool().query(
      `SELECT a.* FROM assessments a
       WHERE jsonb_array_length(COALESCE(a.result->'flags', '[]'::jsonb)) > 0
          OR EXISTS (SELECT 1 FROM proofs p WHERE p.assessment_id = a.id AND p.state = 'needs_advisor')
       ORDER BY a.created_at DESC`,
    )
    return rows.map(rowToAssessment)
  }

  // ── Audit + AI logs ──
  async appendAudit(log: AuditLog): Promise<void> {
    await pool().query(
      `INSERT INTO audit_logs (id, actor_id, actor_role, action, subject_id, detail, at)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [log.id, log.actorId, log.actorRole, log.action, log.subjectId, log.detail ?? null, log.at],
    )
  }

  async listAudit(subjectId: string): Promise<AuditLog[]> {
    const { rows } = await pool().query(
      'SELECT * FROM audit_logs WHERE subject_id = $1 ORDER BY at ASC',
      [subjectId],
    )
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return rows.map((r: any): AuditLog => ({
      id: r.id, actorId: r.actor_id, actorRole: r.actor_role, action: r.action,
      subjectId: r.subject_id, detail: r.detail ?? undefined, at: iso(r.at),
    }))
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }

  async appendLlmRun(run: LlmRun): Promise<void> {
    await pool().query(
      `INSERT INTO llm_runs (id, run_id, agent, confidence, flags, prompt_tokens, completion_tokens, at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [run.id, run.runId, run.agent, run.confidence, run.flags,
       run.promptTokens ?? null, run.completionTokens ?? null, run.at],
    )
  }
}
