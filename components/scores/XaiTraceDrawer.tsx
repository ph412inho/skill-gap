'use client'
import { useState } from 'react'
import type { Score } from '@/lib/domain/scores'

interface XaiTraceDrawerProps {
  score: Score
  onClose: () => void
}

export function XaiTraceDrawer({ score, onClose }: XaiTraceDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-slide-in max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">อธิบายคะแนน (XAI)</p>
            <h3 className="text-lg font-bold text-white">{score.display}</h3>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none transition-colors">×</button>
        </div>

        {/* Rule */}
        <div className="mb-4 p-3 rounded-xl bg-brand-600/10 border border-brand-500/20">
          <p className="text-xs text-brand-300 font-medium mb-1">สูตรคำนวณ</p>
          <p className="text-sm text-white/80 font-mono">{score.trace.rule}</p>
        </div>

        {/* Inputs */}
        <div className="mb-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">ข้อมูลที่ใช้</p>
          <div className="space-y-1">
            {score.trace.inputs.map((inp, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                <span className="text-sm text-white/70">{inp.label}</span>
                <span className="text-sm text-white font-mono">{inp.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contributions */}
        {score.trace.contributions.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">ผลการมีส่วนร่วม</p>
            <div className="space-y-2">
              {score.trace.contributions.slice(0, 8).map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-white/60 w-40 truncate">{c.label}</span>
                  <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, c.delta * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/60 font-mono w-10 text-right">{c.delta.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confidence Interval */}
        {score.confidenceInterval && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-400 font-medium mb-1">Confidence Interval</p>
            <p className="text-sm text-white/80">
              {Math.round(score.confidenceInterval[0] * 100)}% – {Math.round(score.confidenceInterval[1] * 100)}%
            </p>
            <p className="text-xs text-white/40 mt-1">ช่วงนี้คือการพยากรณ์ ไม่ใช่ค่าแน่นอน</p>
          </div>
        )}

        {/* Caveats */}
        <div className="space-y-1.5">
          {score.trace.caveats.map((c, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-white/30 text-xs mt-0.5 shrink-0">⚑</span>
              <p className="text-xs text-white/50">{c}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
