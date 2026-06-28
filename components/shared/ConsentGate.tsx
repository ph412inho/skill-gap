'use client'
import { useState } from 'react'

interface ConsentGateProps {
  onConsent: (purposes: string[]) => void
  loading?: boolean
}

const PURPOSES = [
  { id: 'ai_analysis',     label: 'วิเคราะห์โปรไฟล์ด้วย AI',                   required: true },
  { id: 'advisor_sharing', label: 'แชร์ผลกับ Advisor (ผู้ให้คำปรึกษา)',         required: false },
  { id: 'research_use',    label: 'ใช้ข้อมูลนิรนามสำหรับงานวิจัยของมหาวิทยาลัย', required: false },
]

export function ConsentGate({ onConsent, loading }: ConsentGateProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({ ai_analysis: true })

  function toggle(id: string, required: boolean) {
    if (required) return
    setChecked(p => ({ ...p, [id]: !p[id] }))
  }

  function handleSubmit() {
    const purposes = PURPOSES.filter(p => checked[p.id]).map(p => p.id)
    onConsent(purposes)
  }

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-xl">🔒</div>
          <div>
            <h2 className="font-bold text-white">ขอความยินยอม (PDPA)</h2>
            <p className="text-xs text-white/40">ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562</p>
          </div>
        </div>

        <p className="text-sm text-white/60 mb-5 leading-relaxed">
          ระบบจะนำข้อมูลที่คุณให้ไปวิเคราะห์ทักษะและช่องว่างในอาชีพด้วย AI กรุณาเลือกขอบเขตการใช้งานที่ยินยอม
        </p>

        <div className="space-y-3 mb-6">
          {PURPOSES.map(p => (
            <label
              key={p.id}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${checked[p.id] ? 'border-brand-500/40 bg-brand-500/10' : 'border-white/8 bg-white/3 hover:border-white/15'} ${p.required ? 'cursor-default' : ''}`}
              onClick={() => toggle(p.id, p.required)}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${checked[p.id] ? 'bg-brand-500 border-brand-500' : 'border-white/20'}`}>
                {checked[p.id] && <span className="text-white text-xs">✓</span>}
              </div>
              <div>
                <span className="text-sm text-white">{p.label}</span>
                {p.required && <span className="text-[10px] text-brand-400 ml-2">จำเป็น</span>}
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 active:scale-95"
        >
          {loading ? 'กำลังเริ่มต้น...' : 'ยืนยันและเริ่มวิเคราะห์ →'}
        </button>

        <p className="text-[10px] text-white/30 text-center mt-3">
          ข้อมูลของคุณจะถูกเก็บอย่างปลอดภัยตามมาตรฐาน PDPA · ลบข้อมูลได้ทุกเมื่อ
        </p>
      </div>
    </div>
  )
}
