import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'
import { hasAiConsent } from '@/lib/loop/consentGate'
import { verifyProof, type VerifyInput } from '@/lib/loop/verifyProof'
import type { Proof, ProofState, AuditAction } from '@/lib/domain/loop'

const STATE_FOR: Record<string, ProofState> = {
  auto_verified: 'verified',
  routed_to_advisor: 'needs_advisor',
  rejected: 'rejected',
}

const AUDIT_FOR: Record<string, AuditAction> = {
  auto_verified: 'evidence_auto_verified',
  routed_to_advisor: 'evidence_routed_to_advisor',
  rejected: 'evidence_routed_to_advisor',
}

function err(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { studentId, runId, actionItemId, skillId, proofType, source, url, filename } = body

  if (!studentId || !runId || !actionItemId || !skillId || !proofType || !source) {
    return err('INVALID_INPUT', 'ข้อมูลไม่ครบ', 400)
  }
  if (source === 'link' && !url) return err('INVALID_INPUT', 'ต้องมีลิงก์หลักฐาน', 400)

  const store = getStore()

  // Consent gate — verification is an AI run.
  if (!(await hasAiConsent(store, studentId))) {
    return err('CONSENT_REQUIRED', 'ต้องให้ความยินยอมก่อน', 403)
  }

  const assessment = await store.getAssessmentByRun(runId)
  if (!assessment) return err('NOT_FOUND', 'ไม่พบผลการวิเคราะห์', 404)
  // RBAC: a student may only attach proof to their own assessment (default deny).
  if (assessment.studentId !== studentId) return err('FORBIDDEN', 'ไม่มีสิทธิ์เข้าถึง', 403)

  const now = new Date().toISOString()
  const verification = verifyProof({ proofType, source, url, filename } as VerifyInput, now)
  const proofId = crypto.randomUUID()
  verification.proofId = proofId

  const proof: Proof = {
    id: proofId,
    assessmentId: assessment.id,
    actionItemId,
    skillId,
    proofType,
    source,
    url: url ?? undefined,
    filename: filename ?? undefined,
    state: STATE_FOR[verification.outcome],
    submittedAt: now,
    verification,
  }
  await store.saveProof(proof)

  await store.appendAudit({
    id: crypto.randomUUID(), actorId: studentId, actorRole: 'student',
    action: 'proof_submitted', subjectId: assessment.id,
    detail: `skill=${skillId} · ${source}`, at: now,
  })
  await store.appendAudit({
    id: crypto.randomUUID(), actorId: 'system', actorRole: 'system',
    action: AUDIT_FOR[verification.outcome], subjectId: assessment.id,
    detail: `proof=${proofId} · ${verification.outcome} · conf=${verification.confidence}`, at: now,
  })
  // AI run log (the evidence-verifier).
  await store.appendLlmRun({
    id: crypto.randomUUID(), runId, agent: 'evidence_verifier',
    confidence: verification.confidence,
    flags: verification.outcome === 'rejected' ? ['rejected'] : [],
    at: now,
  })

  return NextResponse.json({ proof })
}

// List proofs for a run's assessment (so the dashboard can render their state).
export async function GET(req: NextRequest) {
  const runId = req.nextUrl.searchParams.get('runId')
  if (!runId) return err('INVALID_INPUT', 'ต้องระบุ runId', 400)
  const store = getStore()
  const assessment = await store.getAssessmentByRun(runId)
  if (!assessment) return NextResponse.json({ proofs: [] })
  const proofs = await store.listProofsByAssessment(assessment.id)
  return NextResponse.json({ proofs })
}
