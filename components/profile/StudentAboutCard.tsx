'use client'
import type { ParsedProfile } from '@/lib/domain/profile'
import type { PersonalityProfile } from '@/lib/domain/personality'
import { DISC_META, STRENGTH_META, FLOW_META } from '@/lib/domain/personality'

interface StudentAboutCardProps {
  profile: ParsedProfile
  targetRoleLabel?: string
  personality?: PersonalityProfile | null
}

export function StudentAboutCard({ profile, targetRoleLabel, personality }: StudentAboutCardProps) {
  const disc = personality ? DISC_META[personality.disc] : null

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 overflow-hidden animate-fade-in">
      <div className="flex items-start gap-5 p-5">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600/40 to-violet-600/30 border border-white/10 flex items-center justify-center text-2xl shrink-0">
          🎓
        </div>

        {/* Name + context */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h2 className="font-bold text-white text-lg leading-tight">{profile.studentName}</h2>
              <p className="text-sm text-white/50 mt-0.5">{profile.programLabel}</p>
            </div>
            {targetRoleLabel && (
              <div className="px-3 py-1.5 rounded-full bg-brand-600/20 border border-brand-500/30 text-xs font-semibold text-brand-300 shrink-0">
                → {targetRoleLabel}
              </div>
            )}
          </div>

          {/* Personality badges */}
          {personality && (
            <div className="mt-3 flex flex-wrap gap-2">
              {/* DiSC */}
              {disc && (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${disc.color} bg-opacity-15 border border-white/15`}>
                  <span className="text-xs">{disc.emoji}</span>
                  <span className="text-xs font-semibold text-white">{personality.disc} — {disc.label}</span>
                </div>
              )}

              {/* Strengths */}
              {personality.strengths.map(s => (
                <div key={s} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/8 border border-white/10">
                  <span className="text-xs">{STRENGTH_META[s].icon}</span>
                  <span className="text-[11px] text-white/70">{STRENGTH_META[s].labelTh}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Flow activities */}
      {personality && personality.flowActivities.length > 0 && (
        <div className="px-5 pb-4 border-t border-white/5 pt-3">
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">ทำแล้วลืมเวลา</p>
          <div className="flex flex-wrap gap-2">
            {personality.flowActivities.map(f => (
              <div key={f} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs">{FLOW_META[f].icon}</span>
                <span className="text-xs text-emerald-300">{FLOW_META[f].labelTh}</span>
              </div>
            ))}
          </div>
          {personality.strengths.length > 0 && personality.flowActivities.length > 0 && (
            <p className="text-[11px] text-white/30 mt-2 leading-relaxed">
              {`คุณเก่ง ${STRENGTH_META[personality.strengths[0]]?.labelTh ?? ''} และมี Flow ใน ${FLOW_META[personality.flowActivities[0]]?.labelTh ?? ''} — ตำแหน่งที่ดีที่สุดสำหรับคุณคือที่ที่สองสิ่งนี้ทับกัน`}
            </p>
          )}
        </div>
      )}

      {/* Summary */}
      {profile.rawSummary && (
        <div className="px-5 pb-4 border-t border-white/5 pt-3">
          <p className="text-xs text-white/40 leading-relaxed">{profile.rawSummary}</p>
        </div>
      )}
    </div>
  )
}
