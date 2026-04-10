'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import HistoryTable from '@/components/lottery/HistoryTable'
import Pagination from '@/components/lottery/Pagination'
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
      const params = new URLSearchParams({
        page: String(p),
        per_page: '20',
        ...(q ? { q } : {}),
      })
      const res = await fetch(`/api/lottery/history?${params}`)
      const json: ApiResponse = await res.json()
      setData(json)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(page, search)
  }, [page, search, fetchData])

  const handleSearch = () => {
    setPage(1)
    setSearch(inputValue.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleClear = () => {
    setInputValue('')
    setSearch('')
    setPage(1)
  }

  const totalPages = data ? Math.ceil(data.total / data.perPage) : 0

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              📋 ผลหวยลาวย้อนหลัง
            </h1>
            {data && (
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                ทั้งหมด {data.total.toLocaleString()} งวด
              </p>
            )}
          </div>
          <Link
            href="/"
            className="text-sm text-yellow-600 dark:text-yellow-400 hover:underline"
          >
            ← หน้าหลัก
          </Link>
        </div>

        {/* 검색 */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ค้นหาเลข เช่น 78, 478, 081478"
            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
              px-4 py-2.5 text-sm outline-none
              focus:ring-2 focus:ring-yellow-400 transition"
          />
          {search && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl text-sm font-medium
                bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300
                hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              ✕
            </button>
          )}
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 rounded-xl text-sm font-bold
              text-slate-900 hover:opacity-90 transition-opacity"
            style={{ background: '#FFD700' }}
          >
            ค้นหา
          </button>
        </div>

        {/* 테이블 */}
        {loading ? (
          <div className="text-center py-16 text-slate-400">
            <div className="inline-block w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-3" />
            <p>กำลังโหลด...</p>
          </div>
        ) : (
          <HistoryTable results={data?.results ?? []} />
        )}

        {/* 페이지네이션 */}
        {!loading && totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              setPage(p)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

      </div>
    </main>
  )
}
