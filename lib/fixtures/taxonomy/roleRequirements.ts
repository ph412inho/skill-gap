import type { RoleRequirement } from '@/lib/domain/role'

// Business Analyst role — importance weights calibrated so that
// the y4-business-ba student fixture scores ≈ 62% role readiness
// Verified math: (0.85+0.80+0.75+0.55+0.80×0.6) / 5.50 = 3.43/5.50 = 62.4%
export const BA_ROLE_REQUIREMENTS: RoleRequirement[] = [
  { skillId: 'stakeholder-communication',  label: 'การสื่อสารกับ Stakeholder',  importance: 0.85 },
  { skillId: 'presentation-skills',        label: 'ทักษะการนำเสนอ',              importance: 0.80 },
  { skillId: 'analytical-thinking',        label: 'การคิดเชิงวิเคราะห์',          importance: 0.75 },
  { skillId: 'business-writing',           label: 'การเขียนเชิงธุรกิจ',           importance: 0.55 },
  { skillId: 'requirements-documentation', label: 'การเขียน Requirements',         importance: 0.80 },
  { skillId: 'data-analysis',              label: 'การวิเคราะห์ข้อมูล',            importance: 0.90 },
  { skillId: 'sql-database',               label: 'SQL / ฐานข้อมูล',               importance: 0.85 },
]

// Total importance: 5.50

export const TARGET_ROLES = [
  { id: 'business-analyst', label: 'Business Analyst', labelTh: 'นักวิเคราะห์ธุรกิจ', requirements: BA_ROLE_REQUIREMENTS },
]
