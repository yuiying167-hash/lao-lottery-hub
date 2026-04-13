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
    <main style={{ padding: '24px 16px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* 히어로 */}
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <h1 className="shimmer-text" style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 6 }}>
            หวยลาว
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(245,230,211,0.4)', letterSpacing: '0.02em' }}>
            อัปเดตอัตโนมัติ · จันทร์ พุธ ศุกร์
          </p>
        </div>

        {/* 광고 */}
        <AdBanner slot="9081251463" />

        {/* 최신 결과 */}
        {latest ? <ResultCard result={latest} /> : (
          <div style={{ borderRadius: 20, padding: 40, textAlign: 'center',
            background: '#2a0a10', border: '1px solid rgba(255,215,0,0.06)',
            color: 'rgba(245,230,211,0.3)' }}>
            ยังไม่มีข้อมูล
          </div>
        )}

        {/* 빠른 이동 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { href: '/history',    icon: '📋', label: 'ย้อนหลัง',  sub: 'ผลย้อนหลัง' },
            { href: '/statistics', icon: '📊', label: 'สถิติ',      sub: 'เลขร้อน-เย็น' },
            { href: '/check',      icon: '✅', label: 'ตรวจหวย',   sub: 'เช็คเลขทันที' },
          ].map(({ href, icon, label, sub }) => (
            <Link key={href} href={href} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 6, padding: '18px 8px', borderRadius: 18,
              textDecoration: 'none', transition: 'all 0.2s',
              background: 'linear-gradient(135deg, #2a0a10, #1e0509)',
              border: '1px solid rgba(255,215,0,0.07)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,215,0,0.25)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,215,0,0.07)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            }}>
              <span style={{ fontSize: 26 }}>{icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f5e6d3' }}>{label}</span>
              <span style={{ fontSize: 10, color: 'rgba(245,230,211,0.3)' }}>{sub}</span>
            </Link>
          ))}
        </div>

        {/* HOT/COLD */}
        <HotColdNumbers hot={hotCold.hot} cold={hotCold.cold} />

        {/* 광고 */}
        <AdBanner slot="9081251463" />

        {/* 안내 */}
        <div style={{ borderRadius: 16, padding: '18px 20px',
          background: 'rgba(255,215,0,0.03)', border: '1px solid rgba(255,215,0,0.07)',
          fontSize: 13, color: 'rgba(245,230,211,0.4)', lineHeight: 1.7 }}>
          <p style={{ fontWeight: 700, color: 'rgba(245,230,211,0.65)', marginBottom: 6, fontSize: 13 }}>
            เกี่ยวกับ หวยลาว
          </p>
          รวบรวมผลหวยลาวอัตโนมัติ อัปเดตทุกวันจันทร์ พุธ ศุกร์ พร้อมสถิติย้อนหลัง ระบบตรวจหวย และวิเคราะห์เลขร้อน-เลขเย็น
        </div>

        <AdBanner slot="9081251463" />
      </div>
    </main>
  )
}
