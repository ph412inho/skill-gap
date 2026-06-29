'use client'
import { useState } from 'react'
import type { Skill, EvidenceStatus } from '@/lib/domain/evidence'

// Status → visual config
const STATUS_CONFIG: Record<EvidenceStatus, { bg: string; border: string; text: string; dot: string; labelTh: string }> = {
  verified_skill:      { bg: 'bg-emerald-500/20', border: 'border-emerald-400/50', text: 'text-emerald-300', dot: 'bg-emerald-400', labelTh: 'ยืนยันแล้ว' },
  partial_skill:       { bg: 'bg-sky-500/20',     border: 'border-sky-400/50',     text: 'text-sky-300',    dot: 'bg-sky-400',    labelTh: 'บางส่วน' },
  weak_evidence:       { bg: 'bg-amber-500/15',   border: 'border-amber-400/40',   text: 'text-amber-300',  dot: 'bg-amber-400',  labelTh: 'หลักฐานอ่อน' },
  unverified_claim:    { bg: 'bg-slate-500/15',   border: 'border-slate-400/30',   text: 'text-slate-400',  dot: 'bg-slate-400',  labelTh: 'ยังไม่ยืนยัน' },
  evidence_gap:        { bg: 'bg-orange-500/15',  border: 'border-orange-400/40',  text: 'text-orange-300', dot: 'bg-orange-400', labelTh: 'ขาดหลักฐาน' },
  skill_gap:           { bg: 'bg-red-500/15',     border: 'border-red-400/40',     text: 'text-red-300',    dot: 'bg-red-400',    labelTh: 'ช่องว่าง' },
  transferable_skill:  { bg: 'bg-violet-500/15',  border: 'border-violet-400/40',  text: 'text-violet-300', dot: 'bg-violet-400', labelTh: 'ถ่ายโอนได้' },
  low_durability_skill:{ bg: 'bg-yellow-500/15',  border: 'border-yellow-400/40',  text: 'text-yellow-300', dot: 'bg-yellow-400', labelTh: 'คงทนต่ำ' },
}

const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

function HexCell({ skill, index, selected, onSelect }: {
  skill: Skill
  index: number
  selected: boolean
  onSelect: () => void
}) {
  const cfg = STATUS_CONFIG[skill.status]
  return (
    <div className="relative" style={{ animationDelay: `${index * 60}ms` }}>
      <button
        onClick={onSelect}
        onFocus={onSelect}                       // keyboard nav selects too
        aria-pressed={selected}
        aria-label={`${skill.label} — ${cfg.labelTh}, ${Math.round(skill.confidence * 100)}%`}
        style={{ clipPath: HEX_CLIP, width: 96, height: 111 }}
        className={`${cfg.bg} border-2 ${cfg.border} transition-all duration-200 flex flex-col items-center justify-center gap-1 animate-fade-in
          hover:scale-110 hover:z-10 focus:scale-110 focus:z-10 focus:outline-none
          ${selected ? 'scale-110 z-10 ring-2 ring-white/60' : ''}`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${skill.confidence < 0.5 ? 'animate-pulse' : ''}`} />
        <span className={`text-[9px] font-semibold ${cfg.text} text-center leading-tight px-2 max-w-[70px]`}>
          {skill.label.length > 14 ? skill.label.slice(0, 13) + '…' : skill.label}
        </span>
      </button>
    </div>
  )
}

// Detail panel — replaces the hover-only tooltip so the centerpiece works on touch.
function SkillDetail({ skill }: { skill: Skill }) {
  const cfg = STATUS_CONFIG[skill.status]
  return (
    <div className="mt-6 rounded-2xl border border-white/12 bg-white/5 p-4 animate-fade-in">
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <p className="text-sm font-semibold text-white">{skill.label}</p>
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${cfg.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.labelTh}
        </span>
      </div>
      {skill.evidence.length > 0 ? (
        <ul className="space-y-1 mb-3">
          {skill.evidence.map((e, i) => (
            <li key={i} className="text-xs text-white/55 leading-relaxed">
              <span className="text-white/30">{e.kind}: </span>{e.label}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-white/30 mb-3">ยังไม่มีหลักฐานแนบ — ปิดช่องว่างนี้ได้ด้วยแผน 2 สัปดาห์ด้านล่าง</p>
      )}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white/40 rounded-full transition-all duration-500" style={{ width: `${skill.confidence * 100}%` }} />
        </div>
        <span className="text-[10px] text-white/40">ความมั่นใจ {Math.round(skill.confidence * 100)}%</span>
      </div>
    </div>
  )
}

interface SkillHoneycombProps {
  skills: Skill[]
}

export function SkillHoneycomb({ skills }: SkillHoneycombProps) {
  const HEX_W = 96
  const GAP = 6
  const ROW_OVERLAP = 28
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const rows: Skill[][] = []
  let i = 0
  while (i < skills.length) {
    const size = rows.length % 2 === 0 ? 4 : 3
    rows.push(skills.slice(i, i + size))
    i += size
  }
  const halfCell = (HEX_W + GAP) / 2
  const selected = skills.find(s => s.id === selectedId) ?? null

  return (
    <div>
      <p className="text-[11px] text-white/30 text-center mb-3 sm:hidden">แตะที่ทักษะเพื่อดูหลักฐาน</p>
      <div className="flex flex-col items-center" style={{ gap: 0 }}>
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="flex"
            style={{ gap: GAP, marginTop: ri === 0 ? 0 : -ROW_OVERLAP, paddingLeft: ri % 2 === 1 ? halfCell : 0 }}
          >
            {row.map((skill, ci) => (
              <HexCell
                key={skill.id}
                skill={skill}
                index={ri * 4 + ci}
                selected={skill.id === selectedId}
                onSelect={() => setSelectedId(skill.id)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Detail for the selected skill (tap/click/keyboard) */}
      {selected && <SkillDetail skill={selected} />}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 justify-center">
        {(Object.entries(STATUS_CONFIG) as [EvidenceStatus, typeof STATUS_CONFIG[EvidenceStatus]][])
          .filter(([k]) => skills.some(s => s.status === k))
          .map(([status, cfg]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              <span className="text-[10px] text-white/40">{cfg.labelTh}</span>
            </div>
          ))}
      </div>
    </div>
  )
}
