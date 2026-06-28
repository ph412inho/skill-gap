import type { Intervention } from '@/lib/domain/cohort'

const STATUS_STYLES = {
  recommended: 'border-brand-500/40 bg-brand-500/10 text-brand-300',
  in_progress: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  completed:   'border-green-500/40 bg-green-500/10 text-green-300',
}

const STATUS_LABEL = {
  recommended: 'แนะนำ',
  in_progress: 'กำลังดำเนินการ',
  completed:   'เสร็จแล้ว',
}

interface Props {
  intervention: Intervention
}

export function InterventionCard({ intervention: iv }: Props) {
  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-white/3 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-white">{iv.title}</h3>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[iv.status]}`}>
          {STATUS_LABEL[iv.status]}
        </span>
      </div>
      <p className="text-sm text-white/50 mb-3 leading-relaxed">{iv.description}</p>
      <div className="flex items-center gap-4 text-xs text-white/30">
        <span>🎯 {iv.targetSkillIds.length} ทักษะ</span>
        <span>📅 {iv.durationWeeks} สัปดาห์</span>
      </div>
    </div>
  )
}
