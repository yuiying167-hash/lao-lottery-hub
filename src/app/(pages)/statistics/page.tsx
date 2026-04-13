import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getHotColdNumbers, getRecentResults } from '@/lib/db'
import AdBanner from '@/components/ui/AdBanner'
import Link from 'next/link'

export const revalidate = 0

export default async function StatisticsPage() {
  const { env } = await getCloudflareContext({ async: true })
  const [hotCold, recent] = await Promise.all([
    getHotColdNumbers(env.DB, 100),
    getRecentResults(env.DB, 50),
  ])

  // num2_top 빈도 전체 계산
  const freq: Record<string, number> = {}
  for (let i = 0; i <= 99; i++) freq[String(i).padStart(2, '0')] = 0
  for (const r of recent) {
    if (r.num2_top) {
      const k = r.num2_top.padStart(2, '0')
      if (k in freq) freq[k]++
    }
  }
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
  const maxCount = sorted[0]?.[1] ?? 1

  return (
    <main className="py-6 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black shimmer-text">สถิติหวยลาว</h1>
          <Link href="/" className="text-xs px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,215,0,0.08)', color: 'rgba(255,215,0,0.7)' }}>
            ← หน้าหลัก
          </Link>
        </div>

        <AdBanner slot="9081251463" />

        {/* HOT / COLD 카드 */}
        <div className="grid grid-cols-2 gap-4">
          {/* HOT */}
          <div className="rounded-2xl p-5" style={{ background: '#111827', border: '1px solid rgba(239,68,68,0.15)' }}>
            <p className="text-sm font-bold text-red-400 mb-4">🔥 เลขร้อน (100 งวด)</p>
            <div className="flex flex-col gap-2">
              {hotCold.hot.map((item, i) => (
                <div key={item.digit} className="flex items-center gap-3">
                  <span className="font-mono-num font-bold text-lg w-8 text-center"
                    style={{ color: '#FCA5A5' }}>{item.digit}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${(item.count / maxCount) * 100}%`, background: 'linear-gradient(90deg, #ef4444, #fca5a5)' }} />
                  </div>
                  <span className="text-xs text-red-400/60 w-12 text-right">{item.count}ครั้ง</span>
                </div>
              ))}
            </div>
          </div>

          {/* COLD */}
          <div className="rounded-2xl p-5" style={{ background: '#111827', border: '1px solid rgba(59,130,246,0.15)' }}>
            <p className="text-sm font-bold text-blue-400 mb-4">🧊 เลขเย็น (100 งวด)</p>
            <div className="flex flex-col gap-2">
              {hotCold.cold.map((item, i) => (
                <div key={item.digit} className="flex items-center gap-3">
                  <span className="font-mono-num font-bold text-lg w-8 text-center"
                    style={{ color: '#93C5FD' }}>{item.digit}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(59,130,246,0.1)' }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${Math.max((item.count / maxCount) * 100, 4)}%`, background: 'linear-gradient(90deg, #3b82f6, #93c5fd)' }} />
                  </div>
                  <span className="text-xs text-blue-400/60 w-12 text-right">{item.count}ครั้ง</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AdBanner slot="9081251463" />

        {/* 전체 빈도 히트맵 */}
        <div className="rounded-2xl p-5" style={{ background: '#111827', border: '1px solid rgba(255,215,0,0.08)' }}>
          <p className="text-sm font-bold mb-4" style={{ color: 'rgba(255,215,0,0.8)' }}>
            📊 ความถี่เลข 2 ตัวบน · {recent.length} งวดล่าสุด
          </p>
          <div className="grid grid-cols-10 gap-1.5">
            {sorted.map(([digit, count]) => {
              const intensity = maxCount > 0 ? count / maxCount : 0
              return (
                <div key={digit}
                  className="flex flex-col items-center gap-0.5 rounded-lg py-2"
                  style={{
                    background: intensity > 0.6
                      ? `rgba(255,215,0,${0.1 + intensity * 0.3})`
                      : intensity > 0.3
                      ? `rgba(255,165,0,${0.05 + intensity * 0.15})`
                      : 'rgba(255,255,255,0.03)',
                    border: intensity > 0.6 ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <span className="font-mono-num text-xs font-bold"
                    style={{ color: intensity > 0.5 ? '#FFD700' : 'rgba(255,255,255,0.5)' }}>
                    {digit}
                  </span>
                  <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        <AdBanner slot="9081251463" className="mb-2" />
      </div>
    </main>
  )
}
