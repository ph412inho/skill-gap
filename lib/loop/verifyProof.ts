// Bounded auto-verify (A1). DECIDED: a strong proof may flip a skill automatically —
// but ONLY when this verifier confirms the artifact is reachable AND relevant at high
// confidence. Anything else routes to an advisor (B1). This is the guardrail that keeps
// auto-verify inside the no-fabrication rule: a skill never flips on a student's word
// or a dead / irrelevant link.
//
// MOCK behavior (deterministic, testable): we judge the URL shape + host, not its
// contents. In live mode this is replaced by the evidence-verifier agent, which actually
// fetches the artifact and checks it evidences the claimed skill.

import type { ProofType } from '@/lib/domain/plan'
import type { ProofSource, EvidenceVerification } from '@/lib/domain/loop'
import type { EvidenceStatus } from '@/lib/domain/evidence'

export const HIGH_THRESHOLD = 0.8   // confidence at/above which a skill auto-verifies

// Hosts we treat as credible artifact platforms for a given proof type.
const KNOWN_HOSTS = [
  'github.com', 'gitlab.com', 'bitbucket.org',
  'kaggle.com', 'colab.research.google.com', 'nbviewer.org',
  'notion.so', 'docs.google.com', 'drive.google.com',
  'figma.com', 'medium.com', 'observablehq.com',
  'youtu.be', 'youtube.com', 'loom.com', 'vimeo.com',
]

function hostOf(url: string): string | null {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return null }
}

export interface VerifyInput {
  proofType: ProofType
  source: ProofSource
  url?: string
  filename?: string
}

export function verifyProof(input: VerifyInput, now: string): EvidenceVerification {
  const base = { proofId: '', verifiedAt: now }

  // Uploaded file: we can't inspect contents in the POC → always human review.
  if (input.source === 'file') {
    return {
      ...base,
      reachable: !!input.filename,
      relevant: false,
      confidence: 0.5,
      outcome: 'routed_to_advisor',
      rationale: 'อัปโหลดไฟล์ — ระบบยังตรวจเนื้อหาไฟล์อัตโนมัติไม่ได้ จึงส่งให้ที่ปรึกษายืนยัน (human-in-loop)',
    }
  }

  const url = (input.url ?? '').trim()
  const host = hostOf(url)

  // Not a resolvable URL → reject (never flips a skill).
  if (!host || !/^https?:$/.test(new URL(url).protocol)) {
    return {
      ...base,
      reachable: false,
      relevant: false,
      confidence: 0.15,
      outcome: 'rejected',
      rationale: 'ลิงก์ไม่ถูกต้องหรือเปิดไม่ได้ — ไม่สามารถใช้เป็นหลักฐานได้',
    }
  }

  const known = KNOWN_HOSTS.some(h => host === h || host.endsWith('.' + h))

  if (known) {
    const confidence = 0.85
    const newStatus: EvidenceStatus = 'verified_skill'
    return {
      ...base,
      reachable: true,
      relevant: true,
      confidence,
      outcome: confidence >= HIGH_THRESHOLD ? 'auto_verified' : 'routed_to_advisor',
      newStatus: confidence >= HIGH_THRESHOLD ? newStatus : undefined,
      rationale: `พบ artifact บน ${host} ซึ่งเป็นแพลตฟอร์มหลักฐานที่น่าเชื่อถือ — ยืนยันอัตโนมัติ (confidence ${confidence})`,
    }
  }

  // Well-formed but unfamiliar host → can't confirm relevance → human review.
  return {
    ...base,
    reachable: true,
    relevant: false,
    confidence: 0.6,
    outcome: 'routed_to_advisor',
    rationale: `ลิงก์เปิดได้ (${host}) แต่ระบบยืนยันความเกี่ยวข้องกับทักษะอัตโนมัติไม่ได้ — ส่งให้ที่ปรึกษาตรวจสอบ`,
  }
}
