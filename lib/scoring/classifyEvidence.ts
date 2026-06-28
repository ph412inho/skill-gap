import type { EvidenceRef, EvidenceStatus } from '@/lib/domain/evidence'

export interface ClassifyInput {
  claimed: boolean
  evidenceRefs: EvidenceRef[]
  requiredByRole: boolean
  durability?: number      // 0..1; < 0.35 → low_durability_skill
}

// A ref is "substantive" if it is NOT self-report — it can be verified externally
function isSubstantive(ref: EvidenceRef): boolean {
  return ref.kind !== 'self_report'
}

// KEY INVARIANT (asserted in tests):
// 'verified_skill' ALWAYS requires at least 1 substantive (non-self_report) EvidenceRef.
// This is enforced here as code, not a prompt — the guardrail cannot be jailbroken.
export function classifyEvidence(input: ClassifyInput): EvidenceStatus {
  const { claimed, evidenceRefs, requiredByRole, durability } = input

  if (!claimed) return 'skill_gap'

  const substantive = evidenceRefs.filter(isSubstantive)
  const selfReports  = evidenceRefs.filter(r => r.kind === 'self_report')

  // 2+ substantive refs → verified (highest confidence)
  if (substantive.length >= 2) {
    if (durability !== undefined && durability < 0.35) return 'low_durability_skill'
    return 'verified_skill'
  }

  // Exactly 1 substantive ref → partial
  if (substantive.length === 1) {
    return 'partial_skill'
  }

  // Only self-report refs → weak
  if (selfReports.length > 0) return 'weak_evidence'

  // Claimed but zero refs at all → unverified
  return 'unverified_claim'
}
