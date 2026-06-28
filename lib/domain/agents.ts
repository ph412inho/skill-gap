// The 8-agent pipeline — order is significant (maps 1:1 to the UI progress rail)
export const AGENT_PIPELINE = [
  'profile_analyzer',
  'evidence_verifier',
  'role_fit',
  'skill_gap',
  'resilience',
  'action_plan',
  'critic',
  'institution_insight',
] as const

export type AgentId = typeof AGENT_PIPELINE[number]
