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
  rank,
}: {
  digit: string
  count: number
  variant: 'hot' | 'cold'
  rank: number
}) {
  const isHot = variant === 'hot'
  const rankEmoji = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : ''

  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl px-4 py-3 min-w-[64px] border transition-transform hover:scale-105 cursor-default"
      style={{
        background: isHot
          ? 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))'
          : 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))',
        borderColor: isHot ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)',
      }}
    >
      {rankEmoji && <span className="text-[10px] mb-0.5">{rankEmoji}</span>}
      <span className="font-mono-num font-bold text-2xl"
        style={{ color: isHot ? '#FCA5A5' : '#93C5FD' }}>
        {digit}
      </span>
      <span className="text-[10px] mt-0.5 opacity-50">{count}ครั้ง</span>
    </div>
  )
}

export default function HotColdNumbers({ hot, cold }: Props) {
  return (
    <section
      className="w-full rounded-3xl p-6"
      style={{
        background: '#162032',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-white text-base">
          📊 สถิติเลข 2 ตัวบน
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">50 งวดล่าสุด</span>
          <a
            href="/statistics"
            className="text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
            style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700' }}
          >
            ดูสถิติเต็ม →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-bold text-red-400 mb-3 flex items-center gap-1.5">
            🔥 เลขร้อน <span className="text-slate-600 font-normal">ออกบ่อย</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {hot.map((item, i) => (
              <StatBadge key={item.digit} digit={item.digit} count={item.count} variant="hot" rank={i} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-blue-400 mb-3 flex items-center gap-1.5">
            🧊 เลขเย็น <span className="text-slate-600 font-normal">ไม่ออกนาน</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {cold.map((item, i) => (
              <StatBadge key={item.digit} digit={item.digit} count={item.count} variant="cold" rank={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
