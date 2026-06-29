import { NextRequest } from 'next/server'
import { getStore } from '@/lib/store'
import { persistAssessment } from '@/lib/loop/persistAssessment'
import { getOrchestrator } from '@/lib/orchestrator'

// The agent pipeline streams for up to ~21s — raise the serverless timeout so Vercel
// doesn't cut the SSE response off. Node runtime (default) is required for streaming.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60
import type { AgentEvent } from '@/lib/domain/events'
import type { AnalysisResult } from '@/lib/domain/analysis'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ runId: string }> },
) {
  const { runId } = await params
  const store = getStore()
  const run = await store.getActiveRun(runId)
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
            const result = (event as Extract<AgentEvent, { type: 'result' }>).result as AnalysisResult
            await store.storeResult(run.runId, result)
            // Persist a versioned baseline so the before→after loop has a v1 to diff against.
            await persistAssessment(store, {
              studentId: run.consent.studentId,
              runId: run.runId,
              targetRoleId: run.targetRoleId,
              result,
            })
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
