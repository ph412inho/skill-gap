import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'
import type { AnalyzeRequest } from '@/lib/orchestrator/types'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { scenarioId, targetRoleId, consent, input } = body

  // PDPA consent gate — refuse without explicit consent (api-conventions.md)
  if (!consent?.grantedAt || !consent?.purposes?.includes('ai_analysis')) {
    return NextResponse.json(
      { error: { code: 'CONSENT_REQUIRED', message: 'ต้องให้ความยินยอมก่อนเริ่มการวิเคราะห์ด้วย AI' } },
      { status: 403 },
    )
  }

  const runId = crypto.randomUUID()
  const analyzeReq: AnalyzeRequest = {
    runId,
    scenarioId: scenarioId ?? null,
    input: input ?? { kind: 'paste', targetRoleId: targetRoleId ?? 'business-analyst', text: '' },
    consent,
    targetRoleId: targetRoleId ?? 'business-analyst',
  }

  const store = getStore()
  await store.storeRun(analyzeReq)
  // Persist consent keyed by student so later AI runs (proof verify, re-assess) can gate on it.
  await store.saveConsent(consent)
  return NextResponse.json({ runId })
}
