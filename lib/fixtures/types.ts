import type { Skill } from '@/lib/domain/evidence'
import type { RoleRequirement, RankedGap } from '@/lib/domain/role'
import type { ActionPlan } from '@/lib/domain/plan'
import type { CohortInsight } from '@/lib/domain/cohort'
import type { GuardrailFlag } from '@/lib/domain/guardrail'
import type { AgentId } from '@/lib/domain/agents'
import type { RawInput } from '@/lib/domain/profile'

export interface ScriptedFacts {
  skills: Skill[]
  requirements: RoleRequirement[]
  gaps: RankedGap[]
  plan: ActionPlan
  cohort?: CohortInsight
}

export interface Scenario {
  id: string
  title: string
  titleTh: string
  surface: 'student' | 'cohort'
  input: RawInput
  targetRoleId: string
  // Captions shown in the progress rail — per agent, in order.
  // Scores are NEVER stored here; they are computed by lib/scoring.
  captions: Partial<Record<AgentId, string[]>>
  facts: ScriptedFacts
  flags: GuardrailFlag[]
}
