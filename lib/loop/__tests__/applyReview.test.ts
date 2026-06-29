import { describe, it, expect } from 'vitest'
import { MemoryStore } from '@/lib/store/memoryStore'
import { applyReview } from '@/lib/loop/applyReview'
import { computeAllScores } from '@/lib/scoring'
import { Y4_BA_SCENARIO } from '@/lib/fixtures'
import type { AnalysisResult } from '@/lib/domain/analysis'
import type { Assessment, Proof } from '@/lib/domain/loop'

const facts = Y4_BA_SCENARIO.facts

function seed(idSuffix: string) {
  const store = new MemoryStore()
  const result: AnalysisResult = {
    runId: 'run-' + idSuffix, scenarioId: 'y4-business-ba',
    profile: { studentId: 'stu-' + idSuffix, rawSummary: '', skillClaims: [] },
    skills: facts.skills,
    scores: computeAllScores(facts.skills, facts.requirements, facts.plan),
    plan: facts.plan, flags: [],
  }
  const assessment: Assessment = {
    id: 'asmt-' + idSuffix, studentId: 'stu-' + idSuffix, runId: result.runId,
    version: 1, parentId: null, targetRoleId: 'business-analyst', result, createdAt: '2026-06-30T00:00:00.000Z',
  }
  return { store, assessment }
}

const pendingProof = (assessmentId: string): Proof => ({
  id: 'proof-' + assessmentId, assessmentId, actionItemId: 'task-002', skillId: 'data-analysis',
  proofType: 'pdf_writeup', source: 'file', filename: 'report.pdf', state: 'needs_advisor',
  submittedAt: '2026-06-30T00:00:00.000Z',
  verification: { proofId: 'proof-' + assessmentId, reachable: true, relevant: false, confidence: 0.5, outcome: 'routed_to_advisor', rationale: 'อัปโหลดไฟล์', verifiedAt: '2026-06-30T00:00:00.000Z' },
})

describe('applyReview', () => {
  it('verify_evidence flips a pending proof to verified', async () => {
    const { store, assessment } = seed('v')
    await store.saveAssessment(assessment)
    await store.saveProof(pendingProof(assessment.id))

    const r = await applyReview(store, { assessmentId: assessment.id, advisorId: 'adv-1', action: 'verify_evidence', targetSkillId: 'data-analysis', note: 'หลักฐานดี' })
    expect(r.ok).toBe(true)

    const proofs = await store.listProofsByAssessment(assessment.id)
    expect(proofs[0].state).toBe('verified')
    expect(proofs[0].verification?.rationale).toContain('ที่ปรึกษา')
  })

  it('reject moves a pending proof to rejected', async () => {
    const { store, assessment } = seed('r')
    await store.saveAssessment(assessment)
    await store.saveProof(pendingProof(assessment.id))
    await applyReview(store, { assessmentId: assessment.id, advisorId: 'adv-1', action: 'reject', targetSkillId: 'data-analysis', note: 'ไม่เกี่ยวข้อง' })
    const proofs = await store.listProofsByAssessment(assessment.id)
    expect(proofs[0].state).toBe('rejected')
  })

  it('override_score updates the score value and adds a caveat', async () => {
    const { store, assessment } = seed('o')
    await store.saveAssessment(assessment)
    await applyReview(store, { assessmentId: assessment.id, advisorId: 'adv-1', action: 'override_score', targetScoreId: 'role_readiness', overrideValue: 0.8, note: 'พิจารณาเพิ่ม' })
    const updated = await store.getAssessment(assessment.id)
    expect(updated?.result.scores.role_readiness.value).toBe(0.8)
    expect(updated?.result.scores.role_readiness.display).toBe('80%')
    expect(updated?.result.scores.role_readiness.trace.caveats.some(c => c.includes('ที่ปรึกษา'))).toBe(true)
  })

  it('writes a PDPA audit row and a review record', async () => {
    const { store, assessment } = seed('a')
    await store.saveAssessment(assessment)
    await store.saveProof(pendingProof(assessment.id))
    await applyReview(store, { assessmentId: assessment.id, advisorId: 'adv-1', action: 'verify_evidence', targetSkillId: 'data-analysis', note: 'ok' })
    expect((await store.listReviewsByAssessment(assessment.id))).toHaveLength(1)
    expect((await store.listAudit(assessment.id)).some(l => l.action === 'advisor_review')).toBe(true)
  })
})
