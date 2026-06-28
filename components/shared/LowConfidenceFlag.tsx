import type { GuardrailFlag } from '@/lib/domain/guardrail'

interface LowConfidenceFlagProps {
  flags: GuardrailFlag[]
}

export function LowConfidenceFlag({ flags }: LowConfidenceFlagProps) {
  if (flags.length === 0) return null

  const hasVeto = flags.some(f => f.severity === 'veto')

  return (
    <div className={`rounded-2xl border p-4 animate-fade-in ${hasVeto ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{hasVeto ? '🚨' : '⚠️'}</span>
        <div>
          <h4 className={`font-semibold text-sm ${hasVeto ? 'text-red-400' : 'text-amber-400'}`}>
            {hasVeto ? 'Guardrail ตรวจพบปัญหา — ส่งให้ Advisor ตรวจสอบ' : 'ความมั่นใจต่ำ — อาจต้องการการยืนยัน'}
          </h4>
          <ul className="mt-2 space-y-1">
            {flags.map((f, i) => (
              <li key={i} className="text-xs text-white/60">{f.message}</li>
            ))}
          </ul>
          <p className="text-xs text-white/40 mt-2">
            ส่งเข้า Advisor Queue อัตโนมัติ · ผลลัพธ์นี้ไม่ถือเป็นขั้นสุดท้ายจนกว่า Advisor จะอนุมัติ
          </p>
        </div>
      </div>
    </div>
  )
}
