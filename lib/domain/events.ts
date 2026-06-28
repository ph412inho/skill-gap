import type { AgentId, AGENT_PIPELINE } from './agents'
import type { Skill } from './evidence'
import type { RoleRequirement, RankedGap } from './role'
import type { Score } from './scores'
import type { ActionItem } from './plan'
import type { GuardrailFlag } from './guardrail'
import type { AnalysisResult } from './analysis'

export type { AgentId, AGENT_PIPELINE }
export { AGENT_PIPELINE as AGENT_PIPELINE_VALUES } from './agents'

export type PartialPayload =
  | { kind: 'skills'; skills: Skill[] }
  | { kind: 'role_match'; requirements: RoleRequirement[]; matched: string[] }
  | { kind: 'gaps'; top: RankedGap[] }
  | { kind: 'score'; score: Score }
  | { kind: 'plan_task'; task: ActionItem }

// SSE event shape — the wire contract between server and browser
// Maps 1:1 to the 8 progress rail steps so the dashboard builds as the rail runs
export type AgentEvent =
  | { type: 'run_started'; runId: string; pipeline: readonly AgentId[] }
  | { type: 'agent_started'; agent: AgentId; title: string }
  | { type: 'agent_progress'; agent: AgentId; note: string }
  | { type: 'agent_partial'; agent: AgentId; payload: PartialPayload }
  | { type: 'agent_flagged'; agent: AgentId; flag: GuardrailFlag }
  | { type: 'agent_done'; agent: AgentId; summary: string }
  | { type: 'result'; result: AnalysisResult }
  | { type: 'error'; agent?: AgentId; message: string }
