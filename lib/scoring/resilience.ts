import type { Skill } from '@/lib/domain/evidence'
import type { Score } from '@/lib/domain/scores'
import { fmt } from './constants'

// Resilience: how future-proof are the student's verified skills? (0..1)
// Based on ESCO durability × breadth × automation exposure (§11).
// ALWAYS returned with a confidence interval — it's a forecast, not a fact.
export function resilience(skills: Skill[]): Score {
  const active = skills.filter(s =>
    ['verified_skill', 'partial_skill', 'transferable_skill'].includes(s.status)
  )

  if (active.length === 0) {
    return {
      id: 'resilience',
      value: 0,
      display: '0%',
      confidenceInterval: [0, 0.2],
      lowConfidence: true,
      trace: {
        inputs: [{ label: 'ทักษะที่ประเมินได้', value: 0 }],
        rule: 'ไม่มีทักษะ verified/partial เพียงพอ',
        contributions: [],
        caveats: [
          'ต้องการทักษะที่มีหลักฐานอย่างน้อย 1 รายการเพื่อคำนวณ',
        ],
      },
    }
  }

  const durabilities = active.map(s => s.durability ?? 0.5)
  const avgDurability = durabilities.reduce((a, b) => a + b, 0) / durabilities.length

  const transferableCount = skills.filter(s => s.status === 'transferable_skill').length
  const lowDurabilityCount = skills.filter(s => s.status === 'low_durability_skill').length

  // Small bonus for breadth (transferable skills), penalty for obsolescence risk
  const breadthBonus      = (transferableCount  / Math.max(active.length, 1)) * 0.10
  const exposurePenalty   = (lowDurabilityCount / Math.max(skills.length,  1)) * 0.15
  const raw = Math.max(0, Math.min(1, avgDurability + breadthBonus - exposurePenalty))

  // CI widens when fewer active skills (less evidence for the forecast)
  const ciHalfWidth = Math.max(0.05, 0.20 - active.length * 0.025)
  const confidenceInterval: [number, number] = [
    Math.max(0, raw - ciHalfWidth),
    Math.min(1, raw + ciHalfWidth),
  ]

  const lowConfidence = active.length < 3

  return {
    id: 'resilience',
    value: raw,
    display: fmt(raw),
    confidenceInterval,
    lowConfidence,
    trace: {
      inputs: [
        { label: 'ทักษะที่ประเมินได้',        value: active.length },
        { label: 'ค่าเฉลี่ย durability',       value: avgDurability.toFixed(3) },
        { label: 'Transferable skill bonus',   value: breadthBonus.toFixed(3) },
        { label: 'Low-durability penalty',     value: (-exposurePenalty).toFixed(3) },
        { label: 'Confidence interval ±',      value: ciHalfWidth.toFixed(3) },
      ],
      rule: 'avg(durability) + breadthBonus − exposurePenalty — durability จาก ESCO/O*NET taxonomy',
      contributions: active.map((s, i) => ({ label: s.label, delta: durabilities[i] / active.length })),
      caveats: [
        'นี่คือการพยากรณ์พร้อม Confidence Interval — ไม่ใช่การรับประกันความมั่นคงของอาชีพ',
        'ข้อมูล durability อ้างอิงจาก ESCO taxonomy ณ ปัจจุบัน อาจเปลี่ยนแปลงตามตลาดแรงงาน',
      ],
    },
  }
}
