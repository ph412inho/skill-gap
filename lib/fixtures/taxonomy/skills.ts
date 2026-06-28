// Seed skill taxonomy for the demo — subset of ESCO/O*NET aligned skills
// durability: 0..1 (1 = extremely durable/transferable, 0 = high obsolescence risk)

export interface TaxonomySkill {
  id: string
  label: string
  labelTh: string
  escoId?: string
  onetId?: string
  durability: number
}

export const TAXONOMY_SKILLS: TaxonomySkill[] = [
  { id: 'stakeholder-communication', label: 'Stakeholder Communication', labelTh: 'การสื่อสารกับ Stakeholder', durability: 0.82 },
  { id: 'presentation-skills',       label: 'Presentation Skills',       labelTh: 'ทักษะการนำเสนอ',           durability: 0.85 },
  { id: 'analytical-thinking',       label: 'Analytical Thinking',       labelTh: 'การคิดเชิงวิเคราะห์',       durability: 0.80 },
  { id: 'business-writing',          label: 'Business Writing',          labelTh: 'การเขียนเชิงธุรกิจ',        durability: 0.78 },
  { id: 'requirements-documentation',label: 'Requirements Documentation',labelTh: 'การเขียน Requirements',      durability: 0.88 },
  { id: 'data-analysis',             label: 'Data Analysis',             labelTh: 'การวิเคราะห์ข้อมูล',        durability: 0.85 },
  { id: 'sql-database',              label: 'SQL / Database',            labelTh: 'SQL / ฐานข้อมูล',           durability: 0.80 },
  { id: 'python-programming',        label: 'Python Programming',        labelTh: 'การเขียนโปรแกรม Python',    durability: 0.72 },
  { id: 'data-visualization',        label: 'Data Visualization',        labelTh: 'การสร้าง Dashboard',         durability: 0.76 },
  { id: 'project-management',        label: 'Project Management',        labelTh: 'การจัดการโครงการ',           durability: 0.79 },
]

export const TAXONOMY_MAP = new Map<string, TaxonomySkill>(
  TAXONOMY_SKILLS.map(s => [s.id, s])
)
