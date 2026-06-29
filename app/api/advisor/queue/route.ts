import { NextResponse } from 'next/server'
import { getStore } from '@/lib/store'

// The advisor queue (B1) — assessments with guardrail flags or proofs awaiting human
// review. RBAC note: an advisor reviewing their student sees identity by design; cohort
// aggregates stay anonymous (that boundary lives on the cohort endpoints).
export async function GET() {
  const store = getStore()
  const assessments = await store.listAdvisorQueue()

  const items = await Promise.all(
    assessments.map(async a => {
      const proofs = await store.listProofsByAssessment(a.id)
      return {
        assessmentId: a.id,
        studentId: a.studentId,
        studentName: a.result.profile.studentName ?? a.studentId.slice(0, 8),
        programLabel: a.result.profile.programLabel ?? null,
        targetRoleId: a.targetRoleId,
        version: a.version,
        createdAt: a.createdAt,
        flags: a.result.flags,
        pendingProofs: proofs.filter(p => p.state === 'needs_advisor').length,
      }
    }),
  )

  return NextResponse.json({ items })
}
