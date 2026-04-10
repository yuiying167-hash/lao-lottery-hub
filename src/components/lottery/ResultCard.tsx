import type { LotteryResult } from '@/types/lottery'

interface Props {
  result: LotteryResult
}

function NumberBox({
  label,
  value,
  large,
}: {
  label: string
  value: string | null
  large?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-yellow-200/70 font-medium tracking-wide">
        {label}
      </span>
      <div
        className={`
          flex items-center justify-center rounded-xl
          bg-white/10 border border-yellow-400/30
          font-mono font-bold tracking-widest text-white
          ${large ? 'px-6 py-4 text-4xl sm:text-5xl' : 'px-4 py-3 text-2xl sm:text-3xl'}
        `}
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
      className="w-full rounded-2xl p-6 sm:p-8"
      style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #7C2D12 50%, #1E293B 100%)',
        boxShadow: '0 0 40px rgba(255, 165, 0, 0.15)',
      }}
    >
      {/* 헤더 */}
      <div className="text-center mb-6">
        <p
          className="text-lg font-bold mb-1"
          style={{ color: '#FFD700' }}
        >
          🎰 ผลหวยลาววันนี้
        </p>
        <p className="text-yellow-200/80 text-sm">{formatted}</p>
        {result.animal_name_th && (
          <p className="text-yellow-300/60 text-xs mt-1">
            นามสัตว์: {result.animal_name_th}
            {result.animal_name_lo ? ` · ${result.animal_name_lo}` : ''}
          </p>
        )}
      </div>

      {/* 메인 번호: 6자리 */}
      <div className="flex justify-center mb-6">
        <NumberBox label="เลข 6 ตัว" value={result.num6} large />
      </div>

      {/* 5자리, 4자리 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex justify-center">
          <NumberBox label="เลข 5 ตัว" value={result.num5} />
        </div>
        <div className="flex justify-center">
          <NumberBox label="เลข 4 ตัว" value={result.num4} />
        </div>
      </div>

      {/* 3자리, 2자리 상단, 2자리 하단 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex justify-center">
          <NumberBox label="เลข 3 ตัวบน" value={result.num3_top} />
        </div>
        <div className="flex justify-center">
          <NumberBox label="เลข 2 ตัวบน" value={result.num2_top} />
        </div>
        <div className="flex justify-center">
          <NumberBox label="เลข 2 ตัวล่าง" value={result.num2_bottom} />
        </div>
      </div>
    </section>
  )
}
