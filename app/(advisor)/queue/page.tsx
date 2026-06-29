'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EmptyState } from '@/components/shared/EmptyState'
import type { GuardrailFlag } from '@/lib/domain/guardrail'

interface QueueItem {
  assessmentId: string
  studentId: string
  studentName: string
  programLabel: string | null
  targetRoleId: string
  version: number
  createdAt: string
  flags: GuardrailFlag[]
  pendingProofs: number
}

const ROLE_LABELS: Record<string, string> = {
  'business-analyst': 'Business Analyst', 'product-manager': 'Product Manager',
  'data-analyst': 'Data Analyst', 'ux-designer': 'UX Designer',
}

export default function AdvisorQueuePage() {
  const [items, setItems] = useState<QueueItem[] | null>(null)

  useEffect(() => {
    fetch('/api/advisor/queue').then(r => r.json()).then(d => setItems(d.items ?? [])).catch(() => setItems([]))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/8">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧑‍🏫</span>
          <span className="font-bold text-white">Advisor Queue</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-600/20 text-amber-300 border border-amber-500/30 ml-1">human-in-the-loop</span>
        </div>
        <Link href="/" className="text-white/40 hover:text-white transition-colors text-sm">← หน้าแรก</Link>
      </nav>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">รายการรอตรวจสอบ</h1>
            <p className="text-sm text-white/40 mt-1">
              ผลที่มี guardrail flag หรือหลักฐานที่ระบบยืนยันอัตโนมัติไม่ได้ — รอการยืนยันจากที่ปรึกษา
            </p>
          </div>

          {items === null ? (
            <div className="flex items-center justify-center h-40 text-white/30 text-sm">กำลังโหลด…</div>
          ) : items.length === 0 ? (
            <EmptyState icon="✅" titleTh="ไม่มีรายการรอตรวจสอบ" descTh="ทุกผลผ่าน guardrail และหลักฐานถูกยืนยันแล้ว" />
          ) : (
            <div className="space-y-3">
              {items.map(item => {
                const hasVeto = item.flags.some(f => f.severity === 'veto')
                return (
                  <Link
                    key={item.assessmentId}
                    href={`/review/${item.assessmentId}`}
                    className="block p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/20 flex items-center justify-center text-lg shrink-0">🎓</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{item.studentName}</p>
                        <p className="text-xs text-white/40">{item.programLabel ?? '—'} · → {ROLE_LABELS[item.targetRoleId] ?? item.targetRoleId} · v{item.version}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.pendingProofs > 0 && (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            {item.pendingProofs} หลักฐานรอตรวจ
                          </span>
                        )}
                        {item.flags.length > 0 && (
                          <span className={`text-[10px] px-2 py-1 rounded-full border ${hasVeto ? 'bg-red-500/15 text-red-300 border-red-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'}`}>
                            {hasVeto ? '🚨' : '⚠️'} {item.flags.length} flag
                          </span>
                        )}
                        <span className="text-white/30">→</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
