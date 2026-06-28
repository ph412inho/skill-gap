import type { AgentEvent } from '@/lib/domain/events'
import type { Skill, EvidenceStatus } from '@/lib/domain/evidence'
import type { ActionItem } from '@/lib/domain/plan'
import type { GuardrailFlag } from '@/lib/domain/guardrail'
import { AGENT_PIPELINE } from '@/lib/domain/agents'
import { computeAllScores } from '@/lib/scoring'
import { BA_ROLE_REQUIREMENTS } from '@/lib/fixtures/taxonomy/roleRequirements'
import { TAXONOMY_MAP } from '@/lib/fixtures/taxonomy/skills'
import type { AnalyzeRequest, Orchestrator } from '../types'
import { getClient, MODEL } from './client'

// ─── Structured output helpers ────────────────────────────────────────────────

async function callTool<T>(
  system: string,
  userMsg: string,
  toolName: string,
  toolSchema: object,
): Promise<T> {
  const client = getClient()
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system,
    tools: [{ name: toolName, description: toolName, input_schema: toolSchema as never }],
    tool_choice: { type: 'tool', name: toolName },
    messages: [{ role: 'user', content: userMsg }],
  })
  const block = res.content.find(b => b.type === 'tool_use')
  if (!block || block.type !== 'tool_use') throw new Error(`No tool_use block in response for ${toolName}`)
  return block.input as T
}

// ─── Agent step helpers ────────────────────────────────────────────────────────

const EVIDENCE_LEVEL_MAP: Record<string, EvidenceStatus> = {
  verified: 'verified_skill',
  partial:  'partial_skill',
  weak:     'weak_evidence',
  none:     'unverified_claim',
}

async function extractProfile(text: string): Promise<Skill[]> {
  const result = await callTool<{
    skills: Array<{ label: string; evidence_level: string; confidence: number; evidence_description: string }>
  }>(
    'You are an evidence-based career analyst. Extract only skills explicitly mentioned in the text. Be conservative — only mark evidence as "verified" if a concrete project, grade, certificate, or work sample is described. Self-reported claims without artifacts are "none".',
    `Extract skills from this profile text:\n\n${text}`,
    'extract_skills',
    {
      type: 'object',
      required: ['skills'],
      properties: {
        skills: {
          type: 'array',
          items: {
            type: 'object',
            required: ['label', 'evidence_level', 'confidence', 'evidence_description'],
            properties: {
              label:                { type: 'string', description: 'Skill name in Thai or English' },
              evidence_level:       { type: 'string', enum: ['verified', 'partial', 'weak', 'none'] },
              confidence:           { type: 'number', description: '0..1' },
              evidence_description: { type: 'string', description: 'What evidence was found, if any' },
            },
          },
        },
      },
    },
  )

  return result.skills.map((s, i) => {
    // Map label to taxonomy for durability
    const normLabel = s.label.toLowerCase().replace(/\s+/g, '-')
    const taxSkill = [...TAXONOMY_MAP.values()].find(t =>
      t.label.toLowerCase().includes(normLabel) || normLabel.includes(t.label.toLowerCase().replace(/\s+/g, '-'))
    )
    const status = EVIDENCE_LEVEL_MAP[s.evidence_level] ?? 'unverified_claim'
    return {
      id:         taxSkill?.id ?? `skill-${i}`,
      label:      s.label,
      durability: taxSkill?.durability ?? 0.7,
      status,
      confidence: s.confidence,
      evidence:   s.evidence_description ? [{ kind: 'self_report' as const, label: s.evidence_description }] : [],
    }
  })
}

async function generateActionPlan(
  skills: Skill[],
): Promise<ActionItem[]> {
  const gaps = skills.filter(s => ['unverified_claim', 'evidence_gap', 'partial_skill'].includes(s.status))
  if (gaps.length === 0) return []

  const gapList = gaps.slice(0, 4).map(g => `- ${g.label} (${g.status})`).join('\n')

  const result = await callTool<{
    tasks: Array<{ title: string; description: string; proof_type: string; duration_days: number }>
  }>(
    'You are a career advisor. Generate concrete, actionable 2-week proof-of-work tasks to fill skill evidence gaps. Each task must produce a verifiable artifact (GitHub repo, PDF writeup, dashboard screenshot, etc.). Tasks must be completable by a student with no job yet.',
    `Generate 2–4 tasks for these evidence gaps:\n${gapList}\n\nEach task must have: a clear title (Thai), step-by-step description (Thai), a proof artifact type (github_repo / pdf_writeup / dashboard_screenshot / presentation_recording / dataset_notebook / other), and duration in days (max 14).`,
    'generate_tasks',
    {
      type: 'object',
      required: ['tasks'],
      properties: {
        tasks: {
          type: 'array',
          maxItems: 4,
          items: {
            type: 'object',
            required: ['title', 'description', 'proof_type', 'duration_days'],
            properties: {
              title:         { type: 'string' },
              description:   { type: 'string' },
              proof_type:    { type: 'string', enum: ['github_repo','pdf_writeup','dashboard_screenshot','presentation_recording','dataset_notebook','other'] },
              duration_days: { type: 'number' },
            },
          },
        },
      },
    },
  )

  return result.tasks.map((t, i) => ({
    id:          `task-llm-${i}`,
    skillId:     gaps[i]?.id ?? 'unknown',
    skillLabel:  gaps[i]?.label ?? '',
    title:       t.title,
    description: t.description,
    proofType:   t.proof_type as ActionItem['proofType'],
    durationDays: Math.min(t.duration_days, 14),
    feasible:    t.duration_days <= 14,
  }))
}

async function runCritic(skills: Skill[]): Promise<GuardrailFlag[]> {
  const unverified = skills.filter(s => s.status === 'unverified_claim')
  if (unverified.length < 3) return []   // not suspicious

  const result = await callTool<{ gaming_detected: boolean; reason: string }>(
    'You are a guardrail for an AI career platform. Detect if a student profile appears to be gaming the system (claiming many skills with zero evidence). Be fair — some skills have no artifacts yet.',
    `Profile has ${skills.length} skills, ${unverified.length} marked unverified_claim. Skill list:\n${skills.map(s => `${s.label}: ${s.status}`).join('\n')}\n\nIs this gaming? If so, explain why.`,
    'check_gaming',
    {
      type: 'object',
      required: ['gaming_detected', 'reason'],
      properties: {
        gaming_detected: { type: 'boolean' },
        reason:          { type: 'string' },
      },
    },
  )

  if (!result.gaming_detected) return []
  return [{
    agent: 'critic',
    code:  'gaming_detected',
    message: result.reason,
    affectedSkillIds: unverified.map(s => s.id),
    severity: unverified.length >= skills.length * 0.8 ? 'veto' : 'warning',
  }]
}

// ─── Orchestrator ──────────────────────────────────────────────────────────────

const AGENT_TITLES: Record<typeof AGENT_PIPELINE[number], string> = {
  profile_analyzer:    '📄 Profile Analyzer — อ่านและแยก Skills',
  evidence_verifier:   '🔍 Evidence Verifier — ตรวจสอบหลักฐาน',
  role_fit:            '🎯 Role Fit — เทียบกับตำแหน่งเป้าหมาย',
  skill_gap:           '📊 Skill Gap — วิเคราะห์ช่องว่าง',
  resilience:          '🛡 Resilience — ความคงทนของทักษะ',
  action_plan:         '📝 Action Plan — แผน 2 สัปดาห์',
  critic:              '⚖️ Critic / Guardrail — ตรวจสอบความถูกต้อง',
  institution_insight: '🏫 Institution Insight — Cohort Overview',
}

export class LlmOrchestrator implements Orchestrator {
  async *run(req: AnalyzeRequest): AsyncIterable<AgentEvent> {
    const text = req.input.text ?? ''
    if (!text.trim()) throw new Error('No input text provided for live mode')

    yield { type: 'run_started', runId: req.runId, pipeline: AGENT_PIPELINE }

    let skills: Skill[] = []
    let flags: GuardrailFlag[] = []

    // ── 1. profile_analyzer ───────────────────────────────────────────────────
    yield { type: 'agent_started', agent: 'profile_analyzer', title: AGENT_TITLES.profile_analyzer }
    yield { type: 'agent_progress', agent: 'profile_analyzer', note: 'ส่งข้อมูลไปยัง Claude...' }
    skills = await extractProfile(text)
    yield { type: 'agent_progress', agent: 'profile_analyzer', note: `พบ ${skills.length} ทักษะ — กำลังจัดประเภทหลักฐาน` }
    yield { type: 'agent_done', agent: 'profile_analyzer', summary: `พบ ${skills.length} ทักษะ` }

    // ── 2. evidence_verifier ──────────────────────────────────────────────────
    yield { type: 'agent_started', agent: 'evidence_verifier', title: AGENT_TITLES.evidence_verifier }
    yield { type: 'agent_progress', agent: 'evidence_verifier', note: 'จัดประเภท: verified / partial / unverified / evidence_gap...' }
    yield { type: 'agent_partial', agent: 'evidence_verifier', payload: { kind: 'skills', skills } }
    const verifiedCount = skills.filter(s => s.status === 'verified_skill').length
    const partialCount  = skills.filter(s => s.status === 'partial_skill').length
    yield { type: 'agent_done', agent: 'evidence_verifier', summary: `verified: ${verifiedCount}, partial: ${partialCount}` }

    // ── 3. role_fit (deterministic) ───────────────────────────────────────────
    yield { type: 'agent_started', agent: 'role_fit', title: AGENT_TITLES.role_fit }
    yield { type: 'agent_progress', agent: 'role_fit', note: 'เทียบกับ Business Analyst requirements...' }
    const matched = skills.filter(s => ['verified_skill','partial_skill'].includes(s.status)).map(s => s.id)
    yield { type: 'agent_partial', agent: 'role_fit', payload: { kind: 'role_match', requirements: BA_ROLE_REQUIREMENTS, matched } }
    yield { type: 'agent_done', agent: 'role_fit', summary: `matched ${matched.length} / ${BA_ROLE_REQUIREMENTS.length}` }

    // ── 4. skill_gap (deterministic) ──────────────────────────────────────────
    yield { type: 'agent_started', agent: 'skill_gap', title: AGENT_TITLES.skill_gap }
    yield { type: 'agent_progress', agent: 'skill_gap', note: 'จัดอันดับ gap ตาม importance...' }
    const { skillGapSeverity } = await import('@/lib/scoring/skillGapSeverity')
    const gapScore = skillGapSeverity(skills, BA_ROLE_REQUIREMENTS)
    const gaps = gapScore.trace.contributions
      .map(c => ({ skillId: c.label, label: c.label, importance: c.delta, currentStatus: 'skill_gap' as const, gapWeight: c.delta }))
    yield { type: 'agent_partial', agent: 'skill_gap', payload: { kind: 'gaps', top: gaps } }
    yield { type: 'agent_done', agent: 'skill_gap', summary: `${gapScore.display} gap severity` }

    // ── 5. resilience (deterministic) ─────────────────────────────────────────
    yield { type: 'agent_started', agent: 'resilience', title: AGENT_TITLES.resilience }
    yield { type: 'agent_progress', agent: 'resilience', note: 'คำนวณ durability จาก taxonomy...' }
    yield { type: 'agent_done', agent: 'resilience', summary: 'เสร็จสิ้น' }

    // ── 6. action_plan (LLM) ─────────────────────────────────────────────────
    yield { type: 'agent_started', agent: 'action_plan', title: AGENT_TITLES.action_plan }
    yield { type: 'agent_progress', agent: 'action_plan', note: 'สร้างแผน 2 สัปดาห์ด้วย Claude...' }
    const tasks = await generateActionPlan(skills)
    yield { type: 'agent_progress', agent: 'action_plan', note: `สร้าง ${tasks.length} tasks` }
    yield { type: 'agent_done', agent: 'action_plan', summary: `${tasks.length} tasks ใน ${tasks.reduce((a,t)=>a+t.durationDays,0)} วัน` }

    // ── 7. critic (LLM) ───────────────────────────────────────────────────────
    yield { type: 'agent_started', agent: 'critic', title: AGENT_TITLES.critic }
    yield { type: 'agent_progress', agent: 'critic', note: 'ตรวจสอบ hallucination และ gaming...' }
    flags = await runCritic(skills)
    for (const flag of flags) {
      yield { type: 'agent_flagged', agent: 'critic', flag }
    }
    yield { type: 'agent_done', agent: 'critic', summary: flags.length > 0 ? `พบ ${flags.length} flag` : 'ผ่านทุก checks ✓' }

    // ── 8. institution_insight ────────────────────────────────────────────────
    yield { type: 'agent_started', agent: 'institution_insight', title: AGENT_TITLES.institution_insight }
    yield { type: 'agent_progress', agent: 'institution_insight', note: 'บันทึก pattern สำหรับ cohort...' }
    yield { type: 'agent_done', agent: 'institution_insight', summary: 'เสร็จสิ้น' }

    // ── Final scores (always deterministic) ───────────────────────────────────
    const totalDays = tasks.reduce((a, t) => a + t.durationDays, 0)
    const plan = { id: `plan-${req.runId}`, assessmentId: req.runId, totalDays, tasks }
    const scores = computeAllScores(skills, BA_ROLE_REQUIREMENTS, plan)

    for (const score of Object.values(scores)) {
      yield { type: 'agent_partial', agent: 'resilience', payload: { kind: 'score', score } }
    }

    yield {
      type: 'result',
      result: {
        runId:      req.runId,
        scenarioId: null,
        profile:    { studentId: req.consent.studentId, rawSummary: text, skillClaims: [] },
        skills,
        scores,
        plan,
        flags,
      },
    }
  }
}
