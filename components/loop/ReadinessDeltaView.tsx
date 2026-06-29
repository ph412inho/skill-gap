'use client'
// The before→after "money shot" (A3). Shows that the loop MOVED the student's
// readiness — earned by proof, explained, not asserted. No employment claims.

import { SCORE_META } from '@/components/scores/ScoreCard'
import { EvidenceBadge } from '@/components/evidence/EvidenceBadge'
import { ConfidenceCone } from '@/components/scores/ConfidenceCone'
import type { ReadinessDelta } from '@/lib/domain/loop'
import type { Score, ScoreId } from '@/lib/domain/scores'

const SCORE_ORDER: ScoreId[] = ['role_readiness', 'evidence_strength', 'skill_gap_severity', 'resilience', 'actionability']
const pct = (v: number) => `${Math.round(v * 100)}%`

interface Props {
  delta: ReadinessDelta
  beforeScores: Record<ScoreId, Score>
  afterScores: Record<ScoreId, Score>
}

export function ReadinessDeltaView({ delta, beforeScores, afterScores }: Props) {
  const rr = delta.scoreDeltas.find(d => d.id === 'role_readiness')
  const rrPct = rr ? Math.round(rr.delta * 100) : 0
  const afterResilience = afterScores.resilience

  return (
    <div className="space-y-6">
      {/* ── Hero: readiness moved ─────────────────────────────────────────── */}
      <div className="rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-600/15 to-violet-600/10 p-6 sm:p-8">
        <p className="text-xs font-semibold text-brand-300 uppercase tracking-wider mb-4">ความพร้อมของคุณ — ก่อน → หลัง</p>
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          {rr && (
            <>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white/40">{pct(rr.before)}</div>
                <div className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">baseline</div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl text-brand-300">→</span>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">{pct(rr.after)}</div>
                <div className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">ตอนนี้</div>
              </div>
              {rrPct > 0 && (
                <div className="ml-auto text-center">
                  <div className="inline-flex items-center gap-1 text-2xl sm:text-3xl font-bold text-green-400">▲ {rrPct}%</div>
                  <div className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">Role Readiness</div>
                </div>
              )}
            </>
          )}
        </div>
        {afterResilience?.confidenceInterval && (
          <div className="mt-4 max-w-xs">
            <ConfidenceCone value={afterResilience.value} interval={afterResilience.confidenceInterval} />
          </div>
        )}
        <p className="mt-5 text-sm text-white/70 leading-relaxed">{delta.summary}</p>
        <p className="mt-2 text-[11px] text-white/35">
          ยืนยันหลักฐานแล้ว {delta.proofsVerified}/{delta.proofsTotal} · คะแนนนี้วัด “ความพร้อมด้านทักษะ” ไม่ใช่การทำนายการได้งาน
        </p>
      </div>

      {/* ── Per-score before→after ────────────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">คะแนนทั้งหมด</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SCORE_ORDER.map(id => {
            const d = delta.scoreDeltas.find(x => x.id === id)
            if (!d) return null
            const meta = SCORE_META[id]
            const moved = Math.round(d.delta * 100)
            // skill_gap_severity is "lower is better": a drop is good.
            const good = id === 'skill_gap_severity' ? d.delta < 0 : d.delta > 0
            return (
              <div key={id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-white/40 font-medium mb-2">{meta.labelTh}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-white/40">{pct(d.before)}</span>
                  <span className="text-white/30">→</span>
                  <span className={`text-xl font-bold bg-gradient-to-br ${meta.color} bg-clip-text text-transparent`}>{pct(d.after)}</span>
                  {moved !== 0 && (
                    <span className={`ml-auto text-xs font-medium ${good ? 'text-green-400' : 'text-amber-300'}`}>
                      {moved > 0 ? '▲' : '▼'} {Math.abs(moved)}%
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Skills that flipped (the evidence that was closed) ─────────────── */}
      {delta.skillFlips.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            ทักษะที่ปิดช่องว่างหลักฐาน ({delta.skillFlips.length})
          </h3>
          <div className="space-y-2">
            {delta.skillFlips.map(f => (
              <div key={f.skillId} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 flex-wrap">
                <span className="text-sm text-white/80 font-medium">{f.label}</span>
                <div className="flex items-center gap-2 ml-auto">
                  <EvidenceBadge status={f.from} />
                  <span className="text-white/30">→</span>
                  <EvidenceBadge status={f.to} />
                </div>
                <span className="text-[10px] text-white/30 w-full sm:w-auto">
                  {f.drivenBy === 'advisor' ? 'ยืนยันโดยที่ปรึกษา' : 'ยืนยันอัตโนมัติจากหลักฐาน'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
