'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import HistoryTable from '@/components/lottery/HistoryTable'
import Pagination from '@/components/lottery/Pagination'
import AdBanner from '@/components/ui/AdBanner'
import type { LotteryResult } from '@/types/lottery'

interface ApiResponse {
  results: LotteryResult[]
  total: number
  page: number
  perPage: number
}

export default function HistoryPage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async (p: number, q: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), per_page: '20', ...(q ? { q } : {}) })
      const res = await fetch(`/api/lottery/history?${params}`)
      setData(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData(page, search) }, [page, search, fetchData])

  const handleSearch = () => { setPage(1); setSearch(inputValue.trim()) }
  const handleClear = () => { setInputValue(''); setSearch(''); setPage(1) }

  return (
    <main className="py-6 px-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-5">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black shimmer-text">ผลหวยลาวย้อนหลัง</h1>
            {data && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>ทั้งหมด {data.total.toLocaleString()} งวด</p>}
          </div>
          <Link href="/" className="text-xs px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,215,0,0.08)', color: 'rgba(255,215,0,0.7)' }}>
            ← หน้าหลัก
          </Link>
        </div>

        <AdBanner slot="9081251463" />

        {/* 검색 */}
        <div className="flex gap-2">
          <input
            type="tel" inputMode="numeric" value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="ค้นหาเลข เช่น 78, 478, 081478"
            className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,215,0,0.12)',
              color: '#FFD700',
            }}
          />
          {search && (
            <button onClick={handleClear}
              className="px-4 rounded-2xl text-sm font-medium"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
              ✕
            </button>
          )}
          <button onClick={handleSearch}
            className="px-5 rounded-2xl text-sm font-bold"
            style={{ background: '#FFD700', color: '#0a0e1a' }}>
            ค้นหา
          </button>
        </div>

        {/* 테이블 */}
        {loading ? (
          <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <div className="inline-block w-5 h-5 border-2 border-yellow-400/50 border-t-yellow-400 rounded-full animate-spin mb-3" />
            <p className="text-xs">กำลังโหลด...</p>
          </div>
        ) : (
          <HistoryTable results={data?.results ?? []} />
        )}

        {!loading && Math.ceil((data?.total ?? 0) / (data?.perPage ?? 20)) > 1 && (
          <Pagination
            page={page}
            totalPages={Math.ceil((data?.total ?? 0) / (data?.perPage ?? 20))}
            onPageChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          />
        )}

        <AdBanner slot="9081251463" className="mt-2" />
      </div>
    </main>
  )
}
