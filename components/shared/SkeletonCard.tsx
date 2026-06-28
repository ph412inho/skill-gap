export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/8 bg-white/3 p-4 animate-pulse ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1.5">
          <div className="h-2.5 w-24 bg-white/10 rounded" />
          <div className="h-2 w-36 bg-white/6 rounded" />
        </div>
        <div className="h-7 w-12 bg-white/10 rounded" />
      </div>
      <div className="h-1 bg-white/8 rounded-full" />
    </div>
  )
}

export function SkeletonChip() {
  return (
    <div className="h-10 rounded-xl bg-white/5 border border-white/8 animate-pulse" />
  )
}
