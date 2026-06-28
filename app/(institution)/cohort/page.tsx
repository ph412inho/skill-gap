'use client'
import Link from 'next/link'
import { RoleSwitcher } from '@/components/shared/RoleSwitcher'
import { GapByProgramChart } from '@/components/cohort/GapByProgramChart'
import { InterventionCard } from '@/components/cohort/InterventionCard'
import { COHORT_DATA_GAP_SCENARIO } from '@/lib/fixtures/scenarios/cohort-data-gap'

const insight = COHORT_DATA_GAP_SCENARIO.facts.cohort!

export default function CohortPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/40 hover:text-white transition-colors text-sm">← กลับ</Link>
          <span className="text-white/20">/</span>
          <span className="text-xl">🏫</span>
          <span className="font-bold text-white">Cohort Dashboard</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50 border border-white/10">
            {insight.cohortLabel}
          </span>
        </div>
        <RoleSwitcher />
      </nav>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {/* PDPA notice */}
        <div className="mb-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/40">
          <span>🔒</span>
          ข้อมูลนี้เป็น cohort-level aggregates — ไม่มีข้อมูลระบุตัวตนนักศึกษารายบุคคล (PDPA §24)
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'นักศึกษาทั้งหมด', value: insight.totalStudents.toString(), icon: '👥' },
            { label: 'ช่องว่างหลัก', value: `${insight.topGaps.length} ทักษะ`, icon: '📊' },
            {
              label: `${insight.topGaps[0]?.skillLabel ?? 'Data'} — gap สูงสุด`,
              value: `${Math.round((insight.topGaps[0]?.affectedPct ?? 0) * 100)}%`,
              icon: '⚠️',
              highlight: true,
            },
          ].map(k => (
            <div key={k.label} className={`p-4 rounded-2xl border ${k.highlight ? 'border-amber-500/30 bg-amber-500/10' : 'border-white/10 bg-white/3'}`}>
              <div className="text-2xl mb-1">{k.icon}</div>
              <div className={`text-2xl font-bold ${k.highlight ? 'text-amber-300' : 'text-white'}`}>{k.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gap chart */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/3">
            <h2 className="font-semibold text-white mb-1">Gap by Skill</h2>
            <p className="text-xs text-white/40 mb-4">% นักศึกษาที่มี evidence gap ในทักษะนี้</p>
            <GapByProgramChart gaps={insight.topGaps} />
          </div>

          {/* Interventions */}
          <div>
            <h2 className="font-semibold text-white mb-1">Recommended Interventions</h2>
            <p className="text-xs text-white/40 mb-4">แผนเสริมศักยภาพที่แนะนำโดยระบบ</p>
            <div className="space-y-3">
              {insight.recommendedInterventions.map(iv => (
                <InterventionCard key={iv.id} intervention={iv} />
              ))}
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <p className="mt-8 text-xs text-white/20 text-right">
          อัปเดตล่าสุด: {new Date(insight.reportedAt).toLocaleDateString('th-TH', { dateStyle: 'medium' })}
        </p>
      </div>
    </div>
  )
}
