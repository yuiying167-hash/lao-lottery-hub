'use client'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null
  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  const btnBase: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.4)',
    padding: '6px 12px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  }
  const activeBtn: React.CSSProperties = {
    background: '#FFD700',
    border: '1px solid #FFD700',
    color: '#0a0e1a',
    padding: '6px 12px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  }

  return (
    <div className="flex items-center justify-center gap-1 flex-wrap">
      <button style={btnBase} disabled={page === 1} onClick={() => onPageChange(page - 1)}>‹</button>
      {pages.map((p, i) =>
        p === '...'
          ? <span key={`d${i}`} style={{ color: 'rgba(255,255,255,0.2)', padding: '0 4px' }}>…</span>
          : <button key={p} style={page === p ? activeBtn : btnBase} onClick={() => onPageChange(p as number)}>{p}</button>
      )}
      <button style={btnBase} disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>›</button>
    </div>
  )
}
