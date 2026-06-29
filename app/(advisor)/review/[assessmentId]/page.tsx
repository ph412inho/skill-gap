'use client'
import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ScoreCard } from '@/components/scores/ScoreCard'
import { LowConfidenceFlag } from '@/components/shared/LowConfidenceFlag'
import { EvidenceBadge } from '@/components/evidence/EvidenceBadge'
import { getAdvisorId } from '@/lib/client/advisorId'
import type { Assessment, Proof, AdvisorReview, AdvisorAction } from '@/lib/domain/loop'
import type { Score, ScoreId } from '@/lib/domain/scores'

const SCORE_ORDER: ScoreId[] = ['role_readiness', 'evidence_strength', 'skill_gap_severity', 'resilience', 'actionability']

interface ReviewData {
  assessment: Assessment
  proofs: Proof[]
  reviews: AdvisorReview[]
}

export default function AdvisorReviewPage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = use(params)
  const [data, setData] = useState<ReviewData | null>(null)
  const [busy, setBusy] = useState(false)
  const [advisorId, setAdvisorId] = useState('advisor-demo')

  useEffect(() => { setAdvisorId(getAdvisorId()) }, [])

  const load = useCallback(() => {
    fetch(`/api/advisor/review/${assessmentId}`).then(r => r.json()).then(d => { if (!d.error) setData(d) })
  }, [assessmentId])
  useEffect(() => { load() }, [load])

  const submit = useCallback(async (action: AdvisorAction, extra: Record<string, unknown>) => {
    setBusy(true)
    try {
      const res = await fetch('/api/advisor/review', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, advisorId, action, ...extra }),
      })
      if (res.ok) load()
    } finally { setBusy(false) }
  }, [assessmentId, advisorId, load])

  if (!data) return <div className="min-h-screen flex items-center justify-center text-white/40">กำลังโหลด…</div>

  const { assessment, proofs, reviews } = data
  const profile = assessment.result.profile
  const pending = proofs.filter(p => p.state === 'needs_advisor')
  const resolved = proofs.filter(p => p.state !== 'needs_advisor' && p.state !== 'todo')

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <Link href="/queue" className="text-white/40 hover:text-white transition-colors text-sm">← Queue</Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/60">ตรวจสอบ</span>
        </div>
        <span className="text-xs text-white/30">advisor: {advisorId}</span>
      </nav>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-7">
          {/* Student header */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/20 flex items-center justify-center text-2xl">🎓</div>
            <div>
              <h1 className="text-xl font-bold text-white">{profile.studentName ?? assessment.studentId.slice(0, 8)}</h1>
              <p className="text-sm text-white/40">{profile.programLabel ?? '—'} · v{assessment.version}</p>
            </div>
          </div>

          {assessment.result.flags.length > 0 && <LowConfidenceFlag flags={assessment.result.flags} />}

          {/* Scores — clickable XAI so the advisor can see "why" */}
          <section>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">คะแนน (คลิกเพื่อดูที่มา)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SCORE_ORDER.map(id => {
                const s = assessment.result.scores[id] as Score | undefined
                return s ? <ScoreCard key={id} score={s} /> : null
              })}
            </div>
          </section>

          {/* Pending proofs — the human verification step */}
          <section>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">หลักฐานที่รอตรวจสอบ ({pending.length})</h2>
            {pending.length === 0 ? (
              <p className="text-sm text-white/30">ไม่มีหลักฐานรอตรวจสอบ</p>
            ) : (
              <div className="space-y-3">
                {pending.map(p => <PendingProofRow key={p.id} proof={p} busy={busy} onAction={submit} />)}
              </div>
            )}
          </section>

          {/* Override a score */}
          <OverrideScore scores={assessment.result.scores} busy={busy} onOverride={submit} />

          {/* Resolved proofs */}
          {resolved.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">หลักฐานที่ตรวจแล้ว</h2>
              <div className="space-y-2">
                {resolved.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8 text-sm flex-wrap">
                    <span className={p.state === 'verified' ? 'text-green-400' : 'text-red-400'}>{p.state === 'verified' ? '✓' : '✗'}</span>
                    <span className="text-white/60">{p.skillId}</span>
                    {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-white/30 hover:text-white/60 truncate max-w-[200px]">{p.url}</a>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Approve whole assessment */}
          <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/3 border border-white/8 flex-wrap">
            <p className="text-sm text-white/50">เมื่อตรวจสอบครบแล้ว ยืนยันว่าผลนี้ถูกต้อง</p>
            <button
              onClick={() => submit('approve', { note: 'ตรวจสอบและอนุมัติ' })}
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-sm font-medium transition-all"
            >
              ✓ อนุมัติผล
            </button>
          </div>

          {/* Review history */}
          {reviews.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">ประวัติการตรวจสอบ</h2>
              <div className="space-y-1.5">
                {reviews.map(r => (
                  <div key={r.id} className="text-xs text-white/40 flex items-center gap-2">
                    <span className="text-white/60">{r.action}</span>
                    {r.targetSkillId && <span>· {r.targetSkillId}</span>}
                    {r.note && <span className="text-white/30">— {r.note}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function PendingProofRow({ proof, busy, onAction }: {
  proof: Proof
  busy: boolean
  onAction: (action: AdvisorAction, extra: Record<string, unknown>) => void
}) {
  const [note, setNote] = useState('')
  const target = { targetSkillId: proof.skillId, note }
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className="text-sm font-medium text-white">{proof.skillId}</span>
        <EvidenceBadge status="evidence_gap" />
        {proof.url && <a href={proof.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-brand-300 hover:text-brand-200 truncate max-w-[240px]">{proof.url}</a>}
      </div>
      {proof.verification?.rationale && <p className="text-[11px] text-white/40 mb-2">{proof.verification.rationale}</p>}
      <input
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="บันทึก (จะแสดงให้นักศึกษาเห็น)"
        className="w-full bg-white/5 border border-white/12 rounded-lg px-3 py-1.5 text-xs text-white/80 placeholder:text-white/25 outline-none focus:border-brand-500/50 mb-2.5"
      />
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => onAction('verify_evidence', target)} disabled={busy}
          className="text-xs px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white font-medium transition-all">✓ ยืนยันหลักฐาน</button>
        <button onClick={() => onAction('request_more_proof', target)} disabled={busy}
          className="text-xs px-3 py-1.5 rounded-lg bg-amber-600/80 hover:bg-amber-500 disabled:opacity-40 text-white font-medium transition-all">ขอเพิ่มเติม</button>
        <button onClick={() => onAction('reject', target)} disabled={busy}
          className="text-xs px-3 py-1.5 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10 disabled:opacity-40 transition-all">ไม่รับ</button>
      </div>
    </div>
  )
}

function OverrideScore({ scores, busy, onOverride }: {
  scores: Record<ScoreId, Score>
  busy: boolean
  onOverride: (action: AdvisorAction, extra: Record<string, unknown>) => void
}) {
  const [scoreId, setScoreId] = useState<ScoreId>('role_readiness')
  const [pct, setPct] = useState('')
  const [note, setNote] = useState('')
  const current = scores[scoreId]

  return (
    <section className="p-4 rounded-2xl bg-white/3 border border-white/8">
      <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">ปรับแก้คะแนน (override)</h2>
      <div className="flex items-end gap-2 flex-wrap">
        <select value={scoreId} onChange={e => setScoreId(e.target.value as ScoreId)}
          className="bg-white/5 border border-white/12 rounded-lg px-3 py-2 text-sm text-white/80 outline-none">
          {SCORE_ORDER.map(id => <option key={id} value={id} className="bg-zinc-900">{id}</option>)}
        </select>
        <span className="text-xs text-white/30 pb-2">ปัจจุบัน {current?.display ?? '—'} →</span>
        <input value={pct} onChange={e => setPct(e.target.value)} type="number" min={0} max={100} placeholder="%"
          className="w-20 bg-white/5 border border-white/12 rounded-lg px-3 py-2 text-sm text-white/80 outline-none" />
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="เหตุผล"
          className="flex-1 min-w-[140px] bg-white/5 border border-white/12 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none" />
        <button
          onClick={() => onOverride('override_score', { targetScoreId: scoreId, overrideValue: Number(pct) / 100, note })}
          disabled={busy || pct === ''}
          className="text-sm px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white font-medium transition-all">บันทึก</button>
      </div>
    </section>
  )
}
