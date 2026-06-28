export type DiSCType = 'D' | 'I' | 'S' | 'C'

export const DISC_META: Record<DiSCType, { label: string; descTh: string; color: string; emoji: string }> = {
  D: { label: 'Dominant',       descTh: 'ตัดสินใจเร็ว มุ่งเป้า ชอบผลลัพธ์',              color: 'from-red-500 to-orange-500',    emoji: '⚡' },
  I: { label: 'Influential',    descTh: 'สร้างแรงบันดาลใจ ชอบร่วมงานกับคนอื่น',           color: 'from-yellow-400 to-amber-500',  emoji: '🌟' },
  S: { label: 'Steady',        descTh: 'ไว้ใจได้ สม่ำเสมอ ให้ความสำคัญกับความสัมพันธ์', color: 'from-green-400 to-teal-500',    emoji: '🌿' },
  C: { label: 'Conscientious', descTh: 'วิเคราะห์ข้อมูล ใส่ใจรายละเอียด มุ่งมั่นในความถูกต้อง', color: 'from-blue-400 to-violet-500', emoji: '🔬' },
}

export type StrengthDomain = 'strategic' | 'executing' | 'influencing' | 'relationship'

export const STRENGTH_META: Record<StrengthDomain, { labelTh: string; descTh: string; icon: string }> = {
  strategic:    { labelTh: 'Strategic Thinking', descTh: 'วิเคราะห์ คิดระยะยาว เรียนรู้',  icon: '🧠' },
  executing:    { labelTh: 'Executing',          descTh: 'ลงมือทำ ส่งผลลัพธ์ มุ่งมั่น',    icon: '⚡' },
  influencing:  { labelTh: 'Influencing',        descTh: 'สื่อสาร โน้มน้าว สร้าง impact',  icon: '💬' },
  relationship: { labelTh: 'Relationship',       descTh: 'สร้างทีม ดูแล เชื่อมต่อคน',      icon: '🤝' },
}

export type FlowActivity =
  | 'design'
  | 'writing'
  | 'data'
  | 'building'
  | 'helping'
  | 'learning'
  | 'presenting'
  | 'problem_solving'
  | 'strategy'
  | 'ideation'

export const FLOW_META: Record<FlowActivity, { labelTh: string; icon: string }> = {
  design:         { labelTh: 'Design & Visual',      icon: '🎨' },
  writing:        { labelTh: 'Writing & Storytelling', icon: '✍️' },
  data:           { labelTh: 'Data & Patterns',       icon: '📊' },
  building:       { labelTh: 'Building Systems',      icon: '🔧' },
  helping:        { labelTh: 'Helping & Mentoring',   icon: '🤝' },
  learning:       { labelTh: 'Learning & Research',   icon: '📖' },
  presenting:     { labelTh: 'Presenting & Persuading', icon: '🗣' },
  problem_solving:{ labelTh: 'Problem Solving',       icon: '🧩' },
  strategy:       { labelTh: 'Strategy & Planning',   icon: '🌱' },
  ideation:       { labelTh: 'Generating Ideas',      icon: '💡' },
}

export interface PersonalityProfile {
  disc: DiSCType
  strengths: StrengthDomain[]   // 1-2 selected
  flowActivities: FlowActivity[] // 2-3 selected
}
