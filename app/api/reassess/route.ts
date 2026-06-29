import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'
import { hasAiConsent } from '@/lib/loop/consentGate'
import { reassess } from '@/lib/loop/reassess'
import { getScenario, Y4_BA_SCENARIO } from '@/lib/fixtures'
import type { Assessment } from '@/lib/domain/loop'

function err(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status })
}

// Re-score a student's baseline using the proofs they've earned, producing a new
// versioned assessment. Consent-gated (AI run), audited, logged to llm_runs.
export async function POST(req: NextRequest) {
  const { studentId, runId } = await req.json()
  if (!studentId || !runId) return err('INVALID_INPUT', 'ข้อมูลไม่ครบ', 400)

  const store = getStore()
  if (!(await hasAiConsent(store, studentId))) {
    return err('CONSENT_REQUIRED', 'ต้องให้ความยินยอมก่อน', 403)
  }

  const baseline = await store.getAssessmentByRun(runId)
  if (!baseline) return err('NOT_FOUND', 'ไม่พบผลการวิเคราะห์', 404)
  if (baseline.studentId !== studentId) return err('FORBIDDEN', 'ไม่มีสิทธิ์เข้าถึง', 403)

  const proofs = await store.listProofsByAssessment(baseline.id)
  const verifiedSkillIds = new Set(proofs.filter(p => p.state === 'verified').map(p => p.skillId))
  if (verifiedSkillIds.size === 0) {
    return err('NO_VERIFIED_PROOF', 'ยังไม่มีหลักฐานที่ยืนยันแล้ว — ส่งหลักฐานที่เชื่อถือได้ก่อน', 400)
  }

  const requirements =
    getScenario(baseline.result.scenarioId)?.facts.requirements ?? Y4_BA_SCENARIO.facts.requirements

  const newResult = reassess(baseline.result, verifiedSkillIds, requirements)

  const now = new Date().toISOString()
  const latest = await store.getLatestAssessment(studentId)
  const v2: Assessment = {
    id: crypto.randomUUID(),
    studentId,
    runId: 'reassess-' + crypto.randomUUID(),  // synthetic; proofs stay on the baseline run
    version: (latest?.version ?? 1) + 1,
    parentId: baseline.id,                       // always diff against the baseline
    targetRoleId: baseline.targetRoleId,
    result: newResult,
    createdAt: now,
  }
  await store.saveAssessment(v2)

  await store.appendAudit({
    id: crypto.randomUUID(), actorId: studentId, actorRole: 'student',
    action: 'reassessment_run', subjectId: v2.id,
    detail: `v${v2.version} · verified=${verifiedSkillIds.size}`, at: now,
  })
  await store.appendLlmRun({
    id: crypto.randomUUID(), runId: v2.runId, agent: 'role_fit',
    confidence: 0.9, flags: [], at: now,
  })

  return NextResponse.json({ assessmentId: v2.id, version: v2.version })
}
