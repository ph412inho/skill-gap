import type { AnalyzeRequest } from '@/lib/orchestrator/types'
import type { AnalysisResult } from '@/lib/domain/analysis'

interface RunEntry {
  request: AnalyzeRequest
  result?: AnalysisResult
  createdAt: number
}

// Pin to global so the Map survives Next.js hot-module re-evaluation in dev mode.
// Module-level `const runs = new Map()` gets a fresh Map on each reload; `global` does not.
const g = global as typeof global & { __runs?: Map<string, RunEntry> }
const runs: Map<string, RunEntry> = g.__runs ?? (g.__runs = new Map())

export function storeRun(req: AnalyzeRequest): void {
  runs.set(req.runId, { request: req, createdAt: Date.now() })
  setTimeout(() => runs.delete(req.runId), 30 * 60 * 1000)
}

export function getActiveRun(runId: string): AnalyzeRequest | null {
  return runs.get(runId)?.request ?? null
}

export function storeResult(runId: string, result: AnalysisResult): void {
  const entry = runs.get(runId)
  if (entry) entry.result = result
}

export function getResult(runId: string): AnalysisResult | null {
  return runs.get(runId)?.result ?? null
}
