// In-memory Store implementation — the offline default (pitch / dev / mock mode).
// Replaces the old lib/store/runs.ts module-level helpers. State is pinned to `global`
// so the Maps survive Next.js hot-module re-evaluation in dev (a fresh `const Map`
// would reset on every reload; global does not).
//
// Note: this store is process-local and non-durable. For a real pilot (cross-session,
// cross-device, before→after that survives a restart) use PostgresStore via getStore().

import type { Store } from './types'
import type { AnalyzeRequest } from '@/lib/orchestrator/types'
import type { AnalysisResult } from '@/lib/domain/analysis'
import type { ConsentRecord } from '@/lib/domain/profile'
import type { Assessment, Proof, AdvisorReview, AuditLog, LlmRun } from '@/lib/domain/loop'

interface RunEntry {
  request: AnalyzeRequest
  result?: AnalysisResult
  createdAt: number
}

interface MemoryState {
  runs: Map<string, RunEntry>
  consents: ConsentRecord[]
  assessments: Map<string, Assessment>
  proofs: Map<string, Proof>
  reviews: Map<string, AdvisorReview>
  audit: AuditLog[]
  llmRuns: LlmRun[]
}

const g = global as typeof global & { __memStore?: MemoryState }
const state: MemoryState =
  g.__memStore ??
  (g.__memStore = {
    runs: new Map(),
    consents: [],
    assessments: new Map(),
    proofs: new Map(),
    reviews: new Map(),
    audit: [],
    llmRuns: [],
  })

const RUN_TTL_MS = 30 * 60 * 1000

export class MemoryStore implements Store {
  // ── Run lifecycle ──
  async storeRun(req: AnalyzeRequest): Promise<void> {
    state.runs.set(req.runId, { request: req, createdAt: Date.now() })
    setTimeout(() => state.runs.delete(req.runId), RUN_TTL_MS)
  }

  async getActiveRun(runId: string): Promise<AnalyzeRequest | null> {
    return state.runs.get(runId)?.request ?? null
  }

  async storeResult(runId: string, result: AnalysisResult): Promise<void> {
    const entry = state.runs.get(runId)
    if (entry) entry.result = result
  }

  async getResult(runId: string): Promise<AnalysisResult | null> {
    return state.runs.get(runId)?.result ?? null
  }

  // ── Consent ──
  async saveConsent(c: ConsentRecord): Promise<void> {
    state.consents.push(c)
  }

  async getLatestConsent(studentId: string): Promise<ConsentRecord | null> {
    const mine = state.consents.filter(c => c.studentId === studentId)
    return mine.length ? mine[mine.length - 1] : null
  }

  // ── Assessments ──
  async saveAssessment(a: Assessment): Promise<void> {
    state.assessments.set(a.id, a)
  }

  async getAssessment(id: string): Promise<Assessment | null> {
    return state.assessments.get(id) ?? null
  }

  async getAssessmentByRun(runId: string): Promise<Assessment | null> {
    return [...state.assessments.values()]
      .filter(a => a.runId === runId)
      .sort((x, y) => y.version - x.version)[0] ?? null
  }

  async listAssessmentsByStudent(studentId: string): Promise<Assessment[]> {
    return [...state.assessments.values()]
      .filter(a => a.studentId === studentId)
      .sort((x, y) => x.version - y.version)
  }

  async getLatestAssessment(studentId: string): Promise<Assessment | null> {
    const all = await this.listAssessmentsByStudent(studentId)
    return all.length ? all[all.length - 1] : null
  }

  // ── Proofs ──
  async saveProof(p: Proof): Promise<void> {
    state.proofs.set(p.id, p)
  }

  async getProof(id: string): Promise<Proof | null> {
    return state.proofs.get(id) ?? null
  }

  async updateProof(p: Proof): Promise<void> {
    state.proofs.set(p.id, p)
  }

  async listProofsByAssessment(assessmentId: string): Promise<Proof[]> {
    return [...state.proofs.values()]
      .filter(p => p.assessmentId === assessmentId)
      .sort((x, y) => x.submittedAt.localeCompare(y.submittedAt))
  }

  // ── Advisor review ──
  async saveReview(r: AdvisorReview): Promise<void> {
    state.reviews.set(r.id, r)
  }

  async listReviewsByAssessment(assessmentId: string): Promise<AdvisorReview[]> {
    return [...state.reviews.values()]
      .filter(r => r.assessmentId === assessmentId)
      .sort((x, y) => x.reviewedAt.localeCompare(y.reviewedAt))
  }

  async listAdvisorQueue(): Promise<Assessment[]> {
    const flaggedProofAssessmentIds = new Set(
      [...state.proofs.values()].filter(p => p.state === 'needs_advisor').map(p => p.assessmentId),
    )
    return [...state.assessments.values()]
      .filter(a => a.result.flags.length > 0 || flaggedProofAssessmentIds.has(a.id))
      .sort((x, y) => y.createdAt.localeCompare(x.createdAt))
  }

  // ── Audit + AI logs ──
  async appendAudit(log: AuditLog): Promise<void> {
    state.audit.push(log)
  }

  async listAudit(subjectId: string): Promise<AuditLog[]> {
    return state.audit.filter(l => l.subjectId === subjectId)
  }

  async appendLlmRun(run: LlmRun): Promise<void> {
    state.llmRuns.push(run)
  }
}
