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

function HexCell({ skill, index }: { skill: Skill; index: number }) {
  const [hovered, setHovered] = useState(false)
  const cfg = STATUS_CONFIG[skill.status]

  return (
    <div className="relative" style={{ animationDelay: `${index * 60}ms` }}>
      {/* Hex shape */}
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ clipPath: HEX_CLIP, width: 96, height: 111 }}
        className={`${cfg.bg} border-2 ${cfg.border} transition-all duration-200 flex flex-col items-center justify-center gap-1 group animate-fade-in
          ${hovered ? 'scale-110 z-10' : ''}`}
      >
        {/* Confidence dot */}
        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${skill.confidence < 0.5 ? 'animate-pulse' : ''}`} />
        {/* Label — short */}
        <span className={`text-[9px] font-semibold ${cfg.text} text-center leading-tight px-2 max-w-[70px]`}>
          {skill.label.length > 14 ? skill.label.slice(0, 13) + '…' : skill.label}
        </span>
      </button>

      {/* Tooltip */}
      {hovered && (
        <div
          style={{ bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)', zIndex: 50 }}
          className="absolute w-52 bg-[#111827] border border-white/15 rounded-2xl p-3 shadow-2xl pointer-events-none"
        >
          <p className="text-xs font-semibold text-white mb-1">{skill.label}</p>
          <div className="flex items-center gap-1.5 mb-2">
            <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            <span className={`text-[10px] font-medium ${cfg.text}`}>{cfg.labelTh}</span>
          </div>
          {skill.evidence.length > 0 ? (
            <div className="space-y-1">
              {skill.evidence.slice(0, 2).map((e, i) => (
                <p key={i} className="text-[10px] text-white/50 leading-tight">
                  <span className="text-white/30">{e.kind}: </span>{e.label}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-white/30">ไม่มีหลักฐานแนบ</p>
          )}
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white/40 rounded-full" style={{ width: `${skill.confidence * 100}%` }} />
            </div>
            <span className="text-[9px] text-white/30">{Math.round(skill.confidence * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

interface SkillHoneycombProps {
  skills: Skill[]
}

export function SkillHoneycomb({ skills }: SkillHoneycombProps) {
  const HEX_W = 96
  const GAP = 6
  const ROW_OVERLAP = 28  // H/4 for regular pointy-top hex (H=111, W=96)

  // Chunk into alternating rows: 4 then 3 then 4 ...
  const rows: Skill[][] = []
  let i = 0
  while (i < skills.length) {
    const evenRow = rows.length % 2 === 0
    const size = evenRow ? 4 : 3
    rows.push(skills.slice(i, i + size))
    i += size
  }

  const halfCell = (HEX_W + GAP) / 2

  return (
    <div>
      <div className="flex flex-col items-center" style={{ gap: 0 }}>
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="flex"
            style={{
              gap: GAP,
              marginTop: ri === 0 ? 0 : -ROW_OVERLAP,
              paddingLeft: ri % 2 === 1 ? halfCell : 0,
            }}
          >
            {row.map((skill, ci) => (
              <HexCell key={skill.id} skill={skill} index={ri * 4 + ci} />
            ))}
          </div>
        ))}
      </div>

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
