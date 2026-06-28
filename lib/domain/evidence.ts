// The 8 evidence statuses — the heart of the system (§12)
export type EvidenceStatus =
  | 'verified_skill'      // clear evidence: project/cert/transcript/work_sample/advisor
  | 'partial_skill'       // some evidence, not strong enough for full verification
  | 'weak_evidence'       // mentioned but evidence is low-quality (self-report only)
  | 'unverified_claim'    // claimed on resume, zero evidence
  | 'skill_gap'           // role requires it; student has zero claim
  | 'evidence_gap'        // student has skill but cannot prove it with an artifact
  | 'transferable_skill'  // cross-domain skill that maps to this requirement
  | 'low_durability_skill'// verified but at high automation/obsolescence risk

export type EvidenceKind =
  | 'project'
  | 'transcript'
  | 'certificate'
  | 'work_sample'
  | 'advisor'
  | 'self_report'

export interface EvidenceRef {
  kind: EvidenceKind
  label: string
  sourceDocId?: string  // points back to uploaded document
  excerpt?: string      // the span that justified the classification → drives XAI "why"
}

export interface Skill {
  id: string
  label: string
  escoId?: string
  onetId?: string
  durability?: number    // 0..1 from taxonomy; undefined → treated as 0.5
  status: EvidenceStatus
  evidence: EvidenceRef[]
  confidence: number     // 0..1; < 0.5 → routed to advisor queue
}
