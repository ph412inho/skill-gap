'use client'
import { useState } from 'react'
import type { PersonalityProfile, DiSCType, StrengthDomain, FlowActivity } from '@/lib/domain/personality'
import { DISC_META, STRENGTH_META, FLOW_META } from '@/lib/domain/personality'

interface PersonalitySetupProps {
  onComplete: (profile: PersonalityProfile) => void
  onSkip: () => void
}

export function PersonalitySetup({ onComplete, onSkip }: PersonalitySetupProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [disc, setDisc] = useState<DiSCType | null>(null)
  const [strengths, setStrengths] = useState<StrengthDomain[]>([])
  const [flows, setFlows] = useState<FlowActivity[]>([])

  function toggleStrength(s: StrengthDomain) {
    setStrengths(prev => prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 2 ? [...prev, s] : prev)
  }

  function toggleFlow(f: FlowActivity) {
    setFlows(prev => prev.includes(f) ? prev.filter(x => x !== f) : prev.length < 3 ? [...prev, f] : prev)
  }

  function finish() {
    // disc is optional — selections in any step are preserved even if DiSC was skipped.
    onComplete({ disc: disc ?? undefined, strengths, flowActivities: flows })
  }

  const hasAnything = !!disc || strengths.length > 0 || flows.length > 0

  const STEPS = ['DiSC', 'Strengths', 'Flow'] as const

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8 relative">
        <button
          onClick={onSkip}
          className="absolute right-0 top-0 text-[11px] text-white/25 hover:text-white/50 transition-colors"
        >
          ข้ามทั้งหมด →
        </button>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-medium mb-4">
          ✨ เสริมการวิเคราะห์ · ไม่บังคับ
        </div>
        <h2 className="text-xl font-bold text-white mb-1">รู้จักตัวเองก่อนวิเคราะห์</h2>
        <p className="text-sm text-white/40">ข้อมูลนี้ช่วยให้การวิเคราะห์เหมาะสมกับคุณมากขึ้น</p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col gap-1.5">
            <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-brand-500 rounded-full transition-all duration-500"
                style={{ width: step > i ? '100%' : step === i + 1 ? '50%' : '0%' }}
              />
            </div>
            <span className={`text-[10px] text-center transition-colors ${step === i + 1 ? 'text-violet-300' : step > i + 1 ? 'text-white/40' : 'text-white/20'}`}>
              {s}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1 — DiSC */}
      {step === 1 && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-sm text-white/60 mb-4">ในการทำงาน คุณมักจะ...</p>
          {(Object.entries(DISC_META) as [DiSCType, typeof DISC_META[DiSCType]][]).map(([type, meta]) => (
            <button
              key={type}
              onClick={() => setDisc(type)}
              className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 ${
                disc === type
                  ? 'border-violet-400/60 bg-violet-500/15 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                  : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{meta.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded bg-gradient-to-r ${meta.color} bg-clip-text text-transparent`}>
                      {type}
                    </span>
                    <span className="text-sm font-medium text-white">{meta.label}</span>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">{meta.descTh}</p>
                </div>
              </div>
            </button>
          ))}
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-2xl border border-white/10 text-white/40 text-sm hover:border-white/20 transition-all">
              ข้าม DiSC
            </button>
            <button
              onClick={() => disc && setStep(2)}
              disabled={!disc}
              className="flex-1 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-white font-semibold text-sm transition-all"
            >
              ถัดไป →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Strengths */}
      {step === 2 && (
        <div className="animate-fade-in">
          <p className="text-sm text-white/60 mb-4">จุดแข็งของคุณอยู่ที่ไหน? (เลือกได้ 2 อย่าง)</p>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(STRENGTH_META) as [StrengthDomain, typeof STRENGTH_META[StrengthDomain]][]).map(([domain, meta]) => {
              const selected = strengths.includes(domain)
              return (
                <button
                  key={domain}
                  onClick={() => toggleStrength(domain)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                    selected
                      ? 'border-brand-400/60 bg-brand-500/15 shadow-[0_0_16px_rgba(14,165,233,0.12)]'
                      : 'border-white/10 bg-white/3 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl mb-2">{meta.icon}</div>
                  <p className="text-sm font-semibold text-white">{meta.labelTh}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">{meta.descTh}</p>
                  {selected && <div className="mt-2 w-5 h-5 rounded-full bg-brand-500/30 border border-brand-400 flex items-center justify-center text-[10px] text-brand-300">✓</div>}
                </button>
              )
            })}
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={() => setStep(1)} className="py-3 px-4 rounded-2xl border border-white/10 text-white/40 text-sm hover:border-white/20 transition-all shrink-0">
              ← กลับ
            </button>
            <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-2xl border border-white/10 text-white/40 text-sm hover:border-white/20 transition-all">
              ข้าม
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={strengths.length === 0}
              className="flex-1 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 disabled:opacity-30 text-white font-semibold text-sm transition-all"
            >
              ถัดไป →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Flow activities */}
      {step === 3 && (
        <div className="animate-fade-in">
          <p className="text-sm text-white/60 mb-4">ทำอะไรแล้วลืมเวลา? (เลือกได้ 3 อย่าง)</p>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(FLOW_META) as [FlowActivity, typeof FLOW_META[FlowActivity]][]).map(([activity, meta]) => {
              const selected = flows.includes(activity)
              return (
                <button
                  key={activity}
                  onClick={() => toggleFlow(activity)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm transition-all duration-200 ${
                    selected
                      ? 'border-emerald-400/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.1)]'
                      : 'border-white/10 bg-white/3 text-white/60 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span className="text-xs">{meta.labelTh}</span>
                </button>
              )
            })}
          </div>
          <p className="text-[10px] text-white/25 mt-3">{flows.length}/3 เลือกแล้ว</p>
          <div className="flex gap-2 mt-6">
            <button onClick={() => setStep(2)} className="py-3 px-4 rounded-2xl border border-white/10 text-white/40 text-sm hover:border-white/20 transition-all shrink-0">
              ← กลับ
            </button>
            <button
              onClick={() => hasAnything ? finish() : onSkip()}
              className="flex-1 py-3 rounded-2xl border border-white/10 text-white/40 text-sm hover:border-white/20 transition-all"
            >
              ข้าม Flow
            </button>
            <button
              onClick={finish}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-brand-600 hover:from-violet-500 hover:to-brand-500 text-white font-semibold text-sm transition-all"
            >
              บันทึก →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
