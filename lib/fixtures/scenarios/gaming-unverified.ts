import type { Scenario } from '../types'
import { BA_ROLE_REQUIREMENTS } from '../taxonomy/roleRequirements'
import type { Skill } from '@/lib/domain/evidence'
import type { ActionPlan } from '@/lib/domain/plan'

// Scene 2: Student claims "Python / SQL / AI / Data Science / PM expert" — all unverified
// Demonstrates: classifyEvidence → unverified_claim → Critic flags → red badges

const GAMING_SKILLS: Skill[] = [
  { id: 'sql-database',          label: 'SQL / ฐานข้อมูล',        durability: 0.80, status: 'unverified_claim', confidence: 0.15, evidence: [] },
  { id: 'python-programming',    label: 'Python Programming',      durability: 0.72, status: 'unverified_claim', confidence: 0.12, evidence: [] },
  { id: 'data-analysis',         label: 'การวิเคราะห์ข้อมูล',      durability: 0.85, status: 'unverified_claim', confidence: 0.10, evidence: [] },
  { id: 'data-visualization',    label: 'Data Visualization',      durability: 0.76, status: 'unverified_claim', confidence: 0.12, evidence: [] },
  { id: 'project-management',    label: 'Project Management',      durability: 0.79, status: 'unverified_claim', confidence: 0.10, evidence: [] },
  { id: 'stakeholder-communication', label: 'การสื่อสารกับ Stakeholder', durability: 0.82, status: 'unverified_claim', confidence: 0.15, evidence: [] },
  { id: 'analytical-thinking',   label: 'การคิดเชิงวิเคราะห์',    durability: 0.80, status: 'unverified_claim', confidence: 0.10, evidence: [] },
]

const GAMING_PLAN: ActionPlan = {
  id: 'plan-gaming-001',
  assessmentId: 'assessment-gaming-001',
  totalDays: 0,
  tasks: [],
}

export const GAMING_UNVERIFIED_SCENARIO: Scenario = {
  id: 'gaming-unverified',
  title: 'Gaming Detection',
  titleTh: 'ทดสอบระบบป้องกัน — อ้างทักษะโดยไม่มีหลักฐาน',
  surface: 'student',
  input: { kind: 'paste', targetRoleId: 'business-analyst', text: 'Python, SQL, AI, Data Science, Project Management expert with 5+ years experience' },
  targetRoleId: 'business-analyst',
  captions: {
    profile_analyzer:     ['กำลังอ่าน resume...', 'พบการอ้างทักษะ 7 รายการ'],
    evidence_verifier:    ['ค้นหาหลักฐานสำหรับแต่ละทักษะ...', 'ไม่พบ project / certificate / transcript / work sample สำหรับทักษะเหล่านี้'],
    role_fit:             ['เทียบกับ Business Analyst...'],
    skill_gap:            ['วิเคราะห์ gap...'],
    resilience:           ['คำนวณ resilience...', 'ข้อมูลไม่เพียงพอ — confidence ต่ำ'],
    action_plan:          ['ไม่สามารถสร้าง action plan ได้โดยไม่มีทักษะที่ verified'],
    critic:               ['⚠ ตรวจพบการอ้างทักษะโดยไม่มีหลักฐาน', 'ส่งไปยัง Advisor Queue...'],
    institution_insight:  ['บันทึก pattern สำหรับ cohort insight...'],
  },
  facts: {
    skills: GAMING_SKILLS,
    requirements: BA_ROLE_REQUIREMENTS,
    gaps: BA_ROLE_REQUIREMENTS.map(r => ({
      skillId: r.skillId,
      label: r.label,
      importance: r.importance,
      currentStatus: 'unverified_claim' as const,
      gapWeight: r.importance,
    })),
    plan: GAMING_PLAN,
  },
  flags: [
    {
      agent: 'critic',
      code: 'gaming_detected',
      message: 'นักศึกษาอ้างทักษะ 7 รายการ แต่ไม่มีหลักฐานใดเลย — ทักษะทั้งหมดถูกทำเครื่องหมายเป็น unverified_claim และส่งไปยัง Advisor สำหรับการตรวจสอบ',
      affectedSkillIds: GAMING_SKILLS.map(s => s.id),
      severity: 'veto',
    },
  ],
}
