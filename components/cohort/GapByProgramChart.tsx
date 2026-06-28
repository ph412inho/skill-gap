'use client'
import type { GapEntry } from '@/lib/domain/cohort'

interface Props {
  gaps: GapEntry[]
}

// Color by importance tier (high importance gaps are most critical)
function barColor(importance: number): string {
  if (importance >= 0.85) return 'bg-red-500'
  if (importance >= 0.75) return 'bg-orange-500'
  if (importance >= 0.60) return 'bg-amber-500'
  return 'bg-green-500'
}

export function GapByProgramChart({ gaps }: Props) {
  const maxPct = Math.max(...gaps.map(g => g.affectedPct), 0.01)

  return (
    <div className="space-y-3">
      {gaps.map(g => {
        const displayPct = Math.round(g.affectedPct * 100)
        const bar = barColor(g.importance)
        return (
          <div key={g.skillId}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${bar}`} />
                <span className="text-sm text-white/80">{g.skillLabel}</span>
              </div>
              <span className="text-sm font-semibold text-white/60 tabular-nums">
                {displayPct}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/8 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${bar}`}
                style={{ width: `${(g.affectedPct / maxPct) * 100}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
