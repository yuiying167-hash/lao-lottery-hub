import type { LotteryResult } from '@/types/lottery'

interface Props {
  result: LotteryResult
}

function NumberBox({
  label,
  value,
  large,
  delay = 0,
}: {
  label: string
  value: string | null
  large?: boolean
  delay?: number
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[11px] text-yellow-300/60 font-medium tracking-widest uppercase">
        {label}
      </span>
      <div
        className={`
          num-reveal font-mono-num font-bold tracking-widest
          flex items-center justify-center rounded-2xl
          border border-yellow-400/25
          text-white
          ${large
            ? 'px-8 py-5 text-5xl sm:text-6xl gold-glow'
            : 'px-5 py-3.5 text-2xl sm:text-3xl'
          }
        `}
        style={{
          background: large
            ? 'linear-gradient(135deg, #1a2744 0%, #2d1a0e 50%, #1a2744 100%)'
            : 'rgba(255,215,0,0.06)',
          animationDelay: `${delay}ms`,
        }}
      >
        {value ?? '—'}
      </div>
    </div>
  )
}

export default function ResultCard({ result }: Props) {
  const dateObj = new Date(result.draw_date + 'T00:00:00')
  const formatted = dateObj.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <section
      className="w-full rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #1E293B 0%, #2d1a0e 40%, #1a1a2e 100%)',
        boxShadow: '0 0 60px rgba(255,165,0,0.12), 0 0 0 1px rgba(255,215,0,0.08)',
      }}
    >
      {/* 상단 골드 띠 */}
      <div className="h-1 w-full" style={{
        background: 'linear-gradient(90deg, transparent, #FFD700, #FFA500, #FFD700, transparent)'
      }} />

      <div className="p-6 sm:p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <p className="text-base font-bold mb-1" style={{ color: '#FFD700' }}>
            🎰 ผลหวยลาววันนี้
          </p>
          <p className="text-yellow-200/70 text-sm">{formatted}</p>
          {result.animal_name_th && (
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full
              border border-yellow-400/20 bg-yellow-400/5">
              <span className="text-yellow-300/80 text-xs">
                นามสัตว์: <span className="font-semibold">{result.animal_name_th}</span>
                {result.animal_name_lo ? ` · ${result.animal_name_lo}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* 6자리 메인 */}
        <div className="flex justify-center mb-8">
          <NumberBox label="เลข 6 ตัว" value={result.num6} large delay={0} />
        </div>

        {/* 구분선 */}
        <div className="border-t border-white/5 mb-6" />

        {/* 5자리, 4자리 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex justify-center">
            <NumberBox label="เลข 5 ตัว" value={result.num5} delay={100} />
          </div>
          <div className="flex justify-center">
            <NumberBox label="เลข 4 ตัว" value={result.num4} delay={200} />
          </div>
        </div>

        {/* 3자리, 2상단, 2하단 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex justify-center">
            <NumberBox label="3 ตัวบน" value={result.num3_top} delay={300} />
          </div>
          <div className="flex justify-center">
            <NumberBox label="2 ตัวบน" value={result.num2_top} delay={400} />
          </div>
          <div className="flex justify-center">
            <NumberBox label="2 ตัวล่าง" value={result.num2_bottom} delay={500} />
          </div>
        </div>
      </div>

      {/* 하단 골드 띠 */}
      <div className="h-0.5 w-full" style={{
        background: 'linear-gradient(90deg, transparent, #FFD700, transparent)'
      }} />
    </section>
  )
}
