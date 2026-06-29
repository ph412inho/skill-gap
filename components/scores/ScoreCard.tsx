'use client'
import { useState } from 'react'
import type { Score, ScoreId } from '@/lib/domain/scores'
import { XaiTraceDrawer } from './XaiTraceDrawer'
import { ConfidenceCone } from './ConfidenceCone'

export const SCORE_META: Record<ScoreId, { labelTh: string; descTh: string; color: string }> = {
  role_readiness:     { labelTh: 'Role Readiness',    descTh: 'ความพร้อมสำหรับตำแหน่งเป้าหมาย',  color: 'from-brand-500 to-brand-600' },
  evidence_strength:  { labelTh: 'Evidence Strength', descTh: 'สัดส่วนทักษะที่มีหลักฐานสนับสนุน', color: 'from-green-500 to-green-600' },
  skill_gap_severity: { labelTh: 'Skill Gap',         descTh: 'ช่องว่างทักษะที่ต้องพัฒนา',        color: 'from-amber-500 to-amber-600' },
  resilience:         { labelTh: 'Resilience',         descTh: 'ความคงทนของทักษะในอนาคต',          color: 'from-violet-500 to-violet-600' },
  actionability:      { labelTh: 'Actionability',      descTh: 'แผนที่ทำได้จริงใน 2 สัปดาห์',     color: 'from-cyan-500 to-cyan-600' },
}

interface ScoreCardProps {
  score: Score
}

export function ScoreCard({ score }: ScoreCardProps) {
  const [showTrace, setShowTrace] = useState(false)
  const meta = SCORE_META[score.id]

  return (
    <>
      <button
        onClick={() => setShowTrace(true)}
        className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all duration-200 text-left group animate-fade-in"
        title="คลิกเพื่อดูรายละเอียด (XAI)"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-white/40 font-medium mb-0.5">{meta.labelTh}</p>
            <p className="text-xs text-white/30">{meta.descTh}</p>
          </div>
          <div className={`text-2xl font-bold bg-gradient-to-br ${meta.color} bg-clip-text text-transparent`}>
            {score.display}
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="h-1 bg-white/8 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${meta.color} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: score.id === 'skill_gap_severity' ? `${(1 - score.value) * 100}%` : `${score.value * 100}%` }}
          />
        </div>

        {/* Confidence interval for resilience */}
        {score.confidenceInterval && (
          <ConfidenceCone value={score.value} interval={score.confidenceInterval} />
        )}

        {score.lowConfidence && (
          <p className="text-[10px] text-amber-400 mt-2">⚑ ความมั่นใจต่ำ — ส่งให้ Advisor ตรวจสอบ</p>
        )}

        <p className="inline-flex items-center gap-1 text-[10px] text-brand-300/70 mt-2 group-hover:text-brand-300 transition-colors">
          <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-brand-400/40 text-[8px]">i</span>
          ทำไมถึงได้คะแนนนี้ →
        </p>
      </button>

      {showTrace && <XaiTraceDrawer score={score} onClose={() => setShowTrace(false)} />}
    </>
  )
}
