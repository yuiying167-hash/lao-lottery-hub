'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/',            label: '🏠 หน้าหลัก' },
  { href: '/history',    label: '📋 ย้อนหลัง' },
  { href: '/statistics', label: '📊 สถิติ' },
  { href: '/check',      label: '✅ ตรวจหวย' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-white/5"
      style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-extrabold tracking-tight"
            style={{ color: '#FFD700' }}>
            🎯 Lao Lottery
          </span>
        </Link>

        {/* 네비 링크 */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${active
                    ? 'text-slate-900'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }
                `}
                style={active ? { background: '#FFD700' } : {}}
              >
                {label}
              </Link>
            )
          })}
        </nav>

      </div>
    </header>
  )
}
