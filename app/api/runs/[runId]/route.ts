import { NextRequest, NextResponse } from 'next/server'
import { getResult } from '@/lib/store/runs'

export async function GET(
  _req: NextRequest,
  { params }: { params: { runId: string } },
) {
  const result = getResult(params.runId)
  if (!result) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Run result not found' } },
      { status: 404 },
    )
  }
  return NextResponse.json({ result })
}
