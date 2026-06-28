import type { Skill } from '@/lib/domain/evidence'
import type { RoleRequirement } from '@/lib/domain/role'
import type { Score } from '@/lib/domain/scores'
import { STATUS_WEIGHTS, fmt } from './constants'

// Role Readiness: how close the student is to the target role (0..1)
// Formula: Σ(importance_i × statusWeight_i) / Σ(importance_i)  for required skills
// statusWeight: verified=1.0, partial=0.6, transferable=0.3, everything else=0
export function roleReadiness(skills: Skill[], requirements: RoleRequirement[]): Score {
  const skillMap = new Map(skills.map(s => [s.id, s]))

  let achieved = 0
  let total = 0
  const contributions: { label: string; delta: number }[] = []

  for (const req of requirements) {
    total += req.importance
    const skill = skillMap.get(req.skillId)
    const weight = skill ? (STATUS_WEIGHTS[skill.status] ?? 0) : 0
    const delta = req.importance * weight
    achieved += delta
    contributions.push({ label: req.label, delta })
  }

  const value = total > 0 ? achieved / total : 0
  const lowConfidence = value < 0.3

  return {
    id: 'role_readiness',
    value,
    display: fmt(value),
    lowConfidence,
    trace: {
      inputs: [
        { label: 'ทักษะที่ตรวจสอบแล้ว (verified)', value: skills.filter(s => s.status === 'verified_skill').length },
        { label: 'ทักษะที่มีหลักฐานบางส่วน (partial)', value: skills.filter(s => s.status === 'partial_skill').length },
        { label: 'ทักษะที่ต้องการทั้งหมด (required)', value: requirements.length },
        { label: 'ผลรวม importance', value: total.toFixed(2) },
      ],
      rule: 'Σ(importance × น้ำหนักสถานะ) ÷ Σ(importance) — verified=1.0, partial=0.6, transferable=0.3',
      contributions,
      caveats: [
        'คะแนนนี้วัดความพร้อมของหลักฐาน ไม่ใช่การทำนายว่าจะได้งานหรือไม่',
        'น้ำหนักสถานะคำนวณจากกฎที่กำหนดไว้ ไม่ใช่ AI',
      ],
    },
  }
}
