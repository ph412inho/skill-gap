import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'
import { computeDelta } from '@/lib/loop/computeDelta'

// The before→after for a student: baseline (v1) vs latest assessment, with the delta
// that proves the loop moved the needle. Read-only; anonymized to the student themselves.
export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get('studentId')
  if (!studentId) return NextResponse.json({ error: { code: 'INVALID_INPUT', message: 'ต้องระบุ studentId' } }, { status: 400 })

  const store = getStore()
  const assessments = await store.listAssessmentsByStudent(studentId)
  if (assessments.length === 0) return NextResponse.json({ hasDelta: false })

  const baseline = assessments[0]
  const latest = assessments[assessments.length - 1]
  if (latest.version === baseline.version) {
    // Only a baseline so far — no re-assessment yet.
    return NextResponse.json({ hasDelta: false, baselineRunId: baseline.runId })
  }

  const [proofs, reviews] = await Promise.all([
    store.listProofsByAssessment(baseline.id),
    store.listReviewsByAssessment(baseline.id),
  ])
  const advisorVerified = new Set(
    reviews.filter(r => r.action === 'verify_evidence' && r.targetSkillId).map(r => r.targetSkillId!),
  )
  const delta = computeDelta(baseline, latest, proofs, advisorVerified)

  return NextResponse.json({
    hasDelta: true,
    delta,
    targetRoleId: latest.targetRoleId,
    baselineRunId: baseline.runId,
    beforeScores: baseline.result.scores,
    afterScores: latest.result.scores,
  })
}
