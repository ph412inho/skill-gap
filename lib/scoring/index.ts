import type { Skill } from '@/lib/domain/evidence'
import type { RoleRequirement } from '@/lib/domain/role'
import type { ScoreId, Score } from '@/lib/domain/scores'
import type { ActionPlan } from '@/lib/domain/plan'
import { roleReadiness }    from './roleReadiness'
import { evidenceStrength } from './evidenceStrength'
import { skillGapSeverity } from './skillGapSeverity'
import { resilience }       from './resilience'
import { actionability }    from './actionability'

export { classifyEvidence } from './classifyEvidence'
export type { ClassifyInput } from './classifyEvidence'
export { roleReadiness }     from './roleReadiness'
export { evidenceStrength }  from './evidenceStrength'
export { skillGapSeverity }  from './skillGapSeverity'
export { resilience }        from './resilience'
export { actionability }     from './actionability'
export { STATUS_WEIGHTS, EVIDENCE_QUALITY_WEIGHTS, fmt } from './constants'

// Compute all 5 deterministic scores in one call.
// The orchestrator calls this over scripted FACTS — the LLM never produces scores directly.
export function computeAllScores(
  skills: Skill[],
  requirements: RoleRequirement[],
  plan: ActionPlan,
): Record<ScoreId, Score> {
  return {
    role_readiness:     roleReadiness(skills, requirements),
    evidence_strength:  evidenceStrength(skills),
    skill_gap_severity: skillGapSeverity(skills, requirements),
    resilience:         resilience(skills),
    actionability:      actionability(plan),
  }
}
