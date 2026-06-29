import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ runId: string }> },
) {
  const { runId } = await params
  const result = await getStore().getResult(runId)
  if (!result) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Run result not found' } },
      { status: 404 },
    )
  }
  return NextResponse.json({ result })
}
