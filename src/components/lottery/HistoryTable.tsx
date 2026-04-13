import type { LotteryResult } from '@/types/lottery'

interface Props { results: LotteryResult[] }

export default function HistoryTable({ results }: Props) {
  if (results.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
        ไม่พบข้อมูล
      </div>
    )
  }
  return (
    <div className="w-full overflow-x-auto rounded-2xl"
      style={{ border: '1px solid rgba(255,215,0,0.08)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'rgba(255,215,0,0.05)', borderBottom: '1px solid rgba(255,215,0,0.08)' }}>
            {['งวดวันที่','6 ตัว','3 ตัวบน','2 ตัวบน','2 ตัวล่าง','นามสัตว์'].map(h => (
              <th key={h} className="px-4 py-3 text-center first:text-left text-xs font-bold tracking-wide"
                style={{ color: 'rgba(255,215,0,0.5)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => {
            const d = new Date(r.draw_date + 'T00:00:00')
            const fmt = d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' })
            return (
              <tr key={r.id}
                className="transition-colors"
                style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.025)',
                  borderTop: '1px solid rgba(255,255,255,0.03)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,215,0,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.025)')}
              >
                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.35)' }}>{fmt}</td>
                <td className="px-4 py-3 text-center">
                  <span className="font-mono-num font-bold text-base tracking-widest" style={{ color: '#FFD700' }}>{r.num6 ?? '—'}</span>
                </td>
                <td className="px-4 py-3 text-center font-mono-num font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>{r.num3_top ?? '—'}</td>
                <td className="px-4 py-3 text-center font-mono-num font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>{r.num2_top ?? '—'}</td>
                <td className="px-4 py-3 text-center font-mono-num font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>{r.num2_bottom ?? '—'}</td>
                <td className="px-4 py-3 text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{r.animal_name_th ?? '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
