import type { ActionPlan, ActionItem } from '@/lib/domain/plan'

const PROOF_COLORS: Record<string, string> = {
  github_repo:            'bg-purple-500/20 border-purple-500/30 text-purple-300',
  pdf_writeup:            'bg-blue-500/20 border-blue-500/30 text-blue-300',
  dashboard_screenshot:   'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
  presentation_recording: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
  dataset_notebook:       'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
  other:                  'bg-white/10 border-white/15 text-white/50',
}

const PROOF_ICONS: Record<string, string> = {
  github_repo: '🐙', pdf_writeup: '📄', dashboard_screenshot: '📊',
  presentation_recording: '🎥', dataset_notebook: '📓', other: '📎',
}

// Distribute tasks across 2 weeks (14 days)
function buildWeeks(tasks: ActionItem[]): { week: 1 | 2; task: ActionItem; start: number; end: number }[] {
  const items: { week: 1 | 2; task: ActionItem; start: number; end: number }[] = []
  let day = 1
  for (const task of tasks) {
    const start = day
    const end = Math.min(day + task.durationDays - 1, 14)
    items.push({ week: start <= 7 ? 1 : 2, task, start, end })
    day += task.durationDays
  }
  return items
}

function GanttBar({ start, end, task }: { start: number; end: number; task: ActionItem }) {
  const left = ((start - 1) / 14) * 100
  const width = ((end - start + 1) / 14) * 100
  const colorClass = PROOF_COLORS[task.proofType] ?? PROOF_COLORS.other

  return (
    <div className="relative h-8 mb-2">
      <div
        className={`absolute top-0 h-full rounded-xl border flex items-center px-2 gap-1.5 overflow-hidden ${colorClass}`}
        style={{ left: `${left}%`, width: `${Math.max(width, 10)}%` }}
      >
        <span className="text-xs shrink-0">{PROOF_ICONS[task.proofType] ?? '📎'}</span>
        <span className="text-[10px] font-medium truncate">{task.title}</span>
        <span className="text-[9px] opacity-60 shrink-0">{task.durationDays}d</span>
      </div>
    </div>
  )
}

export function NowTimeline({ plan }: { plan: ActionPlan }) {
  if (plan.tasks.length === 0) return null
  const distributed = buildWeeks(plan.tasks)
  const week1 = distributed.filter(d => d.start <= 7)
  const week2 = distributed.filter(d => d.end > 7)

  return (
    <div id="now" className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ตอนนี้กำลังทำอะไร
          </h3>
          <p className="text-xs text-white/40 mt-0.5">14-day proof-of-work sprint</p>
        </div>
        <div className="text-xs px-2.5 py-1 rounded-full bg-white/8 border border-white/10 text-white/40">
          {plan.totalDays} วัน · {plan.tasks.length} tasks
        </div>
      </div>

      <div className="p-5">
        {/* Week markers */}
        <div className="flex mb-3">
          <div className="w-20 shrink-0" />
          <div className="flex-1 flex">
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} className="flex-1 text-center text-[8px] text-white/20">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Week 1 */}
        {week1.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-20 shrink-0 text-[10px] text-white/40 font-medium">Week 1</div>
              <div className="flex-1 relative">
                {/* Week 1 band */}
                <div className="absolute inset-0 bg-brand-500/5 rounded-lg" />
                <div className="relative" style={{ minHeight: week1.length * 40 }}>
                  {week1.map(({ task, start, end }) => (
                    <GanttBar key={task.id} start={start} end={Math.min(end, 7)} task={task} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Week 2 */}
        {week2.length > 0 && (
          <div>
            <div className="flex items-center gap-3">
              <div className="w-20 shrink-0 text-[10px] text-white/40 font-medium">Week 2</div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-violet-500/5 rounded-lg" />
                <div className="relative" style={{ minHeight: week2.length * 40 }}>
                  {week2.map(({ task, start, end }) => (
                    <GanttBar key={task.id} start={Math.max(start, 8)} end={end} task={task} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Day ruler */}
        <div className="flex mt-3 ml-[88px] border-t border-white/8 pt-2">
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i} className="flex-1 flex justify-center">
              {(i + 1) % 7 === 0 && (
                <span className="text-[8px] text-white/20">D{i + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
