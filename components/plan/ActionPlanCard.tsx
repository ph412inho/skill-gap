import type { ActionPlan } from '@/lib/domain/plan'

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

interface ActionPlanCardProps {
  plan: ActionPlan
}

export function ActionPlanCard({ plan }: ActionPlanCardProps) {
  if (plan.tasks.length === 0) return null

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
      <div className="divide-y divide-white/5">
        {plan.tasks.map((task, i) => (
          <div key={task.id} className="px-5 py-4 hover:bg-white/3 transition-colors">
            <div className="flex gap-3">
              {/* Step number */}
              <div className="w-6 h-6 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-400 shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                {/* Title row */}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <span className="text-base shrink-0" title={task.proofType}>{PROOF_ICONS[task.proofType] ?? '📎'}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{task.description}</p>

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-[10px] text-white/30">{task.durationDays} วัน</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-white/50">{task.skillLabel}</span>
                  {task.feasible && <span className="text-[10px] text-green-400">✓ ทำได้ใน 2 สัปดาห์</span>}
                </div>

                {/* Resource links — the "more actionable" layer */}
                {task.resourceLinks && task.resourceLinks.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {task.resourceLinks.map((r, ri) => (
                      <a
                        key={ri}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-300 hover:bg-brand-600/20 hover:border-brand-500/40 transition-all"
                      >
                        <span>{RESOURCE_ICONS[r.kind] ?? '🔗'}</span>
                        {r.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer: proof type legend */}
      <div className="px-5 py-3 border-t border-white/5 bg-white/2 flex items-center gap-4 flex-wrap">
        <span className="text-[10px] text-white/20">Proof types:</span>
        {Object.entries(PROOF_ICONS).map(([k, icon]) => (
          <span key={k} className="text-[10px] text-white/25">{icon} {k.replace(/_/g, ' ')}</span>
        ))}
      </div>
    </div>
  )
}
