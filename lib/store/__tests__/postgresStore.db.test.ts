// Live PostgresStore round-trip. SKIPPED by default (keeps `npm test` offline/fast).
// Run against a real DB with:  RUN_DB_TESTS=1 npm run test:db
// Loads DATABASE_URL from .env.local (vitest does not read it on its own).

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect, afterAll } from 'vitest'
import { PostgresStore } from '@/lib/store/postgresStore'
import type { AnalysisResult } from '@/lib/domain/analysis'
import type { Assessment, Proof, AuditLog } from '@/lib/domain/loop'

// minimal .env.local loader (DATABASE_URL only)
if (!process.env.DATABASE_URL) {
  const path = join(process.cwd(), '.env.local')
  if (existsSync(path)) {
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const m = line.match(/^\s*DATABASE_URL\s*=\s*(.*)\s*$/)
      if (m) process.env.DATABASE_URL = m[1].trim()
    }
  }
}

const enabled = !!process.env.RUN_DB_TESTS && !!process.env.DATABASE_URL
const STUDENT = 'test-student-db-roundtrip'

// Opaque JSONB snapshot — only persistence is under test, not the analysis shape.
const fakeResult = (flags: AnalysisResult['flags']): AnalysisResult =>
  ({ runId: 'r1', scenarioId: null, profile: {}, skills: [], scores: {}, plan: {}, flags } as unknown as AnalysisResult)

describe.skipIf(!enabled)('PostgresStore (live DB)', () => {
  const store = new PostgresStore()

  afterAll(async () => {
    // clean up everything this test created (respect FK order)
    const { Pool } = await import('pg')
    const url = process.env.DATABASE_URL!
    const ssl = url.includes('localhost') ? false : { rejectUnauthorized: false }
    const pool = new Pool({ connectionString: url, ssl })
    await pool.query('DELETE FROM advisor_reviews WHERE assessment_id LIKE $1', ['test-a-%'])
    await pool.query('DELETE FROM proofs WHERE assessment_id LIKE $1', ['test-a-%'])
    await pool.query('DELETE FROM audit_logs WHERE subject_id LIKE $1', ['test-a-%'])
    await pool.query('DELETE FROM assessments WHERE student_id = $1', [STUDENT])
    await pool.query('DELETE FROM runs WHERE run_id LIKE $1', ['test-r-%'])
    await pool.end()
  })

  it('round-trips a versioned assessment with JSONB', async () => {
    const a: Assessment = {
      id: 'test-a-1', studentId: STUDENT, runId: 'test-r-1', version: 1,
      parentId: null, targetRoleId: 'business-analyst',
      result: fakeResult([]), createdAt: new Date().toISOString(),
    }
    await store.saveAssessment(a)
    const got = await store.getAssessment('test-a-1')
    expect(got?.studentId).toBe(STUDENT)
    expect(got?.version).toBe(1)
    expect(got?.result.flags).toEqual([])  // JSONB came back parsed
  })

  it('lists versions in order and finds the latest', async () => {
    const v2: Assessment = {
      id: 'test-a-2', studentId: STUDENT, runId: 'test-r-2', version: 2,
      parentId: 'test-a-1', targetRoleId: 'business-analyst',
      result: fakeResult([]), createdAt: new Date().toISOString(),
    }
    await store.saveAssessment(v2)
    const list = await store.listAssessmentsByStudent(STUDENT)
    expect(list.map(x => x.version)).toEqual([1, 2])
    expect((await store.getLatestAssessment(STUDENT))?.id).toBe('test-a-2')
  })

  it('persists a proof and updates its state', async () => {
    const p: Proof = {
      id: 'test-p-1', assessmentId: 'test-a-1', actionItemId: 'task-1', skillId: 'sql',
      proofType: 'github_repo', source: 'link', url: 'https://github.com/x/y',
      state: 'submitted', submittedAt: new Date().toISOString(),
    }
    await store.saveProof(p)
    await store.updateProof({ ...p, state: 'needs_advisor' })
    const proofs = await store.listProofsByAssessment('test-a-1')
    expect(proofs).toHaveLength(1)
    expect(proofs[0].state).toBe('needs_advisor')
  })

  it('surfaces flagged + proof-routed assessments in the advisor queue', async () => {
    // test-a-1 is in queue via the needs_advisor proof above
    const queue = await store.listAdvisorQueue()
    expect(queue.some(x => x.id === 'test-a-1')).toBe(true)
  })

  it('appends and reads an audit log (PDPA)', async () => {
    const log: AuditLog = {
      id: 'test-audit-1', actorId: STUDENT, actorRole: 'student',
      action: 'proof_submitted', subjectId: 'test-a-1', at: new Date().toISOString(),
    }
    await store.appendAudit(log)
    const logs = await store.listAudit('test-a-1')
    expect(logs.some(l => l.action === 'proof_submitted')).toBe(true)
  })
})
