export interface GapEntry {
  skillId: string
  skillLabel: string
  affectedPct: number  // 0..1, e.g. 0.58 for 58% of cohort
  importance: number
}

export interface Intervention {
  id: string
  title: string
  description: string
  targetSkillIds: string[]
  durationWeeks: number
  status: 'recommended' | 'in_progress' | 'completed'
}

export interface CohortInsight {
  cohortLabel: string             // e.g. "Business ปี 4"
  totalStudents: number
  topGaps: GapEntry[]
  recommendedInterventions: Intervention[]
  reportedAt: string              // ISO 8601 timestamp
}
