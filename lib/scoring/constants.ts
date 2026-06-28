import type { EvidenceStatus } from '@/lib/domain/evidence'

// How much each evidence status contributes to role readiness
// (1.0 = fully counts; 0 = does not count)
export const STATUS_WEIGHTS: Partial<Record<EvidenceStatus, number>> = {
  verified_skill:     1.0,
  partial_skill:      0.6,
  transferable_skill: 0.3,
  // evidence_gap, unverified_claim, weak_evidence, skill_gap, low_durability_skill → 0
}

// Evidence quality weights used in evidence_strength calculation
export const EVIDENCE_QUALITY_WEIGHTS: Partial<Record<EvidenceStatus, number>> = {
  verified_skill:     1.0,
  partial_skill:      0.6,
  weak_evidence:      0.2,
  transferable_skill: 0.5,
  // unverified_claim, evidence_gap, skill_gap, low_durability_skill → 0
}

export function fmt(value: number): string {
  return `${Math.round(value * 100)}%`
}
