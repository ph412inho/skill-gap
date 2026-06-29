'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getStudentId } from '@/lib/client/studentId'
import { ReadinessDeltaView } from '@/components/loop/ReadinessDeltaView'
import { EmptyState } from '@/components/shared/EmptyState'
import type { ReadinessDelta } from '@/lib/domain/loop'
import type { Score, ScoreId } from '@/lib/domain/scores'

interface ProgressData {
  hasDelta: boolean
  delta?: ReadinessDelta
  beforeScores?: Record<ScoreId, Score>
  afterScores?: Record<ScoreId, Score>
  baselineRunId?: string
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sid = getStudentId()
    fetch(`/api/progress?studentId=${encodeURIComponent(sid)}`)
      .then(r => r.json())
      .then((d: ProgressData) => setData(d))
      .catch(() => setData({ hasDelta: false }))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/40 hover:text-white transition-colors text-sm">← หน้าแรก</Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/60">ความก้าวหน้า</span>
        </div>
        {data?.baselineRunId && (
          <Link href={`/dashboard/${data.baselineRunId}`} className="text-xs text-brand-300 hover:text-brand-200">← กลับไปที่แผน</Link>
        )}
      </nav>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-white/30">
              <div className="text-3xl mb-3 animate-pulse">📈</div>
              <p className="text-sm">กำลังโหลดความก้าวหน้า…</p>
            </div>
          ) : data?.hasDelta && data.delta && data.beforeScores && data.afterScores ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">ความก้าวหน้าของคุณ</h1>
                <p className="text-sm text-white/40 mt-1">หลักฐานที่คุณส่ง ทำให้ความพร้อมเปลี่ยนไปอย่างไร — และทำไม</p>
              </div>
              <ReadinessDeltaView delta={data.delta} beforeScores={data.beforeScores} afterScores={data.afterScores} />
            </>
          ) : (
            <div className="py-16">
              <EmptyState
                icon="📈"
                titleTh="ยังไม่มีความก้าวหน้าให้แสดง"
                descTh="ส่งหลักฐานในแผน 2 สัปดาห์ แล้วกด “ประเมินใหม่” เพื่อดูว่าความพร้อมของคุณขยับขึ้นอย่างไร"
                action={
                  data?.baselineRunId
                    ? <Link href={`/dashboard/${data.baselineRunId}`} className="inline-block px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-all">ไปที่แผนของฉัน →</Link>
                    : <Link href="/" className="inline-block px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-all">เริ่มวิเคราะห์ →</Link>
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
