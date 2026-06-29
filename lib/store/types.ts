// The storage seam — mirrors the getOrchestrator() pattern (lib/orchestrator/index.ts).
// MemoryStore (default, offline) and PostgresStore (pilot) implement this identical
// interface; the rest of the app only ever depends on Store via getStore().
//
// All methods are async so the same interface backs both an in-memory Map and a real DB.

import type { AnalyzeRequest } from '@/lib/orchestrator/types'
import type { AnalysisResult } from '@/lib/domain/analysis'
import type { ConsentRecord } from '@/lib/domain/profile'
import type { Assessment, Proof, AdvisorReview, AuditLog, LlmRun } from '@/lib/domain/loop'

export interface Store {
  // ── Run lifecycle (the analyze stream) ──────────────────────────────────
  storeRun(req: AnalyzeRequest): Promise<void>
  getActiveRun(runId: string): Promise<AnalyzeRequest | null>
  storeResult(runId: string, result: AnalysisResult): Promise<void>
  getResult(runId: string): Promise<AnalysisResult | null>

  // ── Consent (PDPA gate; checked before any AI run) ──────────────────────
  saveConsent(c: ConsentRecord): Promise<void>
  getLatestConsent(studentId: string): Promise<ConsentRecord | null>

  // ── Assessments (versioned snapshots; A0) ───────────────────────────────
  saveAssessment(a: Assessment): Promise<void>
  getAssessment(id: string): Promise<Assessment | null>
  getAssessmentByRun(runId: string): Promise<Assessment | null>  // 1:1 with a run
  // ordered by version ascending; v1 = baseline
  listAssessmentsByStudent(studentId: string): Promise<Assessment[]>
  getLatestAssessment(studentId: string): Promise<Assessment | null>

  // ── Proofs (A1) ─────────────────────────────────────────────────────────
  saveProof(p: Proof): Promise<void>
  getProof(id: string): Promise<Proof | null>
  updateProof(p: Proof): Promise<void>
  listProofsByAssessment(assessmentId: string): Promise<Proof[]>

  // ── Advisor review (B1/B2) ──────────────────────────────────────────────
  saveReview(r: AdvisorReview): Promise<void>
  listReviewsByAssessment(assessmentId: string): Promise<AdvisorReview[]>
  // the advisor queue: assessments with guardrail flags or proofs needing review
  listAdvisorQueue(): Promise<Assessment[]>

  // ── PDPA audit + AI-run logs (api-conventions.md) ───────────────────────
  appendAudit(log: AuditLog): Promise<void>
  listAudit(subjectId: string): Promise<AuditLog[]>
  appendLlmRun(run: LlmRun): Promise<void>
}
