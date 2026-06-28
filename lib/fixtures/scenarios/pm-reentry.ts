import type { Skill } from '@/lib/domain/evidence'
import type { ActionPlan } from '@/lib/domain/plan'
import type { ParsedProfile } from '@/lib/domain/profile'
import type { Scenario } from '../types'
import { PM_ROLE_REQUIREMENTS } from '../taxonomy/pmRoleRequirements'

// Scene 3: PM re-entering the market after 2yr at Jobcadu (Thai job platform)
// Key insight: "ทักษะครบ แต่หลักฐานอยู่ใน company — ต้องเปลี่ยนให้เป็น public artifact"
// Score: ≈ 69% role readiness (verified PM core; gaps = public data evidence + PRD)

export const PM_REENTRY_PROFILE: ParsedProfile = {
  studentName: 'ภูรินทร์ เพิ่มศิลป์',
  studentId: 'demo-pm-reentry-001',
  programLabel: 'Product Manager — 2 ปี Jobcadu (Thai Job Platform)',
  yearOfStudy: 0,
  rawSummary: 'อดีต PM ที่ Jobcadu 2 ปี + Assistant Consultant ที่ Kenan Foundation. กลับสู่ตลาดงาน ต้องการ PM role ในทีมที่แข็งแกร่ง',
  skillClaims: [],
}

export const PM_REENTRY_SKILLS: Skill[] = [
  {
    id: 'product-roadmapping',
    label: 'Product Vision & Roadmap',
    durability: 0.90,
    status: 'verified_skill',
    confidence: 0.92,
    evidence: [
      { kind: 'project', label: 'Jobcadu — Product Roadmap Q1–Q3 2024',       excerpt: 'Owned and shipped 3 roadmap cycles. Led discovery for job matching v2 and resume builder.' },
      { kind: 'project', label: 'Jobcadu — Job Alert Engine launch (50k users)', excerpt: 'Defined scope, wrote PRD, coordinated eng + design, launched to 50k users.' },
    ],
  },
  {
    id: 'user-research',
    label: 'User Research & UX',
    durability: 0.82,
    status: 'verified_skill',
    confidence: 0.88,
    evidence: [
      { kind: 'project', label: 'Jobcadu — 40+ user interviews (job seekers)',   excerpt: 'Interviews to find friction in job application flow. Led to 18% conversion lift.' },
      { kind: 'project', label: 'Kenan Foundation — stakeholder research',       excerpt: 'Synthesized 15 NGO interviews into program recommendations for Kenan SME programs.' },
    ],
  },
  {
    id: 'stakeholder-management',
    label: 'Stakeholder Management',
    durability: 0.82,
    status: 'verified_skill',
    confidence: 0.90,
    evidence: [
      { kind: 'project', label: 'Jobcadu — Cross-functional PM (Eng + Design + BD)', excerpt: 'Aligned 3 functions weekly for 2 years. Navigated competing priorities with a lean team.' },
      { kind: 'advisor', label: 'Kenan Foundation — leadership presentations',        excerpt: 'Presented findings to foundation leadership and external partners.' },
    ],
  },
  {
    id: 'analytical-thinking',
    label: 'Analytical Thinking',
    durability: 0.80,
    status: 'verified_skill',
    confidence: 0.85,
    evidence: [
      { kind: 'project', label: 'Kenan Foundation — SME capability gap analysis', excerpt: 'Built frameworks to assess SME gaps across 3 provinces.' },
      { kind: 'project', label: 'Jobcadu — product decision logs',                excerpt: 'Maintained structured decision log for every major product call.' },
    ],
  },
  {
    id: 'ai-prompting',
    label: 'AI Prompting & Workflow',
    durability: 0.75,
    status: 'partial_skill',
    confidence: 0.70,
    evidence: [
      { kind: 'self_report', label: 'Listed on portfolio — phurinpermsilp.com/skills', excerpt: 'AI prompting listed as established core skill. No public case study yet.' },
    ],
  },
  {
    id: 'prd-writing',
    label: 'PRD / Spec Writing',
    durability: 0.88,
    // Has real PRDs but all are internal — no public artifact
    status: 'partial_skill',
    confidence: 0.65,
    evidence: [
      { kind: 'self_report', label: 'Jobcadu — PRDs (internal, not published)', excerpt: 'Wrote multiple full-length PRDs at Jobcadu. All internal. No anonymized public version exists yet.' },
    ],
  },
  {
    id: 'data-product-metrics',
    label: 'Data & Product Metrics',
    durability: 0.85,
    // Worked with data at Jobcadu but no published dashboard or public analysis
    status: 'evidence_gap',
    confidence: 0.40,
    evidence: [],
  },
  {
    id: 'technical-literacy',
    label: 'Technical Literacy (Frontend)',
    durability: 0.80,
    // Building portfolio site in React/TS — real but still in progress
    status: 'weak_evidence',
    confidence: 0.50,
    evidence: [
      { kind: 'project', label: 'Portfolio site — phurinpermsilp.com (React + TS, in progress)', excerpt: 'Actively learning HTML/CSS/JS/React/TS by building this portfolio.' },
    ],
  },
]

export const PM_REENTRY_PLAN: ActionPlan = {
  id: 'plan-pm-reentry-001',
  assessmentId: 'assessment-pm-reentry-001',
  totalDays: 14,
  tasks: [
    {
      id: 'task-pm-001',
      skillId: 'prd-writing',
      skillLabel: 'PRD / Spec Writing',
      title: 'เผยแพร่ PRD Anonymized จาก Jobcadu',
      description: 'เลือก 1 PRD ที่คุณเขียนที่ Jobcadu → ลบ confidential info → เพิ่ม annotations อธิบาย rationale ของแต่ละ decision → post บน portfolio Notion (public link)',
      proofType: 'pdf_writeup',
      durationDays: 3,
      feasible: true,
      resourceLinks: [
        { label: 'Notion (สร้าง public page)', url: 'https://notion.so',             kind: 'tool' },
        { label: 'Lenny\'s PRD examples',      url: 'https://lenny.substack.com',    kind: 'example' },
      ],
    },
    {
      id: 'task-pm-002',
      skillId: 'data-product-metrics',
      skillLabel: 'Data & Product Metrics',
      title: 'สร้าง Portfolio Analytics Dashboard',
      description: 'ต่อ Google Analytics 4 บน phurinpermsilp.com → รอ 3 วันให้ data สะสม → สร้าง dashboard ใน Looker Studio → เขียน 3 product insights จาก real data (traffic source, bounce rate, top pages)',
      proofType: 'dashboard_screenshot',
      durationDays: 5,
      feasible: true,
      resourceLinks: [
        { label: 'Google Analytics 4',     url: 'https://analytics.google.com',      kind: 'tool' },
        { label: 'Looker Studio (Free)',    url: 'https://lookerstudio.google.com',   kind: 'tool' },
      ],
    },
    {
      id: 'task-pm-003',
      skillId: 'product-roadmapping',
      skillLabel: 'Product Vision & Roadmap',
      title: 'เขียน Product Case Study: Feature ที่ Ship ที่ Jobcadu',
      description: 'เลือก 1 feature ที่คุณเป็น PM จนถึง launch → เขียน Problem → User Insight → Decision → Launch → Result (ใส่ตัวเลข % ถ้าไม่ confidential) → 2–4 หน้า → post บน LinkedIn หรือ portfolio',
      proofType: 'pdf_writeup',
      durationDays: 4,
      feasible: true,
      resourceLinks: [
        { label: 'Product Case Study Template', url: 'https://www.lennysnewsletter.com',  kind: 'template' },
        { label: 'PM Case Study Examples',      url: 'https://www.productcoalition.com',  kind: 'example' },
      ],
    },
    {
      id: 'task-pm-004',
      skillId: 'ai-prompting',
      skillLabel: 'AI Prompting & Workflow',
      title: 'เผยแพร่ AI Use Cases จากงาน PM จริง',
      description: 'เขียน 3 use cases ที่คุณใช้ Claude/ChatGPT ใน PM workflow (เช่น interview synthesis, PRD drafting, competitive analysis) → แสดง prompt จริง + ผลลัพธ์ + บทเรียน → 1 หน้าต่อ case',
      proofType: 'pdf_writeup',
      durationDays: 2,
      feasible: true,
      resourceLinks: [
        { label: 'Claude (สำหรับ PM workflows)', url: 'https://claude.ai', kind: 'tool' },
      ],
    },
  ],
}

const PM_REENTRY_GAPS = [
  { skillId: 'data-product-metrics', label: 'Data & Product Metrics', importance: 0.85, currentStatus: 'evidence_gap' as const,  gapWeight: 0.85 },
  { skillId: 'technical-literacy',   label: 'Technical Literacy',     importance: 0.60, currentStatus: 'weak_evidence' as const,  gapWeight: 0.60 },
  { skillId: 'prd-writing',          label: 'PRD / Spec Writing',     importance: 0.80, currentStatus: 'partial_skill' as const,  gapWeight: 0.32 },
]

export const PM_REENTRY_SCENARIO: Scenario = {
  id: 'pm-reentry',
  title: 'PM Re-entering Market',
  titleTh: 'PM กลับตลาดงาน — 2 ปีประสบการณ์ แต่หลักฐานอยู่ใน company',
  surface: 'student',
  input: { kind: 'paste', targetRoleId: 'product-manager', text: '' },
  targetRoleId: 'product-manager',
  captions: {
    profile_analyzer:    ['อ่านโปรไฟล์ — Product Manager 2 ปีที่ Jobcadu...', 'พบ 8 ทักษะ — 4 verified, 2 partial, 1 evidence_gap, 1 weak_evidence'],
    evidence_verifier:   ['ตรวจสอบหลักฐาน...', 'verified: PM roadmap, UX research, stakeholder mgmt, analytical ✓', 'ปัญหา: หลักฐานเป็น internal company data — ต้อง publish เป็น public artifact'],
    role_fit:            ['เทียบกับ Product Manager requirements...', 'Role Match ≈ 69% — ทักษะ PM core แข็งแกร่ง', 'gap = public evidence ของ data skills และ PRD'],
    skill_gap:           ['หาช่องว่างที่สำคัญที่สุด...', 'Gap #1: Data & Product Metrics (0.85) — ไม่มี public dashboard', 'Gap #2: PRD Writing (0.80) — มี PRD แต่ internal เท่านั้น'],
    resilience:          ['คำนวณ Resilience...', 'PM core skills มี durability สูง — human skills + product sense ไม่ล้าสมัย ✓'],
    action_plan:         ['สร้างแผน 14 วัน...', 'เน้น: เปลี่ยน internal evidence → public artifacts', '4 tasks: PRD anonymized + Analytics dashboard + Case study + AI showcase'],
    critic:              ['ตรวจสอบ guardrails...', 'ผ่านทุก checks ✓ — ทักษะ verified มีหลักฐานจาก 2 ปีประสบการณ์'],
    institution_insight: ['Pattern: PM re-entry มักมี gap ด้าน public portfolio — แนะนำ workshop "Externalizing Internal Evidence"'],
  },
  facts: {
    skills: PM_REENTRY_SKILLS,
    requirements: PM_ROLE_REQUIREMENTS,
    gaps: PM_REENTRY_GAPS,
    plan: PM_REENTRY_PLAN,
  },
  flags: [],
}
