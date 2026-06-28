import type { Orchestrator } from './types'
import { getDemoMode } from '@/lib/config/demoMode'
import { MockOrchestrator } from './mock/mockOrchestrator'
import { LlmOrchestrator } from './llm/llmOrchestrator'

export type { AnalyzeRequest, Orchestrator } from './types'

export function getOrchestrator(): Orchestrator {
  const mode = getDemoMode()
  if (mode === 'live') return new LlmOrchestrator()
  return new MockOrchestrator()
}
