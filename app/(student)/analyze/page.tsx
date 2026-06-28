'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { ConsentGate } from '@/components/shared/ConsentGate'
import { PersonalitySetup } from '@/components/profile/PersonalitySetup'
import type { PersonalityProfile } from '@/lib/domain/personality'

type Step = 'personality' | 'consent'

function AnalyzeInner() {
  const router = useRouter()
  const params = useSearchParams()
  const scenarioId = params.get('scenario')
  const text       = params.get('text')

  const [step, setStep]           = useState<Step>('personality')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [personality, setPersonality] = useState<PersonalityProfile | null>(null)

  function handlePersonalityDone(p: PersonalityProfile) {
    setPersonality(p)
    setStep('consent')
  }

  async function handleConsent(purposes: string[]) {
    setLoading(true)
    setError(null)

    try {
      const consent = {
        studentId: 'demo-student-' + Date.now(),
        grantedAt: new Date().toISOString(),
        purposes,
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId,
          targetRoleId: 'business-analyst',
          consent,
          input: { kind: text ? 'paste' : 'paste', text: text ?? '', targetRoleId: 'business-analyst' },
        }),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body?.error?.message ?? 'เกิดข้อผิดพลาด')
      }

      const { runId } = await res.json()

      // Persist personality in sessionStorage so dashboard can read it
      if (personality) {
        sessionStorage.setItem(`personality_${runId}`, JSON.stringify(personality))
      }

      router.push(`/dashboard/${runId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่')
      setLoading(false)
    }
  }

  const scenarioLabel = scenarioId
    ? { 'y4-business-ba': 'Scene 1 — นักศึกษา BA', 'pm-reentry': 'Scene 2 — PM Re-entry', 'gaming-unverified': 'Scene 3 — Guardrail' }[scenarioId] ?? scenarioId
    : 'Profile ของคุณ'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-white/40 hover:text-white transition-colors text-sm">← กลับ</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/60">{scenarioLabel}</span>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {(['personality', 'consent'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${
                step === s ? 'border-brand-400 bg-brand-600/30 text-brand-300' :
                (['consent'] as Step[]).indexOf(s) < (['consent'] as Step[]).indexOf(step) ? 'border-green-500/40 bg-green-500/10 text-green-400' :
                'border-white/15 text-white/30'
              }`}>
                {(['consent'] as Step[]).indexOf(s) < (['consent'] as Step[]).indexOf(step) ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${step === s ? 'text-white/70' : 'text-white/25'}`}>
                {s === 'personality' ? 'Personality' : 'Consent'}
              </span>
              {i < 1 && <span className="text-white/15 text-xs">›</span>}
            </div>
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {step === 'personality' && (
          <PersonalitySetup
            onComplete={handlePersonalityDone}
            onSkip={() => setStep('consent')}
          />
        )}

        {step === 'consent' && (
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-xl font-bold text-white mb-1">ก่อนเริ่มต้น</h1>
              <p className="text-sm text-white/40">กรุณายืนยันการใช้งาน AI</p>
            </div>
            <ConsentGate onConsent={handleConsent} loading={loading} />
            {error && (
              <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            <button
              onClick={() => setStep('personality')}
              className="mt-4 w-full py-2 text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              ← กลับไปแก้ Personality
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white/40">กำลังโหลด...</div>}>
      <AnalyzeInner />
    </Suspense>
  )
}
