import type { LotteryResult } from '@/types/lottery'

interface Props {
  results: LotteryResult[]
}

function NumBadge({ value }: { value: string | null }) {
  if (!value) return <span className="text-slate-400">—</span>
  return (
    <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
      {value}
    </span>
  )
}

export default function HistoryTable({ results }: Props) {
  if (results.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        ไม่พบข้อมูล
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">งวดวันที่</th>
            <th className="px-4 py-3 text-center font-semibold">6 ตัว</th>
            <th className="px-4 py-3 text-center font-semibold">3 ตัวบน</th>
            <th className="px-4 py-3 text-center font-semibold">2 ตัวบน</th>
            <th className="px-4 py-3 text-center font-semibold">2 ตัวล่าง</th>
            <th className="px-4 py-3 text-center font-semibold">นามสัตว์</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => {
            const dateObj = new Date(r.draw_date + 'T00:00:00')
            const formatted = dateObj.toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              weekday: 'short',
            })
            return (
              <tr
                key={r.id}
                className={`
                  border-t border-slate-200 dark:border-slate-700
                  transition-colors hover:bg-yellow-50 dark:hover:bg-slate-700/50
                  ${i % 2 === 0 ? 'bg-white dark:bg-slate-800/30' : 'bg-slate-50/50 dark:bg-slate-800/60'}
                `}
              >
                <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400 text-xs">
                  {formatted}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className="font-mono font-bold text-base tracking-widest"
                    style={{ color: '#FFD700' }}
                  >
                    {r.num6 ?? '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center"><NumBadge value={r.num3_top} /></td>
                <td className="px-4 py-3 text-center"><NumBadge value={r.num2_top} /></td>
                <td className="px-4 py-3 text-center"><NumBadge value={r.num2_bottom} /></td>
                <td className="px-4 py-3 text-center text-slate-500 dark:text-slate-400 text-xs">
                  {r.animal_name_th ?? '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
