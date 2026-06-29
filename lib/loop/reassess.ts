// Re-assessment (A2) — produce a v2 AnalysisResult from a baseline plus the proofs
// the student earned. DETERMINISTIC: we upgrade the evidence status of skills that now
// have verified proof, then re-run the SAME scoring functions. The numbers move because
// the evidence changed — never because an LLM invented a delta. This is the honest core
// of "proving it helps": the gap was evidence, the student supplied it, the score rises.

import type { AnalysisResult } from '@/lib/domain/analysis'
import type { EvidenceStatus, Skill } from '@/lib/domain/evidence'
import type { RoleRequirement } from '@/lib/domain/role'
import { computeAllScores } from '@/lib/scoring'

// A verified artifact closes the EVIDENCE gap → the skill becomes verified. Statuses that
// are about durability (low_durability_skill) or already verified are left untouched.
function upgradeStatus(s: EvidenceStatus): EvidenceStatus {
  switch (s) {
    case 'evidence_gap':
    case 'unverified_claim':
    case 'weak_evidence':
    case 'partial_skill':
    case 'transferable_skill':
    case 'skill_gap':
      return 'verified_skill'
    default:
      return s // verified_skill, low_durability_skill
  }
}

export function reassess(
  baseline: AnalysisResult,
  verifiedSkillIds: Set<string>,
  requirements: RoleRequirement[],
): AnalysisResult {
  const skills: Skill[] = baseline.skills.map(sk => {
    if (!verifiedSkillIds.has(sk.id)) return sk
    return {
      ...sk,
      status: upgradeStatus(sk.status),
      confidence: Math.max(sk.confidence, 0.9),
      evidence: [
        ...sk.evidence,
        { kind: 'work_sample', label: 'หลักฐานที่ส่งและยืนยันแล้ว (proof-of-work)' },
      ],
    }
  })

  const scores = computeAllScores(skills, requirements, baseline.plan)
  return { ...baseline, skills, scores }
}
