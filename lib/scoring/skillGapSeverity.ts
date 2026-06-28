import type { Skill } from '@/lib/domain/evidence'
import type { RoleRequirement, RankedGap } from '@/lib/domain/role'
import type { Score } from '@/lib/domain/scores'
import { STATUS_WEIGHTS, fmt } from './constants'

// Skill Gap Severity: how much of the role requirement is still missing or weak (0..1)
// value=0 means no gaps; value=1 means completely unready.
// The trace carries the RANKED GAP LIST that drives the UI.
export function skillGapSeverity(skills: Skill[], requirements: RoleRequirement[]): Score {
  const skillMap = new Map(skills.map(s => [s.id, s]))

  const gaps: RankedGap[] = []
  let totalImportance = 0
  let totalGapWeight  = 0

  for (const req of requirements) {
    totalImportance += req.importance
    const skill = skillMap.get(req.skillId)
    const statusWeight = skill ? (STATUS_WEIGHTS[skill.status] ?? 0) : 0
    const gapFraction  = 1 - statusWeight   // 0 = no gap, 1 = full gap

    if (gapFraction > 0) {
      const gapWeight = req.importance * gapFraction
      totalGapWeight += gapWeight
      gaps.push({
        skillId: req.skillId,
        label:   req.label,
        importance: req.importance,
        currentStatus: skill?.status ?? 'skill_gap',
        gapWeight,
      })
    }
  }

  // Most critical gaps first
  gaps.sort((a, b) => b.gapWeight - a.gapWeight)

  const value = totalImportance > 0 ? totalGapWeight / totalImportance : 0
  const lowConfidence = gaps.length === 0 && skills.length === 0

  return {
    id: 'skill_gap_severity',
    value,
    display: fmt(value),
    lowConfidence,
    trace: {
      inputs: [
        { label: 'ทักษะที่ขาด / อ่อน',      value: gaps.length },
        { label: 'ผลรวม importance รวม',     value: totalImportance.toFixed(2) },
        { label: 'ผลรวม gap weight',          value: totalGapWeight.toFixed(2) },
      ],
      rule: 'Σ(importance_i × (1 − น้ำหนักสถานะ_i)) ÷ Σ(importance_i) — ยิ่งสูงยิ่ง gap มาก',
      contributions: gaps.map(g => ({ label: g.label, delta: g.gapWeight })),
      caveats: [
        'อันดับ gap คำนวณจาก importance × ระดับที่ขาด ไม่ใช่ความยากของการพัฒนา',
      ],
    },
  }
}
