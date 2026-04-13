import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getLatestResult, getHotColdNumbers } from '@/lib/db'
import ResultCard from '@/components/lottery/ResultCard'
import HotColdNumbers from '@/components/lottery/HotColdNumbers'
import AdBanner from '@/components/ui/AdBanner'
import Link from 'next/link'

export const revalidate = 0

export default async function HomePage() {
  const { env } = await getCloudflareContext({ async: true })
  const [latest, hotCold] = await Promise.all([
    getLatestResult(env.DB),
    getHotColdNumbers(env.DB, 50),
  ])

  return (
    <main className="py-6 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        {/* 히어로 타이틀 */}
        <div className="text-center pt-2 pb-1">
          <h1 className="text-3xl font-extrabold tracking-tight mb-1"
            style={{ color: '#FFD700', textShadow: '0 0 30px rgba(255,165,0,0.35)' }}>
            🎯 Lao Lottery Hub
          </h1>
          <p className="text-slate-400 text-sm">
            ผลหวยลาวล่าสุด · อัปเดตอัตโนมัติทุกวันจันทร์ พุธ ศุกร์
          </p>
        </div>

        {/* 광고 — 상단 */}
        <AdBanner slot="9081251463" />

        {/* 최신 결과 카드 */}
        {latest ? (
          <ResultCard result={latest} />
        ) : (
          <div className="w-full rounded-3xl p-10 text-center border border-white/5"
            style={{ background: '#162032' }}>
            <p className="text-slate-400">ยังไม่มีข้อมูล กรุณารอผลงวดถัดไป</p>
          </div>
        )}

        {/* 빠른 이동 버튼 */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { href: '/history',    icon: '📋', label: 'ย้อนหลัง' },
            { href: '/statistics', icon: '📊', label: 'สถิติ' },
            { href: '/check',      icon: '✅', label: 'ตรวจหวย' },
          ].map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1.5 py-4 rounded-2xl border border-white/6 transition-all hover:border-yellow-400/30 hover:bg-yellow-400/5"
              style={{ background: '#162032' }}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-semibold text-slate-300">{label}</span>
            </Link>
          ))}
        </div>

        {/* HOT/COLD 통계 */}
        <HotColdNumbers hot={hotCold.hot} cold={hotCold.cold} />

        {/* 광고 — 중간 */}
        <AdBanner slot="9081251463" />

        {/* 안내 카드 */}
        <div className="rounded-2xl p-5 border border-white/5 text-sm text-slate-400 leading-relaxed"
          style={{ background: '#162032' }}>
          <p className="font-semibold text-slate-300 mb-2">📌 เกี่ยวกับ Lao Lottery Hub</p>
          <p>
            เว็บไซต์นี้รวบรวมผลหวยลาวอัตโนมัติจากแหล่งข้อมูลที่เชื่อถือได้
            อัปเดตทุกวันจันทร์ พุธ และศุกร์ หลังประกาศผล
            พร้อมสถิติย้อนหลัง ระบบตรวจหวย และวิเคราะห์เลขร้อน-เลขเย็น
          </p>
        </div>

        {/* 광고 — 하단 */}
        <AdBanner slot="9081251463" className="mb-2" />

      </div>
    </main>
  )
}
