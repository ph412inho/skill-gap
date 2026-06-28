'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ROLES = [
  { label: 'นักศึกษา', href: '/',       icon: '🎓' },
  { label: 'Cohort',   href: '/cohort',  icon: '🏫' },
]

export function RoleSwitcher() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
      {ROLES.map(r => {
        const active = pathname === r.href || (r.href !== '/' && pathname.startsWith(r.href))
        return (
          <Link
            key={r.href}
            href={r.href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${active ? 'bg-brand-600 text-white shadow' : 'text-white/50 hover:text-white'}`}
          >
            <span>{r.icon}</span>
            <span>{r.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
