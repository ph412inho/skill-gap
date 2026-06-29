// The final AnalysisResult for a scenario, built deterministically from scripted facts.
// Shared by the streaming mock orchestrator (end of pipeline) and the /finish endpoint
// (skip / fast-forward), so both produce an identical result.

import { getScenario, Y4_BA_SCENARIO } from '@/lib/fixtures'
import { computeAllScores } from '@/lib/scoring'
import type { AnalyzeRequest } from '../types'
import type { AnalysisResult } from '@/lib/domain/analysis'

export function buildScenarioResult(req: AnalyzeRequest): AnalysisResult {
  const scenario = getScenario(req.scenarioId) ?? Y4_BA_SCENARIO
  const scores = computeAllScores(scenario.facts.skills, scenario.facts.requirements, scenario.facts.plan)
  return {
    runId: req.runId,
    scenarioId: req.scenarioId,
    profile: {
      studentId: req.consent.studentId,
      rawSummary: req.input.text ?? '',
      skillClaims: [],
    },
    skills: scenario.facts.skills,
    scores,
    plan: scenario.facts.plan,
    flags: scenario.flags,
    cohort: scenario.facts.cohort,
  }
}
