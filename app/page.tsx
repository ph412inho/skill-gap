'use client'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { RoleSwitcher } from '@/components/shared/RoleSwitcher'

// Target roles available in the platform
const ROLES = [
  { id: 'business-analyst', labelTh: 'Business Analyst',  icon: '📊' },
  { id: 'product-manager',  labelTh: 'Product Manager',   icon: '🗺' },
  { id: 'data-analyst',     labelTh: 'Data Analyst',      icon: '🔬' },
  { id: 'ux-designer',      labelTh: 'UX Designer',       icon: '🎨' },
]

// Demo scenarios
const SCENARIOS = [
  {
    id: 'y4-business-ba',
    icon: '🎯',
    titleTh: 'นักศึกษาปี 4 → Business Analyst',
    descTh: 'ทักษะครบ แต่หลักฐานขาด — ช่องว่างคือ evidence ไม่ใช่ความรู้',
    tag: 'Scene 1 · นักศึกษา',
    tagColor: 'bg-brand-600/30 text-brand-300 border-brand-500/30',
    score: '62%',
    scoreLabel: 'Role Readiness',
  },
  {
    id: 'pm-reentry',
    icon: '🔄',
    titleTh: 'PM กลับตลาดงาน — 2 ปี Jobcadu, หลักฐานอยู่ใน company',
    descTh: 'Role match 69% · Gap = public artifacts · แผน 14 วัน',
    tag: 'Scene 2 · Career Break',
    tagColor: 'bg-violet-600/30 text-violet-300 border-violet-500/30',
    score: '69%',
    scoreLabel: 'Role Readiness',
  },
  {
    id: 'gaming-unverified',
    icon: '🚨',
    titleTh: 'Guardrail — อ้างทักษะทุกอย่างโดยไม่มีหลักฐาน',
    descTh: 'Critic agent ตรวจจับและส่ง Flag ให้ Advisor ทันที',
    tag: 'Scene 3 · Guardrail',
    tagColor: 'bg-red-600/30 text-red-300 border-red-500/30',
    score: '⚠',
    scoreLabel: 'Flagged',
  },
]

// Decorative honeycomb cells for the hero (static, visual only)
const DEMO_CELLS = [
  { label: 'Product Vision',   color: 'from-brand-500/30 to-brand-600/20',   size: 'lg', status: '✓' },
  { label: 'User Research',    color: 'from-emerald-500/30 to-teal-600/20',  size: 'lg', status: '✓' },
  { label: 'SQL / Data',       color: 'from-amber-500/20 to-orange-500/15',  size: 'md', status: '○' },
  { label: 'Stakeholder Mgmt', color: 'from-violet-500/25 to-purple-600/20', size: 'lg', status: '✓' },
  { label: 'PRD Writing',      color: 'from-sky-500/20 to-blue-600/15',      size: 'md', status: '~' },
  { label: 'Data Metrics',     color: 'from-orange-500/20 to-red-500/15',    size: 'md', status: '!' },
  { label: 'AI Prompting',     color: 'from-pink-500/20 to-rose-500/15',     size: 'md', status: '~' },
]

const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

function HeroHex({ label, color, status, delay }: { label: string; color: string; status: string; delay: number }) {
  return (
    <div
      style={{ clipPath: HEX_CLIP, width: 90, height: 104, animationDelay: `${delay}ms` }}
      className={`bg-gradient-to-br ${color} border border-white/10 flex flex-col items-center justify-center gap-1 animate-fade-in`}
    >
      <span className="text-[10px] font-semibold text-white/70 text-center leading-tight px-2">{label}</span>
      <span className="text-[11px] text-white/40">{status}</span>
    </div>
  )
}

type InputMode = 'scenario' | 'paste' | 'upload'

export default function LandingPage() {
  const router = useRouter()
  const [selected, setSelected]   = useState<string | null>(null)
  const [mode, setMode]           = useState<InputMode>('scenario')
  const [pasteText, setPasteText] = useState('')
  const [selectedRole, setSelectedRole] = useState('business-analyst')
  const [jdText, setJdText]       = useState('')
  const [showJd, setShowJd]       = useState(false)
  const [dragging, setDragging]   = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    setUploadedFile(file.name)
    // Mock: treat upload as PM scenario for demo
    setSelected('pm-reentry')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleStart() {
    if (mode === 'scenario' && selected) {
      router.push(`/analyze?scenario=${selected}`)
    } else if (mode === 'paste' && pasteText.trim()) {
      router.push(`/analyze?text=${encodeURIComponent(pasteText.trim())}`)
    } else if (mode === 'upload' && selected) {
      router.push(`/analyze?scenario=${selected}`)
    }
  }

  const canStart =
    (mode === 'scenario' && !!selected) ||
    (mode === 'paste' && pasteText.trim().length > 20) ||
    (mode === 'upload' && !!uploadedFile)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/8">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎓</span>
          <span className="font-bold text-white">Career Readiness</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-600/30 text-brand-300 border border-brand-500/30 ml-1">POC Demo</span>
        </div>
        <RoleSwitcher />
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT: Hero */}
        <div className="lg:w-2/5 flex flex-col items-center justify-center px-8 py-16 lg:py-0 border-b lg:border-b-0 lg:border-r border-white/8">
          {/* Decorative honeycomb */}
          <div className="mb-8 relative">
            <div className="flex flex-col items-center" style={{ gap: 0 }}>
              {/* Row 1: 3 */}
              <div className="flex" style={{ gap: 5 }}>
                {DEMO_CELLS.slice(0, 3).map((c, i) => (
                  <HeroHex key={i} {...c} delay={i * 80} />
                ))}
              </div>
              {/* Row 2: 4, offset — marginTop=-(H/4)=-26, paddingLeft=W/2+gap/2=47 */}
              <div className="flex" style={{ gap: 5, marginTop: -26, paddingLeft: 47 }}>
                {DEMO_CELLS.slice(3, 7).map((c, i) => (
                  <HeroHex key={i} {...c} delay={240 + i * 80} />
                ))}
              </div>
            </div>
            {/* Glow behind */}
            <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-radial from-brand-500 to-transparent" />
          </div>

          <div className="text-center max-w-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-300 text-xs font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              AI Evidence Loop — ไม่ใช่ Resume Builder
            </div>
            <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
              วิเคราะห์ความพร้อม<br />
              <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">ด้วยหลักฐานจริง</span>
            </h1>
            <p className="text-sm text-white/45 leading-relaxed">
              ดู 8 AI Agents ทำงาน real-time — ตรวจสอบหลักฐาน วิเคราะห์ช่องว่าง สร้างแผน 2 สัปดาห์
            </p>
          </div>
        </div>

        {/* RIGHT: Input panel */}
        <div className="lg:w-3/5 overflow-y-auto px-8 py-10 flex flex-col justify-center">
          <div className="max-w-xl mx-auto w-full space-y-6">

            {/* Role picker */}
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">ฉันกำลังมุ่งไปที่...</p>
              <div className="flex flex-wrap gap-2">
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      selectedRole === r.id
                        ? 'border-brand-500/60 bg-brand-600/15 text-brand-300 shadow-[0_0_16px_rgba(14,165,233,0.12)]'
                        : 'border-white/10 bg-white/3 text-white/60 hover:border-white/20 hover:text-white/80'
                    }`}
                  >
                    <span>{r.icon}</span>
                    {r.labelTh}
                  </button>
                ))}
              </div>
            </div>

            {/* Input mode tabs */}
            <div>
              <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/8 mb-4">
                {([['scenario', '🎬 Demo'], ['paste', '✏️ วาง Text'], ['upload', '📎 อัปโหลด']] as [InputMode, string][]).map(([m, label]) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      mode === m ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Scenario cards */}
              {mode === 'scenario' && (
                <div className="space-y-3">
                  {SCENARIOS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelected(s.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 ${
                        selected === s.id
                          ? 'border-brand-500/60 bg-brand-600/10 shadow-[0_0_20px_rgba(14,165,233,0.10)]'
                          : 'border-white/10 bg-white/3 hover:border-white/18 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl shrink-0">{s.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${s.tagColor}`}>{s.tag}</span>
                            {selected === s.id && <span className="text-[10px] text-brand-400">✓ เลือกแล้ว</span>}
                          </div>
                          <p className="text-sm font-semibold text-white leading-tight">{s.titleTh}</p>
                          <p className="text-xs text-white/45 mt-0.5">{s.descTh}</p>
                        </div>
                        {/* Score preview chip */}
                        <div className="shrink-0 text-right">
                          <div className="text-xl font-bold text-white">{s.score}</div>
                          <div className="text-[9px] text-white/30">{s.scoreLabel}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Paste mode */}
              {mode === 'paste' && (
                <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                  <p className="text-xs text-white/50 mb-3">วาง resume หรือโปรไฟล์ (ไทย/อังกฤษ)</p>
                  <textarea
                    value={pasteText}
                    onChange={e => setPasteText(e.target.value)}
                    placeholder={`ชื่อ: ...\nประสบการณ์: ...\nทักษะ: Python, SQL, ...\nการศึกษา: ...`}
                    className="w-full h-36 bg-transparent text-white/80 text-sm placeholder:text-white/20 resize-none outline-none"
                  />
                  <p className="text-[10px] text-white/25 mt-2">ระบบจะวิเคราะห์แบบ conservative — ทักษะที่ไม่มีหลักฐานจะถูกทำเครื่องหมาย unverified</p>
                </div>
              )}

              {/* Upload mode */}
              {mode === 'upload' && (
                <div>
                  <div
                    onDragOver={e => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className={`relative rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                      dragging
                        ? 'border-brand-400/80 bg-brand-600/10'
                        : uploadedFile
                        ? 'border-green-500/50 bg-green-500/10'
                        : 'border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5'
                    }`}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                    />
                    {uploadedFile ? (
                      <>
                        <div className="text-3xl">✅</div>
                        <p className="text-sm font-medium text-green-400">{uploadedFile}</p>
                        <p className="text-xs text-white/40">คลิกเพื่อเปลี่ยนไฟล์</p>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl text-white/30">{dragging ? '📂' : '📎'}</div>
                        <p className="text-sm text-white/50">{dragging ? 'วางไฟล์ที่นี่' : 'ลากไฟล์มาวาง หรือคลิกเลือก'}</p>
                        <p className="text-[11px] text-white/25">PDF, DOC, DOCX, TXT</p>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-white/25 mt-2 text-center">
                    Demo mode: ระบบจะใช้ PM Re-entry scenario เพื่อแสดง flow
                  </p>
                </div>
              )}
            </div>

            {/* JD — collapsed by default so CTA stays dominant */}
            <div>
              <button
                onClick={() => setShowJd(v => !v)}
                className="flex items-center gap-1.5 text-[11px] text-white/25 hover:text-white/45 transition-colors"
              >
                <span>📋</span>
                <span>เพิ่ม Job Description เพื่อ calibrate อัตโนมัติ</span>
                <span className={`transition-transform duration-200 inline-block ${showJd ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {showJd && (
                <textarea
                  value={jdText}
                  onChange={e => setJdText(e.target.value)}
                  placeholder="วาง JD ที่นี่..."
                  className="mt-2 w-full h-24 bg-white/3 border border-white/10 rounded-xl px-3 py-2.5 text-white/70 text-xs placeholder:text-white/20 resize-none outline-none focus:border-white/20 transition-all"
                />
              )}
            </div>

            {/* CTA */}
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 disabled:opacity-25 disabled:cursor-not-allowed text-white font-bold text-base transition-all duration-200 active:scale-98 shadow-[0_0_30px_rgba(14,165,233,0.25)]"
            >
              เริ่มวิเคราะห์ →
            </button>

            <p className="text-center text-[11px] text-white/25">
              Personality Setup → Consent → 8 AI Agents → Dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
