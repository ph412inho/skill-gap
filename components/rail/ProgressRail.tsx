'use client'
import { AGENT_PIPELINE } from '@/lib/domain/agents'
import type { AgentId } from '@/lib/domain/agents'
import type { AgentStatus } from './useAgentStream'
import { AgentNode } from './AgentNode'

interface ProgressRailProps {
  agentStatus: Record<AgentId, AgentStatus>
  agentNotes: Record<AgentId, string[]>
  done: boolean
}

export function ProgressRail({ agentStatus, agentNotes, done }: ProgressRailProps) {
  const doneCount = Object.values(agentStatus).filter(s => s === 'done' || s === 'flagged').length
  const progress = (doneCount / AGENT_PIPELINE.length) * 100
  const hasFlag = Object.values(agentStatus).some(s => s === 'flagged')

  return (
    <div>
      <div className="sticky top-6">
        {/* Header */}
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2">AI Pipeline</h3>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${hasFlag ? 'bg-red-500' : done ? 'bg-green-500' : 'bg-brand-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-white/40 mt-1">{doneCount} / {AGENT_PIPELINE.length} agents</p>
        </div>

        {/* Agent nodes */}
        <div>
          {AGENT_PIPELINE.map((id, i) => (
            <AgentNode
              key={id}
              id={id}
              status={agentStatus[id]}
              notes={agentNotes[id] ?? []}
              isLast={i === AGENT_PIPELINE.length - 1}
            />
          ))}
        </div>

        {/* Completion banner */}
        {done && (
          <div className={`mt-4 px-4 py-3 rounded-2xl border animate-fade-in ${hasFlag
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-gradient-to-r from-brand-600/20 to-green-600/20 border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
          }`}>
            <p className={`text-sm font-semibold ${hasFlag ? 'text-red-400' : 'text-green-400'}`}>
              {hasFlag ? '⚠ ส่งให้ Advisor ตรวจสอบ' : '✅ วิเคราะห์เสร็จสมบูรณ์'}
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              {hasFlag ? 'พบปัญหาที่ต้องตรวจสอบ' : 'คลิกคะแนนใดก็ได้เพื่อดู "ทำไม"'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
