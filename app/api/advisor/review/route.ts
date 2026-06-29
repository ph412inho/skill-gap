import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'
import { applyReview } from '@/lib/loop/applyReview'
import type { ReviewInput } from '@/lib/loop/applyReview'

// Apply an advisor decision (B2). Default-deny on missing advisor identity.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<ReviewInput>
  if (!body.assessmentId || !body.advisorId || !body.action) {
    return NextResponse.json({ error: { code: 'INVALID_INPUT', message: 'ข้อมูลไม่ครบ' } }, { status: 400 })
  }

  const store = getStore()
  const result = await applyReview(store, {
    assessmentId: body.assessmentId,
    advisorId: body.advisorId,
    action: body.action,
    targetSkillId: body.targetSkillId,
    targetScoreId: body.targetScoreId,
    overrideValue: body.overrideValue,
    note: body.note ?? '',
  })

  if (!result.ok) {
    return NextResponse.json({ error: { code: 'REVIEW_FAILED', message: result.error } }, { status: 400 })
  }
  return NextResponse.json({ review: result.review })
}
