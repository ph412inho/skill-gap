import type { Scenario } from './types'
import { Y4_BA_SCENARIO } from './scenarios/y4-business-ba'
import { GAMING_UNVERIFIED_SCENARIO } from './scenarios/gaming-unverified'
import { COHORT_DATA_GAP_SCENARIO } from './scenarios/cohort-data-gap'
import { PM_REENTRY_SCENARIO } from './scenarios/pm-reentry'

export const SCENARIOS: Scenario[] = [
  Y4_BA_SCENARIO,
  GAMING_UNVERIFIED_SCENARIO,
  PM_REENTRY_SCENARIO,
  COHORT_DATA_GAP_SCENARIO,
]

export function getScenario(id: string | null): Scenario | null {
  if (!id) return null
  return SCENARIOS.find(s => s.id === id) ?? null
}

export { Y4_BA_SCENARIO, GAMING_UNVERIFIED_SCENARIO, COHORT_DATA_GAP_SCENARIO, PM_REENTRY_SCENARIO }
export type { Scenario, ScriptedFacts } from './types'
