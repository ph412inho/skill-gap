import type { Skill } from '@/lib/domain/evidence'
import type { Score } from '@/lib/domain/scores'
import { EVIDENCE_QUALITY_WEIGHTS, fmt } from './constants'

// Evidence Strength: of all skills the student CLAIMS, how many are backed by artifacts?
// "claimed" = any status except 'skill_gap' (skill_gap means not even claimed)
export function evidenceStrength(skills: Skill[]): Score {
  const claimed = skills.filter(s => s.status !== 'skill_gap')

  if (claimed.length === 0) {
    return {
      id: 'evidence_strength',
      value: 0,
      display: '0%',
      lowConfidence: true,
      trace: {
        inputs: [{ label: 'ทักษะที่อ้างสิทธิ์', value: 0 }],
        rule: 'ไม่มีทักษะที่อ้างสิทธิ์',
        contributions: [],
        caveats: ['ไม่มีข้อมูลเพียงพอในการประเมิน'],
      },
    }
  }

  let evidenced = 0
  const contributions: { label: string; delta: number }[] = []

  for (const skill of claimed) {
    const weight = EVIDENCE_QUALITY_WEIGHTS[skill.status] ?? 0
    evidenced += weight
    contributions.push({ label: skill.label, delta: weight })
  }

  const value = evidenced / claimed.length
  const lowConfidence = value < 0.3

  return {
    id: 'evidence_strength',
    value,
    display: fmt(value),
    lowConfidence,
    trace: {
      inputs: [
        { label: 'ทักษะที่อ้างสิทธิ์ทั้งหมด', value: claimed.length },
        { label: 'มี evidence จริง (verified)', value: claimed.filter(s => s.status === 'verified_skill').length },
        { label: 'มี evidence บางส่วน (partial)', value: claimed.filter(s => s.status === 'partial_skill').length },
        { label: 'อ้างโดยไม่มีหลักฐาน', value: claimed.filter(s => ['unverified_claim','evidence_gap','weak_evidence'].includes(s.status)).length },
      ],
      rule: 'Σ(น้ำหนักคุณภาพหลักฐาน) ÷ จำนวนทักษะที่อ้างสิทธิ์ทั้งหมด — verified=1.0, partial=0.6, weak=0.2',
      contributions,
      caveats: [
        'วัดความน่าเชื่อถือของหลักฐาน ไม่ใช่ระดับทักษะที่แท้จริง',
        'เพิ่มคะแนนได้โดยอัปโหลดโปรเจกต์ เกียรติบัตร หรือ transcript เพิ่มเติม',
      ],
    },
  }
}
