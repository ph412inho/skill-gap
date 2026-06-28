import { describe, it, expect } from 'vitest'
import { classifyEvidence } from '../classifyEvidence'
import type { EvidenceRef } from '@/lib/domain/evidence'

const project:    EvidenceRef = { kind: 'project',    label: 'P1', excerpt: 'Led the project' }
const transcript: EvidenceRef = { kind: 'transcript', label: 'T1', excerpt: 'Grade A' }
const workSample: EvidenceRef = { kind: 'work_sample',label: 'W1' }
const cert:       EvidenceRef = { kind: 'certificate',label: 'C1' }
const advisor:    EvidenceRef = { kind: 'advisor',    label: 'A1', excerpt: 'Validated by advisor' }
const selfReport: EvidenceRef = { kind: 'self_report',label: 'SR' }

describe('classifyEvidence — key invariant', () => {
  it('never returns verified_skill with zero refs', () => {
    const result = classifyEvidence({ claimed: true, evidenceRefs: [], requiredByRole: true })
    expect(result).not.toBe('verified_skill')
    expect(result).not.toBe('partial_skill')
    expect(result).toBe('unverified_claim')
  })

  it('never returns verified_skill with only self_report refs', () => {
    const result = classifyEvidence({ claimed: true, evidenceRefs: [selfReport, selfReport], requiredByRole: true })
    expect(result).not.toBe('verified_skill')
    expect(result).toBe('weak_evidence')
  })
})

describe('classifyEvidence — happy paths', () => {
  it('verified_skill with 2+ substantive refs', () => {
    expect(classifyEvidence({ claimed: true, evidenceRefs: [project, transcript], requiredByRole: true }))
      .toBe('verified_skill')
  })

  it('verified_skill with work_sample + advisor', () => {
    expect(classifyEvidence({ claimed: true, evidenceRefs: [workSample, advisor], requiredByRole: true }))
      .toBe('verified_skill')
  })

  it('low_durability_skill when durability < 0.35 and 2+ refs', () => {
    expect(classifyEvidence({ claimed: true, evidenceRefs: [cert, project], requiredByRole: true, durability: 0.20 }))
      .toBe('low_durability_skill')
  })

  it('does NOT return low_durability when durability is undefined', () => {
    expect(classifyEvidence({ claimed: true, evidenceRefs: [cert, project], requiredByRole: true }))
      .toBe('verified_skill')
  })

  it('partial_skill with exactly 1 substantive ref', () => {
    expect(classifyEvidence({ claimed: true, evidenceRefs: [project], requiredByRole: true }))
      .toBe('partial_skill')
  })

  it('partial_skill with 1 substantive + 1 self_report', () => {
    expect(classifyEvidence({ claimed: true, evidenceRefs: [transcript, selfReport], requiredByRole: true }))
      .toBe('partial_skill')
  })

  it('weak_evidence with only self_report refs (1)', () => {
    expect(classifyEvidence({ claimed: true, evidenceRefs: [selfReport], requiredByRole: true }))
      .toBe('weak_evidence')
  })

  it('unverified_claim when claimed but no refs', () => {
    expect(classifyEvidence({ claimed: true, evidenceRefs: [], requiredByRole: true }))
      .toBe('unverified_claim')
  })

  it('skill_gap when not claimed', () => {
    expect(classifyEvidence({ claimed: false, evidenceRefs: [], requiredByRole: true }))
      .toBe('skill_gap')
  })

  it('skill_gap even when not required but not claimed', () => {
    expect(classifyEvidence({ claimed: false, evidenceRefs: [], requiredByRole: false }))
      .toBe('skill_gap')
  })
})

describe('classifyEvidence — gaming detection', () => {
  it('returns unverified_claim for "Python/SQL/AI expert" with no evidence', () => {
    const result = classifyEvidence({ claimed: true, evidenceRefs: [], requiredByRole: true })
    expect(result).toBe('unverified_claim')
    expect(result).not.toBe('verified_skill')
    expect(result).not.toBe('partial_skill')
  })
})
