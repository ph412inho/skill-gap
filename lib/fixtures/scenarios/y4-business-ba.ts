import type { Skill } from '@/lib/domain/evidence'
import type { ActionPlan } from '@/lib/domain/plan'
import type { ParsedProfile } from '@/lib/domain/profile'
import type { Scenario } from '../types'
import { BA_ROLE_REQUIREMENTS } from '../taxonomy/roleRequirements'

// Scene 1: Y4 Business student → Business Analyst path
// Gap is EVIDENCE, not knowledge — the headline insight

export const Y4_BA_PROFILE: ParsedProfile = {
  studentName: 'นุ่น สิริกร',
  studentId: 'demo-student-001',
  programLabel: 'บริหารธุรกิจ — จุฬาลงกรณ์มหาวิทยาลัย',
  yearOfStudy: 4,
  rawSummary: 'นักศึกษาปี 4 สาขาบริหารธุรกิจ มีประสบการณ์ฝึกงาน SCB และเคยทำโปรเจกต์วิจัยตลาด ต้องการเป็น Business Analyst',
  skillClaims: [],
}

// Durabilities sourced from TAXONOMY_SKILLS (taxonomy/skills.ts)
export const Y4_BA_SKILLS: Skill[] = [
  {
    id: 'stakeholder-communication',
    label: 'การสื่อสารกับ Stakeholder',
    durability: 0.82,
    status: 'verified_skill',
    confidence: 0.92,
    evidence: [
      { kind: 'project',    label: 'ฝึกงาน SCB — นำ Weekly Meeting กับ Business Users', excerpt: 'Led weekly stakeholder alignment sessions with 8 business users across 3 departments' },
      { kind: 'advisor',    label: 'Advisor ยืนยัน — อ.ศิริวรรณ วุฒิประภา',             excerpt: 'Demonstrated strong stakeholder communication during capstone project review' },
    ],
  },
  {
    id: 'presentation-skills',
    label: 'ทักษะการนำเสนอ',
    durability: 0.85,
    status: 'verified_skill',
    confidence: 0.90,
    evidence: [
      { kind: 'work_sample', label: 'Business Case Presentation — Senior Year',         excerpt: 'Final presentation deck + recording, graded A' },
      { kind: 'transcript',  label: 'Business Communication — เกรด A',                  excerpt: 'Grade A in BUS3201 Business Communication' },
    ],
  },
  {
    id: 'analytical-thinking',
    label: 'การคิดเชิงวิเคราะห์',
    durability: 0.80,
    status: 'verified_skill',
    confidence: 0.88,
    evidence: [
      { kind: 'project',    label: 'Market Research Project — หัวหน้าทีม',              excerpt: '10-page market analysis report with competitive benchmarking' },
      { kind: 'transcript', label: 'Business Statistics — เกรด B+',                     excerpt: 'Grade B+ in STAT2101 Business Statistics' },
    ],
  },
  {
    id: 'business-writing',
    label: 'การเขียนเชิงธุรกิจ',
    durability: 0.78,
    status: 'verified_skill',
    confidence: 0.85,
    evidence: [
      { kind: 'project',    label: 'Business Proposal — Startup Competition',           excerpt: '12-page business proposal submitted to NSTDA Youth Startup 2023' },
      { kind: 'transcript', label: 'Business Writing — เกรด A',                         excerpt: 'Grade A in BUS2301 Business Writing' },
    ],
  },
  {
    id: 'requirements-documentation',
    label: 'การเขียน Requirements',
    durability: 0.88,
    status: 'partial_skill',
    confidence: 0.65,
    evidence: [
      { kind: 'project',    label: 'System Requirements — Course Project (brief)',      excerpt: 'Wrote 3-page requirements document for a mock inventory system in MIS3401' },
    ],
  },
  {
    id: 'data-analysis',
    label: 'การวิเคราะห์ข้อมูล',
    durability: 0.85,
    // Has knowledge from coursework but no artifact to prove it
    status: 'evidence_gap',
    confidence: 0.45,
    evidence: [],
  },
  {
    id: 'sql-database',
    label: 'SQL / ฐานข้อมูล',
    durability: 0.80,
    // Claimed on resume but no supporting project, certificate, or transcript
    status: 'unverified_claim',
    confidence: 0.30,
    evidence: [],
  },
]

export const Y4_BA_PLAN: ActionPlan = {
  id: 'plan-y4-ba-001',
  assessmentId: 'assessment-y4-ba-001',
  totalDays: 13,
  tasks: [
    {
      id: 'task-001',
      skillId: 'sql-database',
      skillLabel: 'SQL / ฐานข้อมูล',
      title: 'สร้าง SQL Dashboard จาก Kaggle Dataset',
      description: 'ดาวน์โหลด dataset สาธารณะจาก Kaggle → เขียน SQL query → สร้าง Dashboard ด้วย Google Looker Studio หรือ Tableau Public',
      proofType: 'dashboard_screenshot',
      durationDays: 5,
      feasible: true,
    },
    {
      id: 'task-002',
      skillId: 'data-analysis',
      skillLabel: 'การวิเคราะห์ข้อมูล',
      title: 'วิเคราะห์ข้อมูลและสรุป Insight เป็นเอกสาร',
      description: 'ใช้ Excel หรือ Google Sheets วิเคราะห์ dataset ที่เลือก → สรุป 3 insight พร้อม recommendation → เขียนเป็น PDF 2–3 หน้า',
      proofType: 'pdf_writeup',
      durationDays: 3,
      feasible: true,
    },
    {
      id: 'task-003',
      skillId: 'requirements-documentation',
      skillLabel: 'การเขียน Requirements',
      title: 'เขียน Business Requirements Document สำหรับ App สมมติ',
      description: 'เลือก use case (เช่น ระบบจอง หรือ e-commerce) → เขียน BRD แบบเต็มรูปแบบ: user stories, acceptance criteria, process flow',
      proofType: 'pdf_writeup',
      durationDays: 4,
      feasible: true,
    },
    {
      id: 'task-004',
      skillId: 'sql-database',
      skillLabel: 'SQL / ฐานข้อมูล',
      title: 'สร้าง GitHub Repository รวม SQL Scripts',
      description: 'Upload SQL queries และ notebook จาก task-001 ขึ้น GitHub → เขียน README อธิบาย dataset และ findings',
      proofType: 'github_repo',
      durationDays: 1,
      feasible: true,
    },
  ],
}

// RankedGaps — pre-computed to match engine output (gapWeight = importance × (1 − statusWeight))
// data-analysis: 0.90×1.0=0.90 | sql: 0.85×1.0=0.85 | requirements: 0.80×0.40=0.32
const Y4_BA_GAPS = [
  { skillId: 'data-analysis',              label: 'การวิเคราะห์ข้อมูล',  importance: 0.90, currentStatus: 'evidence_gap'    as const, gapWeight: 0.90 },
  { skillId: 'sql-database',               label: 'SQL / ฐานข้อมูล',     importance: 0.85, currentStatus: 'unverified_claim' as const, gapWeight: 0.85 },
  { skillId: 'requirements-documentation', label: 'การเขียน Requirements', importance: 0.80, currentStatus: 'partial_skill'   as const, gapWeight: 0.32 },
]

export const Y4_BA_SCENARIO: Scenario = {
  id: 'y4-business-ba',
  title: 'Y4 Business → Business Analyst',
  titleTh: 'นักศึกษาปี 4 บริหารธุรกิจ → Business Analyst',
  surface: 'student',
  input: { kind: 'paste', targetRoleId: 'business-analyst', text: 'Resume: นุ่น สิริกร — ฝึกงาน SCB, Market Research Project, Business Case Presentation...' },
  targetRoleId: 'business-analyst',
  captions: {
    profile_analyzer:    ['กำลังอ่านเอกสาร resume และ transcript...', 'แยกทักษะและประสบการณ์ออกมา — พบ 7 รายการ'],
    evidence_verifier:   ['ตรวจสอบหลักฐานสำหรับแต่ละทักษะ...', 'จัดประเภท: verified / partial / unverified / evidence_gap...', 'พบ 4 verified, 1 partial, 2 ที่ขาดหลักฐาน'],
    role_fit:            ['เทียบทักษะกับ Business Analyst...', 'พบ Role Match 62% — ช่องว่างหลักคือ หลักฐานของ data skills ไม่ใช่ความรู้'],
    skill_gap:           ['วิเคราะห์ gap ที่สำคัญที่สุด...', 'จัดอันดับตาม importance: การวิเคราะห์ข้อมูล > SQL > Requirements'],
    resilience:          ['คำนวณ Resilience จาก ESCO taxonomy...', 'ทักษะที่ verified มี durability สูง — Resilience ดี'],
    action_plan:         ['สร้าง 2 สัปดาห์ Action Plan...', 'จัดคู่ task กับ gap — SQL Dashboard + Data Analysis + BRD'],
    critic:              ['ตรวจสอบความถูกต้อง — ป้องกัน overclaim...', 'ผ่านทุก guardrail checks ✓ ไม่พบ hallucination'],
    institution_insight: ['รวบรวม insight สำหรับ Career Center...'],
  },
  facts: {
    skills: Y4_BA_SKILLS,
    requirements: BA_ROLE_REQUIREMENTS,
    gaps: Y4_BA_GAPS,
    plan: Y4_BA_PLAN,
  },
  flags: [],
}
