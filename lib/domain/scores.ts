export type ScoreId =
  | 'role_readiness'
  | 'evidence_strength'
  | 'skill_gap_severity'
  | 'resilience'
  | 'actionability'

export interface ScoreTraceInput {
  label: string
  value: string | number
}

export interface ScoreTraceContribution {
  label: string
  delta: number  // contribution to the final value (positive or negative)
}

export interface ScoreTrace {
  inputs: ScoreTraceInput[]
  rule: string                        // human-readable formula (Thai + English)
  contributions: ScoreTraceContribution[]
  caveats: string[]                   // e.g. "ไม่ใช่การทำนายการได้งาน"
}

export interface Score {
  id: ScoreId
  value: number                       // 0..1
  display: string                     // e.g. "62%"
  confidenceInterval?: [number, number]  // resilience only; shown as a cone
  lowConfidence: boolean
  trace: ScoreTrace
}
