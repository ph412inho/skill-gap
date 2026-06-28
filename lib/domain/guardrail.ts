import type { AgentId } from './agents'

export interface GuardrailFlag {
  agent: AgentId
  code:
    | 'hallucination'
    | 'overclaim'
    | 'bias'
    | 'low_confidence'
    | 'gaming_detected'
  message: string
  affectedSkillIds?: string[]
  severity: 'warning' | 'veto'
}
