// Compute the before→after ReadinessDelta (A3) from a baseline (v1) and a later
// assessment (v2+), plus the proofs that drove it. Pure + deterministic so the
// "money shot" is explainable, not asserted.

import type { Assessment, Proof, ReadinessDelta, ScoreDelta, SkillFlip } from '@/lib/domain/loop'
import type { ScoreId } from '@/lib/domain/scores'

const SCORE_ORDER: ScoreId[] = ['role_readiness', 'evidence_strength', 'skill_gap_severity', 'resilience', 'actionability']

export function computeDelta(
  before: Assessment,
  after: Assessment,
  proofs: Proof[],
  advisorVerifiedSkillIds: Set<string> = new Set(),
): ReadinessDelta {
  const scoreDeltas: ScoreDelta[] = SCORE_ORDER.flatMap(id => {
    const b = before.result.scores[id]?.value
    const a = after.result.scores[id]?.value
    if (b == null || a == null) return []
    return [{ id, before: b, after: a, delta: +(a - b).toFixed(4) }]
  })

  const beforeById = new Map(before.result.skills.map(s => [s.id, s]))
  const verifiedProofBySkill = new Map(proofs.filter(p => p.state === 'verified').map(p => [p.skillId, p]))

  const skillFlips: SkillFlip[] = after.result.skills.flatMap(s => {
    const prev = beforeById.get(s.id)
    if (!prev || prev.status === s.status) return []
    return [{
      skillId: s.id,
      label: s.label,
      from: prev.status,
      to: s.status,
      drivenBy: advisorVerifiedSkillIds.has(s.id) ? 'advisor' as const : 'auto_verify' as const,
      proofId: verifiedProofBySkill.get(s.id)?.id,
    }]
  })

  const proofsVerified = proofs.filter(p => p.state === 'verified').length
  const rr = scoreDeltas.find(d => d.id === 'role_readiness')
  const pct = rr ? Math.round(rr.delta * 100) : 0

  // Plain-language "why it moved" — no employment claim; framed as evidence/readiness.
  const summary = pct > 0
    ? `คุณปิดช่องว่างด้านหลักฐาน ${skillFlips.length} ทักษะ — ความพร้อมเพิ่มขึ้น ${pct}% เพราะตอนนี้ “พิสูจน์” ทักษะที่มีอยู่แล้วได้ ไม่ใช่เพราะเรียนรู้สิ่งใหม่ใน 14 วัน`
    : 'ยังไม่มีการเปลี่ยนแปลงของคะแนน — ส่งหลักฐานที่ยืนยันได้เพื่อปิดช่องว่าง'

  return {
    studentId: after.studentId,
    fromAssessmentId: before.id,
    toAssessmentId: after.id,
    scoreDeltas,
    skillFlips,
    proofsVerified,
    proofsTotal: proofs.length,
    summary,
  }
}
