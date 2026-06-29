import { describe, it, expect } from 'vitest'
import { reassess } from '@/lib/loop/reassess'
import { computeDelta } from '@/lib/loop/computeDelta'
import { computeAllScores } from '@/lib/scoring'
import { Y4_BA_SCENARIO } from '@/lib/fixtures'
import type { AnalysisResult } from '@/lib/domain/analysis'
import type { Assessment, Proof } from '@/lib/domain/loop'

const facts = Y4_BA_SCENARIO.facts

function baselineResult(): AnalysisResult {
  return {
    runId: 'run-1', scenarioId: 'y4-business-ba',
    profile: { studentId: 's1', rawSummary: '', skillClaims: [] },
    skills: facts.skills,
    scores: computeAllScores(facts.skills, facts.requirements, facts.plan),
    plan: facts.plan,
    flags: [],
  }
}

const asAssessment = (result: AnalysisResult, id: string, version: number, parentId: string | null): Assessment => ({
  id, studentId: 's1', runId: result.runId, version, parentId,
  targetRoleId: 'business-analyst', result, createdAt: '2026-06-30T00:00:00.000Z',
})

describe('reassess (deterministic re-scoring from verified proofs)', () => {
  it('flips the evidence status of skills with verified proof', () => {
    const before = baselineResult()
    const after = reassess(before, new Set(['sql-database', 'data-analysis']), facts.requirements)
    const sql = after.skills.find(s => s.id === 'sql-database')!
    const data = after.skills.find(s => s.id === 'data-analysis')!
    expect(sql.status).toBe('verified_skill')   // was unverified_claim
    expect(data.status).toBe('verified_skill')  // was evidence_gap
  })

  it('raises Role Readiness and Evidence Strength, lowers Skill Gap', () => {
    const before = baselineResult()
    const after = reassess(before, new Set(['sql-database', 'data-analysis']), facts.requirements)
    expect(after.scores.role_readiness.value).toBeGreaterThan(before.scores.role_readiness.value)
    expect(after.scores.evidence_strength.value).toBeGreaterThan(before.scores.evidence_strength.value)
    expect(after.scores.skill_gap_severity.value).toBeLessThan(before.scores.skill_gap_severity.value)
  })

  it('leaves untouched skills exactly as they were', () => {
    const before = baselineResult()
    const after = reassess(before, new Set(['sql-database']), facts.requirements)
    const beforeStakeholder = before.skills.find(s => s.id === 'stakeholder-communication')!
    const afterStakeholder = after.skills.find(s => s.id === 'stakeholder-communication')!
    expect(afterStakeholder).toEqual(beforeStakeholder)
  })
})

describe('computeDelta', () => {
  it('reports the score movement and the skills that flipped', () => {
    const before = baselineResult()
    const afterResult = reassess(before, new Set(['sql-database', 'data-analysis']), facts.requirements)
    const v1 = asAssessment(before, 'a1', 1, null)
    const v2 = asAssessment(afterResult, 'a2', 2, 'a1')
    const proofs: Proof[] = [
      { id: 'p1', assessmentId: 'a1', actionItemId: 'task-001', skillId: 'sql-database', proofType: 'github_repo', source: 'link', url: 'https://github.com/x/y', state: 'verified', submittedAt: '2026-06-30T00:00:00.000Z' },
      { id: 'p2', assessmentId: 'a1', actionItemId: 'task-002', skillId: 'data-analysis', proofType: 'pdf_writeup', source: 'link', url: 'https://github.com/x/z', state: 'verified', submittedAt: '2026-06-30T00:00:00.000Z' },
    ]
    const delta = computeDelta(v1, v2, proofs)

    const rr = delta.scoreDeltas.find(d => d.id === 'role_readiness')!
    expect(rr.delta).toBeGreaterThan(0)
    expect(delta.proofsVerified).toBe(2)
    expect(delta.skillFlips.map(f => f.skillId).sort()).toEqual(['data-analysis', 'sql-database'])
    const sqlFlip = delta.skillFlips.find(f => f.skillId === 'sql-database')!
    expect(sqlFlip.from).toBe('unverified_claim')
    expect(sqlFlip.to).toBe('verified_skill')
    expect(sqlFlip.proofId).toBe('p1')
  })
})
