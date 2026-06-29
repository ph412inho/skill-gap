// The proof-of-help loop (§A of UX_IMPROVEMENT_PLAN.md).
// This is the heart of the product thesis: a student acts, submits proof, evidence is
// verified (auto or by an advisor), and readiness moves — visibly and explainably.
// All identifiers English; comments may mix Thai + technical English.

import type { ProofType } from './plan'
import type { EvidenceStatus } from './evidence'
import type { ScoreId } from './scores'
import type { AnalysisResult } from './analysis'

// ── Versioned assessment ───────────────────────────────────────────────────
// A snapshot of one analysis. version 1 = baseline; v2+ = re-assessment after proofs.
// parentId links a re-assessment back to the assessment it re-scores from, so the
// before→after delta (ReadinessDelta) can be computed deterministically.
export interface Assessment {
  id: string
  studentId: string
  runId: string                 // the analyze run that produced this snapshot
  version: number               // 1 = baseline
  parentId: string | null       // previous assessment this one re-scores from
  targetRoleId: string
  result: AnalysisResult        // full snapshot: profile, skills, scores, plan, flags
  createdAt: string             // ISO 8601
}

// ── Proof lifecycle (A1) ───────────────────────────────────────────────────
export type ProofState =
  | 'todo'          // task not started
  | 'submitted'     // student attached an artifact
  | 'verifying'     // evidence-verifier is checking it
  | 'verified'      // auto-verified at high confidence (skill flipped)
  | 'needs_advisor' // could not auto-verify → routed to advisor queue (B1)
  | 'rejected'      // unreachable / irrelevant artifact

export type ProofSource = 'link' | 'file'

export interface Proof {
  id: string
  assessmentId: string          // assessment whose action plan this proof belongs to
  actionItemId: string          // ActionItem.id from the plan
  skillId: string
  proofType: ProofType
  source: ProofSource
  url?: string                  // when source = 'link'
  filename?: string             // when source = 'file' (mocked storage in POC)
  state: ProofState
  submittedAt: string           // ISO 8601
  verification?: EvidenceVerification
}

// ── Evidence verification (A1 auto-verify, bounded by the no-fabrication rule) ─
// The evidence-verifier decides whether a submitted artifact may flip a skill.
// Auto-verify ONLY when reachable && relevant && confidence >= HIGH_THRESHOLD;
// anything else routes to an advisor. A skill never flips on a student's assertion
// or an unresolvable / irrelevant link.
export interface EvidenceVerification {
  proofId: string
  reachable: boolean            // did the link resolve / the file parse
  relevant: boolean             // does the artifact actually evidence the claimed skill
  confidence: number            // 0..1
  outcome: 'auto_verified' | 'routed_to_advisor' | 'rejected'
  newStatus?: EvidenceStatus    // status the skill moves to on success
  rationale: string             // XAI "why" for this verification decision (clickable)
  verifiedAt: string            // ISO 8601
}

// ── Advisor review (B2) — the human half of the loop ───────────────────────
export type AdvisorAction =
  | 'approve'             // assessment looks correct as-is
  | 'override_score'      // change a score value (audit-logged, shown to student)
  | 'verify_evidence'     // confirm a proof/skill the system couldn't auto-verify
  | 'request_more_proof'  // bounce back to the student for a stronger artifact
  | 'reject'              // reject a submitted proof

export interface AdvisorReview {
  id: string
  assessmentId: string
  advisorId: string
  action: AdvisorAction
  targetSkillId?: string        // for verify_evidence / status change
  targetScoreId?: ScoreId       // for override_score
  overrideValue?: number        // new 0..1 score value when action = override_score
  newSkillStatus?: EvidenceStatus
  note: string                  // surfaced to the student as "verified by advisor"; audited
  reviewedAt: string            // ISO 8601
}

// ── The before→after delta (A3 money shot) — derived + explainable ─────────
export interface SkillFlip {
  skillId: string
  label: string
  from: EvidenceStatus
  to: EvidenceStatus
  drivenBy: 'auto_verify' | 'advisor'   // provenance of the change
  proofId?: string
}

export interface ScoreDelta {
  id: ScoreId
  before: number
  after: number
  delta: number                 // after - before
}

export interface ReadinessDelta {
  studentId: string
  fromAssessmentId: string      // v1 (baseline)
  toAssessmentId: string        // v2 (re-assessment)
  scoreDeltas: ScoreDelta[]
  skillFlips: SkillFlip[]
  proofsVerified: number
  proofsTotal: number
  // Plain-language "why it moved" — no employment claims; phrased as readiness/evidence.
  summary: string
}

// ── PDPA audit + AI-run logs (cross-cutting; api-conventions.md) ───────────
export type AuditAction =
  | 'consent_granted'
  | 'analysis_run'
  | 'proof_submitted'
  | 'evidence_auto_verified'
  | 'evidence_routed_to_advisor'
  | 'advisor_review'
  | 'reassessment_run'

export type ActorRole = 'student' | 'advisor' | 'career_center' | 'admin' | 'system'

export interface AuditLog {
  id: string
  actorId: string
  actorRole: ActorRole
  action: AuditAction
  subjectId: string             // id of the assessment / proof / review affected
  detail?: string
  at: string                    // ISO 8601
}

// AI endpoints write to llm_runs (api-conventions.md). One row per agent run.
export interface LlmRun {
  id: string
  runId: string
  agent: string
  confidence: number
  flags: string[]
  promptTokens?: number
  completionTokens?: number
  at: string                    // ISO 8601
}
