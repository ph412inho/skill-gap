import { NextRequest } from 'next/server'
import { getActiveRun, storeResult } from '@/lib/store/runs'
import { getOrchestrator } from '@/lib/orchestrator'
import type { AgentEvent } from '@/lib/domain/events'
import type { AnalysisResult } from '@/lib/domain/analysis'

export async function GET(
  _req: NextRequest,
  { params }: { params: { runId: string } },
) {
  const run = getActiveRun(params.runId)
  if (!run) {
    return new Response(
      `data: ${JSON.stringify({ type: 'error', message: 'Run not found' })}\n\n`,
      { status: 404, headers: { 'Content-Type': 'text/event-stream' } },
    )
  }

  const encoder = new TextEncoder()
  const orchestrator = getOrchestrator()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of orchestrator.run(run)) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
          if (event.type === 'result') {
            storeResult(run.runId, (event as Extract<AgentEvent, { type: 'result' }>).result as AnalysisResult)
          }
          if (event.type === 'result' || event.type === 'error') break
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: msg })}\n\n`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
