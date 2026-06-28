'use client'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useAgentStream } from '@/components/rail/useAgentStream'
import { ProgressRail } from '@/components/rail/ProgressRail'
import { SkillHoneycomb } from '@/components/evidence/SkillHoneycomb'
import { SkillChip } from '@/components/evidence/SkillChip'
import { ScoreCard } from '@/components/scores/ScoreCard'
import { ActionPlanCard } from '@/components/plan/ActionPlanCard'
import { NowTimeline } from '@/components/profile/NowTimeline'
import { StudentAboutCard } from '@/components/profile/StudentAboutCard'
import { LowConfidenceFlag } from '@/components/shared/LowConfidenceFlag'
import { RoleSwitcher } from '@/components/shared/RoleSwitcher'
import { SkeletonCard, SkeletonChip } from '@/components/shared/SkeletonCard'
import type { PersonalityProfile } from '@/lib/domain/personality'
import type { ScoreId } from '@/lib/domain/scores'

const SCORE_ORDER: ScoreId[] = ['role_readiness', 'evidence_strength', 'skill_gap_severity', 'resilience', 'actionability']

const TARGET_ROLE_LABELS: Record<string, string> = {
  'business-analyst': 'Business Analyst',
  'product-manager':  'Product Manager',
  'data-analyst':     'Data Analyst',
  'ux-designer':      'UX Designer',
}

export default function DashboardPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = use(params)
  const stream = useAgentStream(runId)
  const [personality, setPersonality] = useState<PersonalityProfile | null>(null)

  // Read personality from sessionStorage (set during analyze flow)
  useEffect(() => {
    const stored = sessionStorage.getItem(`personality_${runId}`)
    if (stored) {
      try { setPersonality(JSON.parse(stored) as PersonalityProfile) } catch { /* ignore */ }
    }
  }, [runId])

  const isStreaming = !stream.done && !stream.error
  const hasSkills = stream.skills.length > 0
  const hasScores = Object.keys(stream.scores).length > 0
  const profile = stream.result?.profile
  const targetRoleId = stream.result?.scenarioId
    ? { 'y4-business-ba': 'business-analyst', 'pm-reentry': 'product-manager', 'gaming-unverified': 'business-analyst' }[stream.result.scenarioId]
    : 'business-analyst'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/40 hover:text-white transition-colors text-sm">← กลับ</Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/60">วิเคราะห์ผล</span>
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-xs text-brand-400">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              กำลังวิเคราะห์...
            </span>
          )}
        </div>
        <RoleSwitcher />
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Progress Rail */}
        <div className="w-72 shrink-0 border-r border-white/8 p-6 overflow-y-auto">
          <ProgressRail
            agentStatus={stream.agentStatus}
            agentNotes={stream.agentNotes}
            done={stream.done}
          />
        </div>

        {/* RIGHT: Dashboard */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {stream.error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm">{stream.error}</p>
            </div>
          )}

          {/* ── About / Profile ─────────────────────────────────────────── */}
          {profile ? (
            <StudentAboutCard
              profile={profile}
              targetRoleLabel={TARGET_ROLE_LABELS[targetRoleId ?? 'business-analyst']}
              personality={personality}
            />
          ) : isStreaming && (
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5 flex items-center gap-4 animate-pulse">
              <div className="w-14 h-14 rounded-2xl bg-white/8" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-white/10 rounded" />
                <div className="h-3 w-56 bg-white/6 rounded" />
              </div>
            </div>
          )}

          {/* ── Flags from Critic ───────────────────────────────────────── */}
          {stream.result?.flags && stream.result.flags.length > 0 && (
            <div id="flags" className="animate-fade-in">
              <LowConfidenceFlag flags={stream.result.flags} />
            </div>
          )}

          {/* ── Skill Honeycomb ─────────────────────────────────────────── */}
          <section id="skills">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
              ทักษะที่ตรวจพบ
              {hasSkills && <span className="ml-2 text-white/25 normal-case font-normal">({stream.skills.length} ทักษะ)</span>}
            </h2>
            {hasSkills ? (
              <SkillHoneycomb skills={stream.skills} />
            ) : isStreaming ? (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonChip key={i} />)}
              </div>
            ) : null}
          </section>

          {/* ── Score Cards ─────────────────────────────────────────────── */}
          <section id="scores">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">คะแนนความพร้อม</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SCORE_ORDER.map((id, i) => {
                const score = stream.scores[id]
                if (score) return (
                  <div key={id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                    <ScoreCard score={score} />
                  </div>
                )
                if (isStreaming) return <SkeletonCard key={id} />
                return null
              })}
            </div>
          </section>

          {/* ── Headline insight ────────────────────────────────────────── */}
          {stream.result && (
            <section className="animate-fade-in">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-600/20 to-violet-600/10 border border-brand-500/20">
                <h3 className="font-bold text-white mb-2 text-lg">💡 ข้อค้นพบสำคัญ</h3>
                {stream.scores.role_readiness && (
                  <p className="text-white/80 text-sm leading-relaxed">
                    คุณ match{' '}
                    <strong className="text-brand-300">{stream.scores.role_readiness.display}</strong>{' '}
                    ของตำแหน่งเป้าหมาย — ช่องว่างหลักไม่ใช่ความรู้ แต่คือ{' '}
                    <strong className="text-amber-300">หลักฐาน</strong>{' '}
                    ของทักษะที่มีอยู่แล้ว แผน 2 สัปดาห์ด้านล่างจะปิดช่องว่างนี้
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ── Now Timeline ─────────────────────────────────────────────── */}
          {stream.result?.plan && stream.result.plan.tasks.length > 0 && (
            <NowTimeline plan={stream.result.plan} />
          )}

          {/* ── Action Plan ──────────────────────────────────────────────── */}
          {stream.result?.plan && stream.result.plan.tasks.length > 0 && (
            <section id="action-plan" className="animate-fade-in">
              <ActionPlanCard plan={stream.result.plan} />
            </section>
          )}

          {/* Idle state */}
          {!hasSkills && !hasScores && !stream.error && isStreaming && (
            <div className="flex flex-col items-center justify-center h-48 text-white/20">
              <div className="text-3xl mb-3 animate-pulse">🔍</div>
              <p className="text-sm">ดูความคืบหน้าใน Pipeline ทางซ้าย</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
