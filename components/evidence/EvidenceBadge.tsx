import type { EvidenceStatus } from '@/lib/domain/evidence'

// `title` disambiguates the terse labels (e.g. "missing" = role needs it, no claim at all
// vs "no proof" = student has the skill but no artifact). Shown on hover/long-press.
const BADGE_CONFIG: Record<EvidenceStatus, { label: string; className: string; title: string }> = {
  verified_skill:     { label: '✓ verified',      className: 'bg-green-500/20 text-green-400 border-green-500/30',  title: 'ยืนยันแล้ว — มีหลักฐานชัดเจน' },
  partial_skill:      { label: '~ partial',        className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',  title: 'มีหลักฐานบางส่วน ยังไม่พอยืนยันเต็ม' },
  weak_evidence:      { label: '! weak',            className: 'bg-orange-500/20 text-orange-400 border-orange-500/30', title: 'หลักฐานอ่อน (เช่น self-report อย่างเดียว)' },
  unverified_claim:   { label: '✗ unverified',     className: 'bg-red-500/20 text-red-400 border-red-500/30',       title: 'อ้างใน resume แต่ไม่มีหลักฐาน' },
  skill_gap:          { label: 'missing',           className: 'bg-purple-500/20 text-purple-400 border-purple-500/30', title: 'ช่องว่าง — ตำแหน่งต้องการ แต่ยังไม่มีการอ้างทักษะนี้เลย' },
  evidence_gap:       { label: 'no proof',          className: 'bg-violet-500/20 text-violet-400 border-violet-500/30', title: 'มีทักษะแต่ยังพิสูจน์ไม่ได้ด้วยชิ้นงาน' },
  transferable_skill: { label: '⟳ transferable',   className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',     title: 'ทักษะข้ามสายที่นำมาปรับใช้กับตำแหน่งนี้ได้' },
  low_durability_skill: { label: '⚠ low durability', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',   title: 'ยืนยันแล้ว แต่เสี่ยงถูกแทนที่/ล้าสมัยสูง' },
}

interface EvidenceBadgeProps {
  status: EvidenceStatus
  size?: 'sm' | 'xs'
}

export function EvidenceBadge({ status, size = 'xs' }: EvidenceBadgeProps) {
  const cfg = BADGE_CONFIG[status]
  return (
    <span
      title={cfg.title}
      className={`inline-flex items-center px-1.5 py-0.5 rounded border font-mono font-medium whitespace-nowrap cursor-help ${cfg.className} ${size === 'xs' ? 'text-[10px]' : 'text-xs'}`}
    >
      {cfg.label}
    </span>
  )
}
