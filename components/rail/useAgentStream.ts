'use client'
import { useReducer, useEffect, useRef, useCallback } from 'react'
import { AGENT_PIPELINE } from '@/lib/domain/agents'
import type { AgentId } from '@/lib/domain/agents'
import type { AgentEvent } from '@/lib/domain/events'
import type { Skill } from '@/lib/domain/evidence'
import type { RankedGap } from '@/lib/domain/role'
import type { Score } from '@/lib/domain/scores'
import type { AnalysisResult } from '@/lib/domain/analysis'

export type AgentStatus = 'pending' | 'active' | 'done' | 'flagged'

export interface StreamState {
  agentStatus: Record<AgentId, AgentStatus>
  agentNotes: Record<AgentId, string[]>
  activeAgent: AgentId | null
  skills: Skill[]
  gaps: RankedGap[]
  scores: Partial<Record<string, Score>>
  result: AnalysisResult | null
  error: string | null
  done: boolean
}

type Action =
  | { type: 'event'; event: AgentEvent }
  | { type: 'error'; message: string }
  | { type: 'hydrate'; result: AnalysisResult }   // load a finished result instantly (refresh/skip)
  | { type: 'reset' }                             // replay from scratch

function makeInitialState(): StreamState {
  const agentStatus = {} as Record<AgentId, AgentStatus>
  const agentNotes  = {} as Record<AgentId, string[]>
  for (const id of AGENT_PIPELINE) {
    agentStatus[id] = 'pending'
    agentNotes[id]  = []
  }
  return { agentStatus, agentNotes, activeAgent: null, skills: [], gaps: [], scores: {}, result: null, error: null, done: false }
}

function reducer(state: StreamState, action: Action): StreamState {
  if (action.type === 'reset') return makeInitialState()
  if (action.type === 'error') return { ...state, error: action.message, done: true }
  if (action.type === 'hydrate') {
    // Mark every agent finished and load the result — no animation (refresh / skip).
    const agentStatus = {} as Record<AgentId, AgentStatus>
    for (const id of AGENT_PIPELINE) agentStatus[id] = 'done'
    if (action.result.flags.length > 0) agentStatus.critic = 'flagged'
    return {
      ...state,
      agentStatus,
      activeAgent: null,
      skills: action.result.skills,
      scores: action.result.scores,
      result: action.result,
      done: true,
      error: null,
    }
  }

  const ev = action.event
  switch (ev.type) {
    case 'agent_started':
      return {
        ...state,
        activeAgent: ev.agent,
        agentStatus: { ...state.agentStatus, [ev.agent]: 'active' },
      }
    case 'agent_progress':
      return {
        ...state,
        agentNotes: { ...state.agentNotes, [ev.agent]: [...(state.agentNotes[ev.agent] ?? []), ev.note] },
      }
    case 'agent_partial': {
      const p = ev.payload
      if (p.kind === 'skills') return { ...state, skills: p.skills }
      if (p.kind === 'gaps')   return { ...state, gaps: p.top }
      if (p.kind === 'score')  return { ...state, scores: { ...state.scores, [p.score.id]: p.score } }
      return state
    }
    case 'agent_flagged':
      return { ...state, agentStatus: { ...state.agentStatus, [ev.agent]: 'flagged' } }
    case 'agent_done':
      return {
        ...state,
        activeAgent: null,
        agentStatus: {
          ...state.agentStatus,
          [ev.agent]: state.agentStatus[ev.agent] === 'flagged' ? 'flagged' : 'done',
        },
      }
    case 'result':
      return { ...state, result: ev.result, scores: ev.result.scores, skills: ev.result.skills, done: true }
    default:
      return state
  }
}

const MAX_RETRIES = 3

export function useAgentStream(runId: string | null) {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState)
  const esRef   = useRef<EventSource | null>(null)
  const retries = useRef(0)
  const done    = useRef(false)

  const connect = useCallback(() => {
    if (!runId) return
    done.current = false
    const es = new EventSource(`/api/analyze/${runId}/stream`)
    esRef.current = es

    es.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data as string) as AgentEvent
        dispatch({ type: 'event', event })
        if (event.type === 'result' || event.type === 'error') {
          done.current = true
          es.close()
        }
      } catch { /* ignore parse errors */ }
    }

    es.onerror = () => {
      es.close()
      if (done.current) return
      if (retries.current < MAX_RETRIES) {
        retries.current++
        setTimeout(connect, 1000 * retries.current)
      } else {
        dispatch({ type: 'error', message: 'การเชื่อมต่อขาด — กรุณาลองใหม่อีกครั้ง' })
      }
    }
  }, [runId])

  useEffect(() => {
    if (!runId) return
    let cancelled = false
    // Refresh-instant: if this run already has a stored result, hydrate it and skip the
    // animation entirely. Otherwise stream the pipeline live.
    fetch(`/api/runs/${runId}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (cancelled) return
        if (d?.result) dispatch({ type: 'hydrate', result: d.result as AnalysisResult })
        else connect()
      })
      .catch(() => { if (!cancelled) connect() })
    return () => { cancelled = true; done.current = true; esRef.current?.close(); esRef.current = null }
  }, [runId, connect])

  // Skip / fast-forward: compute the final result now and load it.
  const skip = useCallback(async () => {
    if (!runId) return
    try {
      const res = await fetch(`/api/analyze/${runId}/finish`, { method: 'POST' })
      if (!res.ok) return
      const d = await res.json()
      done.current = true
      esRef.current?.close()
      dispatch({ type: 'hydrate', result: d.result as AnalysisResult })
    } catch { /* keep streaming on failure */ }
  }, [runId])

  // Replay: reset and stream the pipeline again from the top.
  const replay = useCallback(() => {
    esRef.current?.close()
    retries.current = 0
    dispatch({ type: 'reset' })
    connect()
  }, [connect])

  return { ...state, skip, replay }
}
