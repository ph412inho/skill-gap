import { NextRequest, NextResponse } from 'next/server'
import { getResult } from '@/lib/store/runs'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ runId: string }> },
) {
  const { runId } = await params
  const result = getResult(runId)
  if (!result) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Run result not found' } },
      { status: 404 },
    )
  }
  return NextResponse.json({ result })
}
