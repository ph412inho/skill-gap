import type { Skill } from './evidence'
import type { Score, ScoreId } from './scores'
import type { ParsedProfile } from './profile'
import type { ActionPlan } from './plan'
import type { CohortInsight } from './cohort'
import type { GuardrailFlag } from './guardrail'

export interface AnalysisResult {
  runId: string
  scenarioId: string | null    // null = "paste your own"
  profile: ParsedProfile
  skills: Skill[]
  scores: Record<ScoreId, Score>
  plan: ActionPlan
  flags: GuardrailFlag[]       // non-empty → advisor queue + visible flag on dashboard
  cohort?: CohortInsight       // present for institution surface
}
