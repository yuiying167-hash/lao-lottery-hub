interface NumberStat {
  digit: string
  count: number
}

interface Props {
  hot: NumberStat[]
  cold: NumberStat[]
}

function StatBadge({
  digit,
  count,
  variant,
}: {
  digit: string
  count: number
  variant: 'hot' | 'cold'
}) {
  const isHot = variant === 'hot'
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        rounded-xl px-3 py-2 min-w-[56px]
        border font-mono font-bold
        ${isHot
          ? 'bg-red-500/10 border-red-400/40 text-red-300'
          : 'bg-blue-500/10 border-blue-400/40 text-blue-300'
        }
      `}
    >
      <span className="text-xl">{digit}</span>
      <span className="text-[10px] opacity-60 mt-0.5">{count}ครั้ง</span>
    </div>
  )
}

export default function HotColdNumbers({ hot, cold }: Props) {
  return (
    <section className="w-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">
          📊 สถิติเลข 2 ตัวบน (50 งวดล่าสุด)
        </h2>
        <a
          href="/statistics"
          className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline"
        >
          ดูทั้งหมด →
        </a>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* HOT */}
        <div>
          <p className="text-xs font-semibold text-red-500 mb-2 flex items-center gap-1">
            🔥 เลขร้อน
          </p>
          <div className="flex flex-wrap gap-2">
            {hot.map((item) => (
              <StatBadge
                key={item.digit}
                digit={item.digit}
                count={item.count}
                variant="hot"
              />
            ))}
          </div>
        </div>

        {/* COLD */}
        <div>
          <p className="text-xs font-semibold text-blue-500 mb-2 flex items-center gap-1">
            🧊 เลขเย็น
          </p>
          <div className="flex flex-wrap gap-2">
            {cold.map((item) => (
              <StatBadge
                key={item.digit}
                digit={item.digit}
                count={item.count}
                variant="cold"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
