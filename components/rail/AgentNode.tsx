'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AgentId } from '@/lib/domain/agents'
import type { AgentStatus } from './useAgentStream'

const ICONS: Record<AgentId, string> = {
  profile_analyzer:    '📄',
  evidence_verifier:   '🔍',
  role_fit:            '🎯',
  skill_gap:           '📊',
  resilience:          '🛡',
  action_plan:         '📝',
  critic:              '⚖️',
  institution_insight: '🏫',
}

const LABELS: Record<AgentId, string> = {
  profile_analyzer:    'Profile Analyzer',
  evidence_verifier:   'Evidence Verifier',
  role_fit:            'Role Fit',
  skill_gap:           'Skill Gap',
  resilience:          'Resilience',
  action_plan:         'Action Plan',
  critic:              'Critic / Guardrail',
  institution_insight: 'Institution Insight',
}

// Suggested actions shown after each agent completes
const NEXT_ACTIONS: Partial<Record<AgentId, { label: string; anchor: string }[]>> = {
  evidence_verifier:   [{ label: 'ดู Skill Honeycomb →',     anchor: '#skills' }],
  role_fit:            [{ label: 'ดู Role Readiness score →', anchor: '#scores' }],
  skill_gap:           [{ label: 'ดู Gap analysis →',         anchor: '#scores' }, { label: 'ไปที่ Action Plan →', anchor: '#action-plan' }],
  action_plan:         [{ label: 'ดู 14-day Timeline →',      anchor: '#now' }, { label: 'เริ่ม Task แรก →', anchor: '#action-plan' }],
  critic:              [{ label: 'ดู Guardrail details →',    anchor: '#flags' }],
  institution_insight: [{ label: 'ดู Cohort Dashboard →',     anchor: '/cohort' }],
}

interface AgentNodeProps {
  id: AgentId
  status: AgentStatus
  notes: string[]
  isLast?: boolean
}

const STATUS_STYLES: Record<AgentStatus, string> = {
  pending:  'bg-white/5 border-white/10 text-white/40',
  active:   'bg-brand-600/20 border-brand-400 text-brand-300 agent-active-glow',
  done:     'bg-green-500/10 border-green-500/40 text-green-400',
  flagged:  'bg-red-500/10 border-red-500/40 text-red-400',
}

export function AgentNode({ id, status, notes, isLast }: AgentNodeProps) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const lastNote = notes[notes.length - 1]
  const isDone = status === 'done' || status === 'flagged'
  const nextActions = NEXT_ACTIONS[id]

  function handleAction(anchor: string) {
    if (anchor.startsWith('/')) {
      // Client-side nav — keeps app state instead of a full page reload.
      router.push(anchor)
    } else {
      const el = document.querySelector(anchor)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex gap-3">
      {/* Connector */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => isDone && setExpanded(p => !p)}
          className={`w-9 h-9 rounded-full border flex items-center justify-center text-base shrink-0 transition-all duration-500 ${STATUS_STYLES[status]} ${isDone ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          {status === 'active' ? (
            <span className="animate-pulse">{ICONS[id]}</span>
          ) : status === 'done' ? (
            expanded ? '−' : '✓'
          ) : status === 'flagged' ? (
            '⚠'
          ) : (
            ICONS[id]
          )}
        </button>
        {!isLast && (
          <div className={`w-px flex-1 mt-1 transition-colors duration-700 ${isDone ? 'bg-white/20' : 'bg-white/8'}`} />
        )}
      </div>

      {/* Content */}
      <div className="pb-4 min-w-0 flex-1">
        <button
          onClick={() => isDone && setExpanded(p => !p)}
          className={`text-sm font-medium transition-colors duration-300 text-left ${
            status === 'active' ? 'text-brand-300' :
            status === 'done'   ? 'text-green-400 hover:text-green-300 cursor-pointer' :
            status === 'flagged'? 'text-red-400' :
            'text-white/30'
          }`}
        >
          {LABELS[id]}
          {isDone && <span className="text-[10px] text-white/20 ml-1">{expanded ? '▲' : '▼'}</span>}
        </button>

        {/* Last note (collapsed) */}
        {lastNote && !expanded && status !== 'pending' && (
          <p className="text-xs text-white/40 mt-0.5 truncate animate-fade-in">{lastNote}</p>
        )}

        {/* Expanded: all notes + suggested actions */}
        {expanded && isDone && (
          <div className="mt-2 animate-fade-in">
            {/* All notes */}
            <div className="space-y-1 mb-3">
              {notes.map((note, i) => (
                <p key={i} className={`text-xs leading-relaxed ${i === notes.length - 1 ? 'text-white/60' : 'text-white/30'}`}>
                  {i === notes.length - 1 ? '→ ' : '· '}{note}
                </p>
              ))}
            </div>

            {/* Suggested next actions */}
            {nextActions && nextActions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {nextActions.map(action => (
                  <button
                    key={action.anchor}
                    onClick={() => handleAction(action.anchor)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/15 text-white/50 hover:bg-white/10 hover:text-white/80 transition-all"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
