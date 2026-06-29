import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'

// Everything an advisor needs to review one assessment: the snapshot, the proofs
// (esp. those awaiting review), and the prior reviews.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> },
) {
  const { assessmentId } = await params
  const store = getStore()
  const assessment = await store.getAssessment(assessmentId)
  if (!assessment) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'ไม่พบผลการประเมิน' } }, { status: 404 })
  }
  const [proofs, reviews] = await Promise.all([
    store.listProofsByAssessment(assessmentId),
    store.listReviewsByAssessment(assessmentId),
  ])
  return NextResponse.json({ assessment, proofs, reviews })
}
