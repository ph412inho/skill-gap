import type { EvidenceRef } from './evidence'

export type InputKind = 'paste' | 'file_upload'

export interface RawInput {
  kind: InputKind
  text?: string       // for paste mode
  filename?: string   // for file_upload (mocked in demo)
  targetRoleId: string
}

export interface ConsentRecord {
  studentId: string
  grantedAt: string   // ISO 8601 timestamp
  purposes: Array<'ai_analysis' | 'advisor_sharing' | 'research_use'>
}

export interface ParsedSkillClaim {
  rawText: string
  label: string
  evidenceRefs: EvidenceRef[]
}

export interface ParsedProfile {
  studentName?: string
  studentId: string
  programLabel?: string
  yearOfStudy?: number
  rawSummary: string
  skillClaims: ParsedSkillClaim[]
}
