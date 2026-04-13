'use client'

import { useState } from 'react'
import AdBanner from '@/components/ui/AdBanner'
import Link from 'next/link'
import type { LotteryResult } from '@/types/lottery'

interface CheckResult {
  matched: boolean
  matchType: string[]
  result: LotteryResult
}

export default function CheckPage() {
  const [input, setInput] = useState('')
  const [checking, setChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)
  const [error, setError] = useState('')

  const handleCheck = async () => {
    const num = input.trim().replace(/\D/g, '')
    if (num.length < 2 || num.length > 6) {
      setError('กรุณากรอกตัวเลข 2-6 หลัก')
      return
    }
    setError('')
    setChecking(true)
    setCheckResult(null)
    try {
      const res = await fetch('/api/lottery/latest')
      const latest: LotteryResult = await res.json()
      const matchType: string[] = []

      if (latest.num6 === num) matchType.push('เลข 6 ตัว')
      if (latest.num5 === num) matchType.push('เลข 5 ตัว')
      if (latest.num4 === num) matchType.push('เลข 4 ตัว')
      if (latest.num3_top === num) matchType.push('เลข 3 ตัวบน')
      if (latest.num2_top === num) matchType.push('เลข 2 ตัวบน')
      if (latest.num2_bottom === num) matchType.push('เลข 2 ตัวล่าง')

      // suffix matching
      if (matchType.length === 0) {
        if (latest.num6?.endsWith(num)) matchType.push(`ท้าย ${num.length} ตัวของ 6 ตัว`)
        if (latest.num5?.endsWith(num)) matchType.push(`ท้าย ${num.length} ตัวของ 5 ตัว`)
      }

      setCheckResult({ matched: matchType.length > 0, matchType, result: latest })
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setChecking(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCheck()
  }

  return (
    <main className="py-6 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black shimmer-text">ตรวจหวยลาว</h1>
          <Link href="/" className="text-xs px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,215,0,0.08)', color: 'rgba(255,215,0,0.7)' }}>
            ← หน้าหลัก
          </Link>
        </div>

        <AdBanner slot="9081251463" />

        {/* 입력 카드 */}
        <div className="rounded-3xl p-6" style={{ background: '#111827', border: '1px solid rgba(255,215,0,0.08)' }}>
          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
            กรอกตัวเลขที่ต้องการตรวจ (2–6 หลัก) แล้วกด ตรวจสอบ
          </p>
          <div className="flex gap-2">
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={input}
              onChange={e => setInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={handleKeyDown}
              placeholder="เช่น 78, 478, 081478"
              className="flex-1 rounded-2xl px-4 py-3 text-lg font-mono-num font-bold outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,215,0,0.15)',
                color: '#FFD700',
                caretColor: '#FFD700',
              }}
            />
            <button
              onClick={handleCheck}
              disabled={checking}
              className="px-6 py-3 rounded-2xl font-bold text-sm transition-opacity disabled:opacity-50"
              style={{ background: '#FFD700', color: '#0a0e1a' }}
            >
              {checking ? '...' : 'ตรวจสอบ'}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>

        {/* 결과 */}
        {checkResult && (
          <div
            className="rounded-3xl p-6 text-center"
            style={{
              background: checkResult.matched
                ? 'linear-gradient(135deg, #0f2a0f, #1a3a0a)'
                : 'linear-gradient(135deg, #1a0a0a, #2a0f0f)',
              border: `1px solid ${checkResult.matched ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.2)'}`,
            }}
          >
            <div className="text-4xl mb-3">{checkResult.matched ? '🎉' : '😔'}</div>
            <p className="text-xl font-black mb-1"
              style={{ color: checkResult.matched ? '#4ade80' : '#f87171' }}>
              {checkResult.matched ? 'ยินดีด้วย! ถูกรางวัล' : 'ไม่ถูกรางวัล'}
            </p>
            {checkResult.matched && (
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {checkResult.matchType.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              งวดวันที่ {new Date(checkResult.result.draw_date + 'T00:00:00').toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        )}

        <AdBanner slot="9081251463" className="mb-2" />
      </div>
    </main>
  )
}
