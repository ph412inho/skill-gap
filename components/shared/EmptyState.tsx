interface EmptyStateProps {
  icon?: string
  titleTh: string
  descTh?: string
  action?: React.ReactNode
}

export function EmptyState({ icon = '📭', titleTh, descTh, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4 opacity-40">{icon}</div>
      <h3 className="text-white/50 font-semibold mb-1">{titleTh}</h3>
      {descTh && <p className="text-sm text-white/30 max-w-xs">{descTh}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
