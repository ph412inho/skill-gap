import { NextResponse } from 'next/server'
import { SCENARIOS } from '@/lib/fixtures'

export async function GET() {
  const list = SCENARIOS.map(s => ({
    id: s.id,
    title: s.title,
    titleTh: s.titleTh,
    surface: s.surface,
  }))
  return NextResponse.json({ scenarios: list })
}
