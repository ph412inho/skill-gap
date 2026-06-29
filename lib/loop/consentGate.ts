// PDPA consent gate (api-conventions.md) — every endpoint that triggers an AI run
// must pass this before doing work, returning 403 otherwise. Consent is persisted
// per student at baseline (POST /api/analyze) and checked here by studentId.

import type { Store } from '@/lib/store'

export async function hasAiConsent(store: Store, studentId: string): Promise<boolean> {
  const consent = await store.getLatestConsent(studentId)
  return !!consent?.purposes?.includes('ai_analysis')
}
