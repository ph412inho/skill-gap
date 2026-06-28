import type { RoleRequirement } from '@/lib/domain/role'

// Product Manager role — calibrated for a mid-level PM re-entering the market
// Expected score for Phurin (2yr Jobcadu PM, no public data artifacts): ≈ 69%
// Math: (0.95+0.90+0.85+0.75+0.48+0.00+0.00) / 5.70 = 3.93/5.70 = 68.9%
// Verified skills: product-roadmapping, user-research, stakeholder-management, analytical-thinking
// Partial: prd-writing (did it, no public artifact)
// Gaps: data-product-metrics (evidence_gap), technical-literacy (weak_evidence → weight 0)
export const PM_ROLE_REQUIREMENTS: RoleRequirement[] = [
  { skillId: 'product-roadmapping',    label: 'Product Vision & Roadmap',  importance: 0.95 },
  { skillId: 'user-research',          label: 'User Research & UX',         importance: 0.90 },
  { skillId: 'stakeholder-management', label: 'Stakeholder Management',     importance: 0.85 },
  { skillId: 'data-product-metrics',   label: 'Data & Product Metrics',     importance: 0.85 },
  { skillId: 'prd-writing',            label: 'PRD / Spec Writing',         importance: 0.80 },
  { skillId: 'analytical-thinking',    label: 'Analytical Thinking',        importance: 0.75 },
  { skillId: 'technical-literacy',     label: 'Technical Literacy',         importance: 0.60 },
]

// Total importance: 5.70
