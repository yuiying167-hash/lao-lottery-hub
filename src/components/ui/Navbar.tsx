'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/',            label: 'หน้าหลัก' },
  { href: '/history',    label: 'ย้อนหลัง' },
  { href: '/statistics', label: 'สถิติ' },
  { href: '/check',      label: 'ตรวจหวย' },
]

export default function Navbar() {
  const path = usePathname()
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(18,4,7,0.92)',
      borderBottom: '1px solid rgba(255,215,0,0.08)',
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{ maxWidth: 672, margin: '0 auto', padding: '0 16px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            หวยลาว
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 20,
            border: '1px solid rgba(196,30,58,0.4)',
            color: '#c41e3a', letterSpacing: '0.1em',
          }}>LIVE</span>
        </Link>

        <nav style={{ display: 'flex', gap: 2 }}>
          {NAV.map(({ href, label }) => {
            const active = path === href
            return (
              <Link key={href} href={href} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                textDecoration: 'none', transition: 'all 0.15s',
                background: active ? '#FFD700' : 'transparent',
                color: active ? '#120407' : 'rgba(245,230,211,0.45)',
                border: active ? 'none' : '1px solid transparent',
              }}>
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
