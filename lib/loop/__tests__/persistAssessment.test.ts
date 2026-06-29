import { describe, it, expect } from 'vitest'
import { MemoryStore } from '@/lib/store/memoryStore'
import { persistAssessment } from '@/lib/loop/persistAssessment'
import type { AnalysisResult } from '@/lib/domain/analysis'

const result = (flags: AnalysisResult['flags'] = []): AnalysisResult =>
  ({ runId: 'r', scenarioId: null, profile: {}, skills: [], scores: {}, plan: {}, flags } as unknown as AnalysisResult)

// MemoryStore pins state to global (dev hot-reload), so it's a process singleton.
// Each test uses a unique studentId/runId to stay isolated.
const role = 'business-analyst'

describe('persistAssessment', () => {
  it('creates v1 baseline with no parent', async () => {
    const store = new MemoryStore()
    const a = await persistAssessment(store, { studentId: 's-base', runId: 'base-1', targetRoleId: role, result: result() })
    expect(a.version).toBe(1)
    expect(a.parentId).toBeNull()
  })

  it('chains v2 onto v1 as parent', async () => {
    const store = new MemoryStore()
    const v1 = await persistAssessment(store, { studentId: 's-chain', runId: 'chain-1', targetRoleId: role, result: result() })
    const v2 = await persistAssessment(store, { studentId: 's-chain', runId: 'chain-2', targetRoleId: role, result: result() })
    expect(v2.version).toBe(2)
    expect(v2.parentId).toBe(v1.id)
  })

  it('is idempotent per run (a re-streamed run does not duplicate)', async () => {
    const store = new MemoryStore()
    const first = await persistAssessment(store, { studentId: 's-idem', runId: 'idem-1', targetRoleId: role, result: result() })
    const again = await persistAssessment(store, { studentId: 's-idem', runId: 'idem-1', targetRoleId: role, result: result() })
    expect(again.id).toBe(first.id)
    expect(await store.listAssessmentsByStudent('s-idem')).toHaveLength(1)
  })

  it('writes a PDPA audit row for the assessment', async () => {
    const store = new MemoryStore()
    const a = await persistAssessment(store, { studentId: 's-audit', runId: 'audit-1', targetRoleId: role, result: result() })
    const audit = await store.listAudit(a.id)
    expect(audit).toHaveLength(1)
    expect(audit[0].action).toBe('analysis_run')
  })
})
