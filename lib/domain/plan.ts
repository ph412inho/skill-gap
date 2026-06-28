export type ProofType =
  | 'github_repo'
  | 'dataset_notebook'
  | 'pdf_writeup'
  | 'dashboard_screenshot'
  | 'presentation_recording'
  | 'other'

export interface ResourceLink {
  label: string   // display text (Thai ok)
  url: string     // destination — fill in real links per scenario
  kind: 'tutorial' | 'template' | 'dataset' | 'tool' | 'example'
}

export interface ActionItem {
  id: string
  skillId: string
  skillLabel: string
  title: string           // Thai label shown to student
  description: string
  proofType: ProofType
  durationDays: number    // expected effort; must be ≤ 14 for feasible=true
  feasible: boolean       // fits within the 2–4 week window
  resourceLinks?: ResourceLink[]   // optional — links to tutorials, templates, datasets
}

export interface ActionPlan {
  id: string
  assessmentId: string
  totalDays: number       // sum of durationDays for feasible tasks
  tasks: ActionItem[]
}
