import type { AgentEvent } from '@/lib/domain/events'
import type { RawInput, ConsentRecord } from '@/lib/domain/profile'

export interface AnalyzeRequest {
  runId: string
  scenarioId: string | null   // null = paste-your-own
  input: RawInput
  consent: ConsentRecord
  targetRoleId: string
}

// THE seam — mock and live both implement this identical interface.
// The UI only ever depends on this; getOrchestrator() is the only switch.
export interface Orchestrator {
  run(req: AnalyzeRequest): AsyncIterable<AgentEvent>
}
