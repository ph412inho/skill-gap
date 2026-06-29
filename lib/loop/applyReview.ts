// Apply an advisor review (B2) — the human half of the loop. Mutates proof/assessment
// state per action, records the review, and writes a PDPA audit row. Kept as a helper
// (not inline in the route) so it can be unit-tested.
//
// A verify_evidence action flips a proof the system couldn't auto-verify to 'verified',
// which then feeds re-assessment exactly like an auto-verified one — except provenance is
// 'advisor'. Nothing flips silently: every change is audited and surfaced to the student.

import type { Store } from '@/lib/store'
import type { AdvisorAction, AdvisorReview } from '@/lib/domain/loop'
import type { ScoreId } from '@/lib/domain/scores'

export interface ReviewInput {
  assessmentId: string
  advisorId: string
  action: AdvisorAction
  targetSkillId?: string     // for verify_evidence / reject / request_more_proof
  targetScoreId?: ScoreId    // for override_score
  overrideValue?: number     // 0..1, for override_score
  note: string
}

export interface ReviewResult {
  ok: boolean
  error?: string
  review?: AdvisorReview
}

export async function applyReview(store: Store, input: ReviewInput): Promise<ReviewResult> {
  const assessment = await store.getAssessment(input.assessmentId)
  if (!assessment) return { ok: false, error: 'ไม่พบผลการประเมิน' }

  const now = new Date().toISOString()
  const review: AdvisorReview = {
    id: crypto.randomUUID(),
    assessmentId: input.assessmentId,
    advisorId: input.advisorId,
    action: input.action,
    targetSkillId: input.targetSkillId,
    targetScoreId: input.targetScoreId,
    overrideValue: input.overrideValue,
    note: input.note,
    reviewedAt: now,
  }

  // Resolve the pending proof for a skill (the most recent one awaiting review).
  async function pendingProofForSkill(skillId: string) {
    const proofs = await store.listProofsByAssessment(input.assessmentId)
    return proofs
      .filter(p => p.skillId === skillId && p.state === 'needs_advisor')
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0] ?? null
  }

  switch (input.action) {
    case 'verify_evidence': {
      if (!input.targetSkillId) return { ok: false, error: 'ต้องระบุทักษะ' }
      const proof = await pendingProofForSkill(input.targetSkillId)
      if (!proof) return { ok: false, error: 'ไม่พบหลักฐานที่รอตรวจสอบ' }
      review.newSkillStatus = 'verified_skill'
      await store.updateProof({
        ...proof,
        state: 'verified',
        verification: {
          ...(proof.verification ?? { proofId: proof.id, reachable: true, relevant: true, confidence: 1, outcome: 'routed_to_advisor', verifiedAt: now }),
          relevant: true,
          outcome: 'routed_to_advisor',   // provenance: a human confirmed it
          newStatus: 'verified_skill',
          rationale: `ยืนยันโดยที่ปรึกษา: ${input.note || 'หลักฐานเพียงพอ'}`,
          verifiedAt: now,
        },
      })
      break
    }
    case 'reject':
    case 'request_more_proof': {
      if (!input.targetSkillId) return { ok: false, error: 'ต้องระบุทักษะ' }
      const proof = await pendingProofForSkill(input.targetSkillId)
      if (!proof) return { ok: false, error: 'ไม่พบหลักฐานที่รอตรวจสอบ' }
      await store.updateProof({
        ...proof,
        state: 'rejected',
        verification: {
          ...(proof.verification ?? { proofId: proof.id, reachable: true, relevant: false, confidence: 0.4, outcome: 'rejected', verifiedAt: now }),
          outcome: 'rejected',
          rationale: input.action === 'request_more_proof'
            ? `ที่ปรึกษาขอหลักฐานเพิ่มเติม: ${input.note || 'หลักฐานยังไม่เพียงพอ'}`
            : `ที่ปรึกษาไม่รับหลักฐานนี้: ${input.note || ''}`,
          verifiedAt: now,
        },
      })
      break
    }
    case 'override_score': {
      if (!input.targetScoreId || input.overrideValue == null) return { ok: false, error: 'ต้องระบุคะแนนและค่าใหม่' }
      const score = assessment.result.scores[input.targetScoreId]
      if (!score) return { ok: false, error: 'ไม่พบคะแนนนี้' }
      const v = Math.max(0, Math.min(1, input.overrideValue))
      assessment.result.scores[input.targetScoreId] = {
        ...score,
        value: v,
        display: `${Math.round(v * 100)}%`,
        trace: { ...score.trace, caveats: [...score.trace.caveats, `ปรับแก้โดยที่ปรึกษา: ${input.note || ''}`] },
      }
      await store.saveAssessment(assessment)
      break
    }
    case 'approve':
      break // record-only: marks the assessment human-reviewed
  }

  await store.saveReview(review)
  await store.appendAudit({
    id: crypto.randomUUID(),
    actorId: input.advisorId,
    actorRole: 'advisor',
    action: 'advisor_review',
    subjectId: input.assessmentId,
    detail: `${input.action}${input.targetSkillId ? ' · skill=' + input.targetSkillId : ''}${input.targetScoreId ? ' · score=' + input.targetScoreId : ''}`,
    at: now,
  })

  return { ok: true, review }
}
