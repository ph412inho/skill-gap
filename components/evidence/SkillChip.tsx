'use client'
import type { Skill } from '@/lib/domain/evidence'
import { EvidenceBadge } from './EvidenceBadge'

interface SkillChipProps {
  skill: Skill
  onClick?: () => void
}

export function SkillChip({ skill, onClick }: SkillChipProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all duration-200 animate-fade-in text-left group"
    >
      <span className="text-sm text-white/90 group-hover:text-white transition-colors">{skill.label}</span>
      <EvidenceBadge status={skill.status} />
      {skill.confidence < 0.5 && (
        <span className="text-[10px] text-amber-400 font-medium ml-auto">⚑ ความมั่นใจต่ำ</span>
      )}
    </button>
  )
}
