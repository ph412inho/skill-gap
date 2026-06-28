import type { ActionPlan } from '@/lib/domain/plan'
import type { Score } from '@/lib/domain/scores'
import { fmt } from './constants'

const MAX_FEASIBLE_DAYS = 14  // 2-week window

// Actionability: what % of the plan is realistically doable in 2–4 weeks?
export function actionability(plan: ActionPlan): Score {
  if (plan.tasks.length === 0) {
    return {
      id: 'actionability',
      value: 0,
      display: '0%',
      lowConfidence: true,
      trace: {
        inputs: [{ label: 'จำนวน task', value: 0 }],
        rule: 'ยังไม่มี Action Plan',
        contributions: [],
        caveats: [],
      },
    }
  }

  const feasible = plan.tasks.filter(t => t.feasible && t.durationDays <= MAX_FEASIBLE_DAYS)
  const value = feasible.length / plan.tasks.length
  const lowConfidence = plan.tasks.length < 2

  return {
    id: 'actionability',
    value,
    display: fmt(value),
    lowConfidence,
    trace: {
      inputs: [
        { label: 'Task ทั้งหมด',                              value: plan.tasks.length },
        { label: `Task ที่ทำได้ใน ${MAX_FEASIBLE_DAYS} วัน`, value: feasible.length },
        { label: 'รวมวันที่ใช้',                              value: plan.totalDays },
      ],
      rule: `จำนวน task ที่ทำได้ (feasible=true และ ≤${MAX_FEASIBLE_DAYS} วัน) ÷ task ทั้งหมด`,
      contributions: plan.tasks.map(t => ({
        label: t.title,
        delta: (t.feasible && t.durationDays <= MAX_FEASIBLE_DAYS) ? 1 / plan.tasks.length : 0,
      })),
      caveats: [
        'ประเมินจาก task size ที่วางแผนไว้ — อาจเปลี่ยนตามความพร้อมของนักศึกษา',
      ],
    },
  }
}
