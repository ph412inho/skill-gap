'use client'
import { useEffect, useRef, useState } from 'react'
import type { ActionPlan, ActionItem } from '@/lib/domain/plan'
import type { Proof, ProofState } from '@/lib/domain/loop'

const PROOF_ICONS: Record<string, string> = {
  github_repo:            '🐙',
  dataset_notebook:       '📓',
  pdf_writeup:            '📄',
  dashboard_screenshot:   '📊',
  presentation_recording: '🎥',
  other:                  '📎',
}

const RESOURCE_ICONS: Record<string, string> = {
  tutorial:  '🎥',
  template:  '📋',
  dataset:   '🗃',
  tool:      '🔧',
  example:   '💡',
}

// How each proof state reads to the student (with its "why" surfaced, not hidden).
const STATE_STYLE: Record<ProofState | 'verifying', { label: string; cls: string }> = {
  todo:         { label: '',                       cls: '' },
  submitted:    { label: 'ส่งแล้ว',                cls: 'text-white/50 border-white/15 bg-white/5' },
  verifying:    { label: 'กำลังตรวจสอบ…',          cls: 'text-brand-300 border-brand-500/30 bg-brand-600/10' },
  verified:     { label: '✓ ยืนยันอัตโนมัติ',       cls: 'text-green-400 border-green-500/30 bg-green-500/10' },
  needs_advisor:{ label: '⏳ รอที่ปรึกษายืนยัน',     cls: 'text-amber-300 border-amber-500/30 bg-amber-500/10' },
  rejected:     { label: '✗ ลิงก์ใช้ไม่ได้',         cls: 'text-red-400 border-red-500/30 bg-red-500/10' },
}

interface ActionPlanCardProps {
  plan: ActionPlan
  runId?: string                            // when present, proof submission is enabled
  studentId?: string
  onProofsChange?: (proofs: Proof[]) => void
}

export function ActionPlanCard({ plan, runId, studentId, onProofsChange }: ActionPlanCardProps) {
  const [proofs, setProofs] = useState<Proof[]>([])
  const interactive = !!runId && !!studentId

  // Load any proofs already attached to this run's assessment.
  useEffect(() => {
    if (!runId) return
    let alive = true
    fetch(`/api/proof?runId=${encodeURIComponent(runId)}`)
      .then(r => r.json())
      .then(d => { if (alive && d.proofs) { setProofs(d.proofs); onProofsChange?.(d.proofs) } })
      .catch(() => {})
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId])

  function upsertProof(p: Proof) {
    setProofs(prev => {
      const next = [...prev.filter(x => x.actionItemId !== p.actionItemId), p]
      onProofsChange?.(next)
      return next
    })
  }

  const proofByItem = new Map(proofs.map(p => [p.actionItemId, p]))

  if (plan.tasks.length === 0) return null

  const verifiedCount = proofs.filter(p => p.state === 'verified').length

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden animate-fade-in">
      <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">📝 แผน 2 สัปดาห์</h3>
          <p className="text-xs text-white/40 mt-0.5">{plan.totalDays} วัน · {plan.tasks.length} tasks</p>
        </div>
        <div className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
          {plan.tasks.filter(t => t.feasible).length}/{plan.tasks.length} ทำได้ใน 2 สัปดาห์
        </div>
      </div>

      {interactive && (
        <div className="px-5 py-2.5 bg-brand-600/5 border-b border-white/5 text-[11px] text-white/45">
          แนบหลักฐานจริงในแต่ละงาน — ลิงก์ที่เชื่อถือได้จะถูก<span className="text-green-400"> ยืนยันอัตโนมัติ</span> ส่วนที่เหลือส่งให้ที่ปรึกษา
          {verifiedCount > 0 && <span className="text-white/60"> · ยืนยันแล้ว {verifiedCount}</span>}
        </div>
      )}

      <div className="divide-y divide-white/5">
        {plan.tasks.map((task, i) => (
          <div key={task.id} className="px-5 py-4 hover:bg-white/3 transition-colors">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-400 shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <span className="text-base shrink-0" title={task.proofType}>{PROOF_ICONS[task.proofType] ?? '📎'}</span>
                </div>

                <p className="text-xs text-white/50 mt-1 leading-relaxed">{task.description}</p>

                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-[10px] text-white/30">{task.durationDays} วัน</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-white/50">{task.skillLabel}</span>
                  {task.feasible
                    ? <span className="text-[10px] text-green-400">✓ ทำได้ใน 2 สัปดาห์</span>
                    : <span className="text-[10px] text-amber-300/80">⚠ เกิน 2 สัปดาห์</span>}
                </div>

                {task.resourceLinks && task.resourceLinks.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {task.resourceLinks.map((r, ri) => (
                      <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-300 hover:bg-brand-600/20 hover:border-brand-500/40 transition-all">
                        <span>{RESOURCE_ICONS[r.kind] ?? '🔗'}</span>
                        {r.label}
                      </a>
                    ))}
                  </div>
                )}

                {interactive && (
                  <ProofControl
                    task={task}
                    runId={runId!}
                    studentId={studentId!}
                    proof={proofByItem.get(task.id)}
                    onResult={upsertProof}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 border-t border-white/5 bg-white/2 flex items-center gap-4 flex-wrap">
        <span className="text-[10px] text-white/20">Proof types:</span>
        {Object.entries(PROOF_ICONS).map(([k, icon]) => (
          <span key={k} className="text-[10px] text-white/25">{icon} {k.replace(/_/g, ' ')}</span>
        ))}
      </div>
    </div>
  )
}

// Per-task proof attach + state. Shows the verification "why" (XAI), never a bare verdict.
function ProofControl({
  task, runId, studentId, proof, onResult,
}: {
  task: ActionItem
  runId: string
  studentId: string
  proof?: Proof
  onResult: (p: Proof) => void
}) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function submit() {
    if (!url.trim()) return
    setBusy(true); setError(null)
    try {
      const res = await fetch('/api/proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId, runId, actionItemId: task.id, skillId: task.skillId,
          proofType: task.proofType, source: 'link', url: url.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'ส่งไม่สำเร็จ')
      onResult(data.proof as Proof)
      setOpen(false); setUrl('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'ส่งไม่สำเร็จ')
    } finally {
      setBusy(false)
    }
  }

  // Already submitted → show state + the verifier's reasoning (clickable "why").
  if (proof) {
    const style = STATE_STYLE[proof.state] ?? STATE_STYLE.submitted
    const advisorVerified = proof.state === 'verified' && proof.verification?.outcome === 'routed_to_advisor'
    const label = advisorVerified ? '✓ ยืนยันโดยที่ปรึกษา' : style.label
    const canRetry = proof.state === 'rejected'
    return (
      <div className="mt-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-full border ${style.cls}`}>{label}</span>
          {proof.url && (
            <a href={proof.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/40 hover:text-white/70 truncate max-w-[200px]">
              {proof.url}
            </a>
          )}
          {canRetry && (
            <button onClick={() => { onResult({ ...proof, state: 'todo' as ProofState }); setOpen(true) }}
              className="text-[10px] text-brand-300 hover:text-brand-200">ลองใหม่</button>
          )}
        </div>
        {proof.verification?.rationale && (
          <p className="mt-1 text-[10px] text-white/35 leading-relaxed">เหตุผล: {proof.verification.rationale}</p>
        )}
      </div>
    )
  }

  // Not yet submitted → attach control.
  return (
    <div className="mt-3">
      {!open ? (
        <button
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0) }}
          className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border border-white/12 bg-white/5 text-white/60 hover:text-white hover:border-white/25 transition-all"
        >
          ＋ แนบหลักฐาน
        </button>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') setOpen(false) }}
              placeholder="วางลิงก์ผลงาน เช่น https://github.com/…"
              className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white/80 placeholder:text-white/25 outline-none focus:border-brand-500/50 transition-all"
            />
            <button onClick={submit} disabled={busy || !url.trim()}
              className="text-xs px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-30 text-white font-medium transition-all">
              {busy ? 'ตรวจสอบ…' : 'ส่ง'}
            </button>
            <button onClick={() => { setOpen(false); setError(null) }} className="text-xs text-white/30 hover:text-white/60 px-1">✕</button>
          </div>
          {error && <p className="text-[10px] text-red-400">{error}</p>}
        </div>
      )}
    </div>
  )
}
