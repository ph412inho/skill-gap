import type { Scenario } from '../types'
import { BA_ROLE_REQUIREMENTS } from '../taxonomy/roleRequirements'
import type { ActionPlan } from '@/lib/domain/plan'

const EMPTY_PLAN: ActionPlan = {
  id: 'plan-cohort-001',
  assessmentId: 'cohort',
  totalDays: 0,
  tasks: [],
}

// Scene 3: Career-center cohort view — 58% of Business Y4 has data evidence gap
// Surface: institution. Shows recommended intervention, no individual names.
export const COHORT_DATA_GAP_SCENARIO: Scenario = {
  id: 'cohort-data-gap',
  title: 'Cohort Insight',
  titleTh: 'Cohort Insight — Business ปี 4',
  surface: 'cohort',
  input: { kind: 'paste', targetRoleId: 'business-analyst', text: '' },
  targetRoleId: 'business-analyst',
  captions: {
    institution_insight: ['รวบรวมข้อมูล 124 คน...', 'วิเคราะห์ pattern ของ gap...', 'สร้าง Cohort Insight Report...'],
  },
  facts: {
    skills: [],
    requirements: BA_ROLE_REQUIREMENTS,
    gaps: [],
    plan: EMPTY_PLAN,
    cohort: {
      cohortLabel: 'Business ปี 4',
      totalStudents: 124,
      topGaps: [
        { skillId: 'data-analysis',              skillLabel: 'การวิเคราะห์ข้อมูล',      affectedPct: 0.58, importance: 0.90 },
        { skillId: 'sql-database',               skillLabel: 'SQL / ฐานข้อมูล',          affectedPct: 0.52, importance: 0.85 },
        { skillId: 'requirements-documentation', skillLabel: 'การเขียน Requirements',     affectedPct: 0.41, importance: 0.80 },
        { skillId: 'data-visualization',         skillLabel: 'Data Visualization',         affectedPct: 0.37, importance: 0.76 },
      ],
      recommendedInterventions: [
        {
          id: 'intervention-data-sprint',
          title: 'Data Portfolio Sprint',
          description: 'Workshop เข้มข้น 2 สัปดาห์ก่อนฤดูกาลสมัครงาน — SQL + Python + Dashboard โดยใช้ dataset จริงจากภาคธุรกิจไทย',
          targetSkillIds: ['data-analysis', 'sql-database', 'data-visualization'],
          durationWeeks: 2,
          status: 'recommended',
        },
        {
          id: 'intervention-brd-workshop',
          title: 'Business Requirements Workshop',
          description: 'Workshop เขียน BRD จากกรณีศึกษาจริง พร้อม Peer Review โดย Advisor',
          targetSkillIds: ['requirements-documentation'],
          durationWeeks: 1,
          status: 'recommended',
        },
      ],
      reportedAt: '2026-06-28T08:00:00.000Z',
    },
  },
  flags: [],
}
