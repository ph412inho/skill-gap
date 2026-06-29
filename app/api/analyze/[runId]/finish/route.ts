import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'
import { getDemoMode } from '@/lib/config/demoMode'
import { buildScenarioResult } from '@/lib/orchestrator/mock/buildResult'
import { persistAssessment } from '@/lib/loop/persistAssessment'

// Skip / fast-forward (E1): produce the final result immediately instead of watching
// the full pipeline. Mock only — a live LLM run can't be fast-forwarded. Idempotent:
// if the result already exists (e.g. the stream finished), just return it.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ runId: string }> },
) {
  const { runId } = await params
  const store = getStore()
  const run = await store.getActiveRun(runId)
  if (!run) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Run not found' } }, { status: 404 })
  }

  let result = await store.getResult(runId)
  if (!result) {
    if (getDemoMode() !== 'mock') {
      return NextResponse.json({ error: { code: 'SKIP_UNAVAILABLE', message: 'ข้ามไม่ได้ในโหมด live' } }, { status: 400 })
    }
    result = buildScenarioResult(run)
    await store.storeResult(runId, result)
    await persistAssessment(store, {
      studentId: run.consent.studentId, runId, targetRoleId: run.targetRoleId, result,
    })
  }
  return NextResponse.json({ result })
}
