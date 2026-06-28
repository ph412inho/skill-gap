import { describe, it, expect } from 'vitest'
import { roleReadiness, evidenceStrength, skillGapSeverity, resilience, actionability, computeAllScores } from '../index'
import { Y4_BA_SKILLS, Y4_BA_PLAN } from '@/lib/fixtures/scenarios/y4-business-ba'
import { BA_ROLE_REQUIREMENTS } from '@/lib/fixtures/taxonomy/roleRequirements'

// ─── Expected exact values (verified with hand calculation) ───────────────────
// role_readiness:    (0.85+0.80+0.75+0.55 + 0.80×0.6) / 5.50 = 3.43/5.50 ≈ 0.6236
// evidence_strength: (4×1.0 + 1×0.6) / 7 = 4.6/7 ≈ 0.6571
// skill_gap_severity:(0.90+0.85+0.80×0.4) / 5.50 = 2.07/5.50 ≈ 0.3764
// resilience:        avg([0.82,0.85,0.80,0.78,0.88]) = 4.13/5 = 0.826
// actionability:     4/4 = 1.0

const TOLERANCE = 0.0005  // allow tiny float rounding

describe('roleReadiness — y4-business-ba fixture', () => {
  it('produces ≈ 62% for the BA path', () => {
    const score = roleReadiness(Y4_BA_SKILLS, BA_ROLE_REQUIREMENTS)
    expect(score.id).toBe('role_readiness')
    expect(score.value).toBeCloseTo(3.43 / 5.50, 4)
    expect(score.display).toBe('62%')
    expect(score.lowConfidence).toBe(false)
  })

  it('has a trace with inputs and contributions', () => {
    const score = roleReadiness(Y4_BA_SKILLS, BA_ROLE_REQUIREMENTS)
    expect(score.trace.inputs.length).toBeGreaterThan(0)
    expect(score.trace.contributions.length).toBe(BA_ROLE_REQUIREMENTS.length)
    expect(score.trace.caveats.length).toBeGreaterThan(0)
  })

  it('returns 0 for a student with all unverified claims', () => {
    const gamingSkills = Y4_BA_SKILLS.map(s => ({ ...s, status: 'unverified_claim' as const, evidence: [] }))
    const score = roleReadiness(gamingSkills, BA_ROLE_REQUIREMENTS)
    expect(score.value).toBe(0)
    expect(score.display).toBe('0%')
  })
})

describe('evidenceStrength — y4-business-ba fixture', () => {
  it('produces ≈ 66% (4 verified + 1 partial out of 7 claimed)', () => {
    const score = evidenceStrength(Y4_BA_SKILLS)
    expect(score.id).toBe('evidence_strength')
    expect(score.value).toBeCloseTo(4.6 / 7, 4)
    expect(score.display).toBe('66%')
    expect(score.lowConfidence).toBe(false)
  })

  it('excludes skill_gap from "claimed" count', () => {
    // Add a skill_gap skill — should not appear in denominator
    const withGap = [...Y4_BA_SKILLS, {
      id: 'process-mapping', label: 'Process Mapping', status: 'skill_gap' as const,
      evidence: [], confidence: 0,
    }]
    const score = evidenceStrength(withGap)
    // denominator should still be 7 (claimed = non-skill_gap)
    expect(score.value).toBeCloseTo(4.6 / 7, 4)
  })

  it('returns 0% when all skills are unverified_claim', () => {
    const gamingSkills = Y4_BA_SKILLS.map(s => ({ ...s, status: 'unverified_claim' as const, evidence: [] }))
    const score = evidenceStrength(gamingSkills)
    expect(score.value).toBe(0)
    expect(score.display).toBe('0%')
    expect(score.lowConfidence).toBe(true)
  })
})

describe('skillGapSeverity — y4-business-ba fixture', () => {
  it('produces ≈ 38% overall gap', () => {
    const score = skillGapSeverity(Y4_BA_SKILLS, BA_ROLE_REQUIREMENTS)
    expect(score.id).toBe('skill_gap_severity')
    // gap: data-analysis(0.90×1.0) + sql(0.85×1.0) + requirements(0.80×0.4) = 2.07
    expect(score.value).toBeCloseTo(2.07 / 5.50, 4)
    expect(score.display).toBe('38%')
  })

  it('ranks data-analysis as the #1 gap (importance 0.90)', () => {
    const score = skillGapSeverity(Y4_BA_SKILLS, BA_ROLE_REQUIREMENTS)
    const [topGap] = score.trace.contributions
    expect(topGap.label).toBe('การวิเคราะห์ข้อมูล')
    expect(topGap.delta).toBeCloseTo(0.90, 4)
  })

  it('returns 0 when all skills are verified', () => {
    const allVerified = Y4_BA_SKILLS.map(s => ({ ...s, status: 'verified_skill' as const }))
    const score = skillGapSeverity(allVerified, BA_ROLE_REQUIREMENTS)
    expect(score.value).toBe(0)
    expect(score.display).toBe('0%')
  })
})

describe('resilience — y4-business-ba fixture', () => {
  it('produces ≈ 83% (avg durability of 5 active skills)', () => {
    const score = resilience(Y4_BA_SKILLS)
    expect(score.id).toBe('resilience')
    // avg([0.82,0.85,0.80,0.78,0.88]) = 0.826
    expect(score.value).toBeCloseTo(0.826, 4)
    expect(score.display).toBe('83%')
    expect(score.lowConfidence).toBe(false)
  })

  it('always returns a confidenceInterval (never a bare number)', () => {
    const score = resilience(Y4_BA_SKILLS)
    expect(score.confidenceInterval).toBeDefined()
    const [lo, hi] = score.confidenceInterval!
    expect(lo).toBeLessThan(score.value)
    expect(hi).toBeGreaterThan(score.value)
  })

  it('CI bounds are within [0, 1]', () => {
    const score = resilience(Y4_BA_SKILLS)
    const [lo, hi] = score.confidenceInterval!
    expect(lo).toBeGreaterThanOrEqual(0)
    expect(hi).toBeLessThanOrEqual(1)
  })

  it('returns lowConfidence=true with fewer than 3 active skills', () => {
    const twoActive = Y4_BA_SKILLS.slice(0, 2)
    const score = resilience(twoActive)
    expect(score.lowConfidence).toBe(true)
  })

  it('returns lowConfidence=true for empty skills', () => {
    const score = resilience([])
    expect(score.lowConfidence).toBe(true)
    expect(score.confidenceInterval).toBeDefined()
  })
})

describe('actionability — y4-business-ba plan', () => {
  it('produces 100% (all 4 tasks are feasible)', () => {
    const score = actionability(Y4_BA_PLAN)
    expect(score.id).toBe('actionability')
    expect(score.value).toBe(1)
    expect(score.display).toBe('100%')
    expect(score.lowConfidence).toBe(false)
  })

  it('produces 0% for empty plan', () => {
    const emptyPlan = { ...Y4_BA_PLAN, tasks: [], totalDays: 0 }
    const score = actionability(emptyPlan)
    expect(score.value).toBe(0)
  })

  it('handles mixed feasibility', () => {
    const mixedPlan = {
      ...Y4_BA_PLAN,
      tasks: [
        { ...Y4_BA_PLAN.tasks[0], feasible: true,  durationDays: 3 },
        { ...Y4_BA_PLAN.tasks[1], feasible: false, durationDays: 20 },
      ],
      totalDays: 23,
    }
    const score = actionability(mixedPlan)
    expect(score.value).toBe(0.5)
    expect(score.display).toBe('50%')
  })
})

describe('computeAllScores — integration', () => {
  it('returns all 5 score IDs', () => {
    const scores = computeAllScores(Y4_BA_SKILLS, BA_ROLE_REQUIREMENTS, Y4_BA_PLAN)
    const ids = Object.keys(scores)
    expect(ids).toContain('role_readiness')
    expect(ids).toContain('evidence_strength')
    expect(ids).toContain('skill_gap_severity')
    expect(ids).toContain('resilience')
    expect(ids).toContain('actionability')
    expect(ids).toHaveLength(5)
  })

  it('every score has a trace with at least one caveat', () => {
    const scores = computeAllScores(Y4_BA_SKILLS, BA_ROLE_REQUIREMENTS, Y4_BA_PLAN)
    for (const score of Object.values(scores)) {
      expect(score.trace.caveats.length, `${score.id} must have caveats`).toBeGreaterThan(0)
    }
  })
})
