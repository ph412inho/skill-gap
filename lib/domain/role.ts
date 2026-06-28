import type { EvidenceStatus } from './evidence'

export interface RoleRequirement {
  skillId: string
  label: string
  importance: number  // 0..1; drives weighting in role readiness + gap severity
}

export interface RankedGap {
  skillId: string
  label: string
  importance: number
  currentStatus: EvidenceStatus
  gapWeight: number  // importance × (1 − status weight); higher = more critical
}
