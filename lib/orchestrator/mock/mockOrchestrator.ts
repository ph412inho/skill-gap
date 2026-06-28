import type { AgentEvent } from '@/lib/domain/events'
import type { Skill } from '@/lib/domain/evidence'
import { AGENT_PIPELINE } from '@/lib/domain/agents'
import { computeAllScores } from '@/lib/scoring'
import type { AnalyzeRequest, Orchestrator } from '../types'
import { makeTiming, sleep } from './timing'
import { getScenario, Y4_BA_SCENARIO } from '@/lib/fixtures'

const AGENT_TITLES: Record<typeof AGENT_PIPELINE[number], string> = {
  profile_analyzer:    '📄 Profile Analyzer — อ่านและแยก Skills',
  evidence_verifier:   '🔍 Evidence Verifier — ตรวจสอบหลักฐาน',
  role_fit:            '🎯 Role Fit — เทียบกับตำแหน่งเป้าหมาย',
  skill_gap:           '📊 Skill Gap — วิเคราะห์ช่องว่าง',
  resilience:          '🛡 Resilience — ความคงทนของทักษะ',
  action_plan:         '📝 Action Plan — แผน 2 สัปดาห์',
  critic:              '⚖️ Critic / Guardrail — ตรวจสอบความถูกต้อง',
  institution_insight: '🏫 Institution Insight — Cohort Overview',
}

export class MockOrchestrator implements Orchestrator {
  async *run(req: AnalyzeRequest): AsyncIterable<AgentEvent> {
    const timing = makeTiming(req.runId.charCodeAt(0) + (req.scenarioId?.charCodeAt(0) ?? 42))
    // Paste mode in mock: fall back to the hero scenario so the demo never errors
    const scenario = getScenario(req.scenarioId) ?? Y4_BA_SCENARIO

    yield { type: 'run_started', runId: req.runId, pipeline: AGENT_PIPELINE }

    for (const agent of AGENT_PIPELINE) {
      yield { type: 'agent_started', agent, title: AGENT_TITLES[agent] }

      const captions = scenario.captions[agent] ?? []
      for (const note of captions) {
        await sleep(timing.captionDelay())
        yield { type: 'agent_progress', agent, note }
      }

      // Emit relevant partials at the right pipeline stage
      if (agent === 'evidence_verifier') {
        await sleep(timing.captionDelay())
        yield { type: 'agent_partial', agent, payload: { kind: 'skills', skills: scenario.facts.skills } }
      }

      if (agent === 'role_fit') {
        const matched = scenario.facts.skills
          .filter(s => ['verified_skill', 'partial_skill'].includes(s.status))
          .map(s => s.id)
        await sleep(timing.captionDelay())
        yield { type: 'agent_partial', agent, payload: { kind: 'role_match', requirements: scenario.facts.requirements, matched } }
      }

      if (agent === 'skill_gap') {
        await sleep(timing.captionDelay())
        yield { type: 'agent_partial', agent, payload: { kind: 'gaps', top: scenario.facts.gaps } }
      }

      // Critic emits flags if the scenario has any
      if (agent === 'critic') {
        for (const flag of scenario.flags) {
          await sleep(timing.captionDelay())
          yield { type: 'agent_flagged', agent, flag }
        }
      }

      await sleep(timing.agentDwell())
      yield { type: 'agent_done', agent, summary: captions[captions.length - 1] ?? 'เสร็จสิ้น' }
    }

    // Compute all scores from the scripted FACTS — never hardcoded
    const scores = computeAllScores(
      scenario.facts.skills,
      scenario.facts.requirements,
      scenario.facts.plan,
    )

    // Emit each score as a partial so dashboard updates progressively
    for (const score of Object.values(scores)) {
      yield { type: 'agent_partial', agent: 'resilience', payload: { kind: 'score', score } }
    }

    const result = {
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

    yield { type: 'result', result }
  }
}
