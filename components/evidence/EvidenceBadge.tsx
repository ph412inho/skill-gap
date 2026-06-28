import type { EvidenceStatus } from '@/lib/domain/evidence'

const BADGE_CONFIG: Record<EvidenceStatus, { label: string; className: string }> = {
  verified_skill:     { label: '✓ verified',      className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  partial_skill:      { label: '~ partial',        className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  weak_evidence:      { label: '! weak',            className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  unverified_claim:   { label: '✗ unverified',     className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  skill_gap:          { label: 'missing',           className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  evidence_gap:       { label: 'no proof',          className: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  transferable_skill: { label: '⟳ transferable',   className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  low_durability_skill: { label: '⚠ low durability', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
}

interface EvidenceBadgeProps {
  status: EvidenceStatus
  size?: 'sm' | 'xs'
}

export function EvidenceBadge({ status, size = 'xs' }: EvidenceBadgeProps) {
  const cfg = BADGE_CONFIG[status]
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border font-mono font-medium whitespace-nowrap ${cfg.className} ${size === 'xs' ? 'text-[10px]' : 'text-xs'}`}>
      {cfg.label}
    </span>
  )
}
