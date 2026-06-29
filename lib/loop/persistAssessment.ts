// Persist a completed analysis as a versioned Assessment (A0/A3 foundation).
// Called when an analyze run finishes. Chains versions per student so the
// before→after delta has a parent to diff against, and writes a PDPA audit row.

import type { Store } from '@/lib/store'
import type { AnalysisResult } from '@/lib/domain/analysis'
import type { Assessment, AuditAction } from '@/lib/domain/loop'

export async function persistAssessment(
  store: Store,
  args: { studentId: string; runId: string; targetRoleId: string; result: AnalysisResult },
): Promise<Assessment> {
  const { studentId, runId, targetRoleId, result } = args

  // Idempotent: a re-streamed run must not create a duplicate assessment.
  const existing = await store.getAssessmentByRun(runId)
  if (existing) return existing

  const latest = await store.getLatestAssessment(studentId)
  const version = (latest?.version ?? 0) + 1
  const assessment: Assessment = {
    id: crypto.randomUUID(),
    studentId,
    runId,
    version,
    parentId: latest?.id ?? null,
    targetRoleId,
    result,
    createdAt: new Date().toISOString(),
  }
  await store.saveAssessment(assessment)

  const action: AuditAction = version === 1 ? 'analysis_run' : 'reassessment_run'
  await store.appendAudit({
    id: crypto.randomUUID(),
    actorId: studentId,
    actorRole: 'student',
    action,
    subjectId: assessment.id,
    detail: `v${version} · role=${targetRoleId} · flags=${result.flags.length}`,
    at: new Date().toISOString(),
  })

  return assessment
}
