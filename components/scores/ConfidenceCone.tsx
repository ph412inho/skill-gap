interface ConfidenceConeProps {
  value: number                       // 0..1
  interval: [number, number]          // [lo, hi] 0..1
}

export function ConfidenceCone({ value, interval }: ConfidenceConeProps) {
  const [lo, hi] = interval
  const loPct  = lo  * 100
  const hiPct  = hi  * 100
  const valPct = value * 100

  return (
    <div className="mt-3">
      <div className="relative h-6">
        {/* Track */}
        <div className="absolute inset-0 rounded-full bg-white/8" />

        {/* CI band */}
        <div
          className="absolute top-0 h-full rounded-full bg-amber-500/20"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />

        {/* Point estimate */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] transition-all duration-700"
          style={{ left: `calc(${valPct}% - 6px)` }}
        />

        {/* Labels */}
        <div className="absolute -bottom-5 flex justify-between w-full">
          <span className="text-[10px] text-white/30" style={{ left: `${loPct}%`, position: 'absolute', transform: 'translateX(-50%)' }}>{Math.round(loPct)}%</span>
          <span className="text-[10px] text-white/30" style={{ left: `${hiPct}%`, position: 'absolute', transform: 'translateX(-50%)' }}>{Math.round(hiPct)}%</span>
        </div>
      </div>
      <p className="text-[10px] text-white/30 mt-7">Confidence Interval — ยิ่งห่างจากกัน ยิ่งไม่แน่นอน</p>
    </div>
  )
}
