import type { LotteryResult } from '@/types/lottery'
interface Props { result: LotteryResult }

function Block({ label, value, size='md', delay=0 }: {
  label: string; value: string|null; size?: 'xl'|'md'|'sm'; delay?: number
}) {
  const s = {
    xl: { fontSize: '3.5rem', padding: '20px 36px', letterSpacing: '0.1em' },
    md: { fontSize: '1.75rem', padding: '14px 24px', letterSpacing: '0.08em' },
    sm: { fontSize: '1.4rem',  padding: '12px 18px', letterSpacing: '0.06em' },
  }[size]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'rgba(255,215,0,0.4)' }}>
        {label}
      </span>
      <div
        className={`num-reveal font-mono-num ${size === 'xl' ? 'gold-glow' : ''}`}
        style={{
          ...s,
          fontWeight: 800,
          borderRadius: 16,
          color: size === 'xl' ? '#FFD700' : '#f5e6d3',
          background: size === 'xl'
            ? 'linear-gradient(135deg, #3d0c15 0%, #5c1020 50%, #3d0c15 100%)'
            : 'rgba(255,215,0,0.04)',
          border: `1px solid ${size === 'xl' ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.06)'}`,
          animationDelay: `${delay}ms`,
        }}
      >
        {value ?? '—'}
      </div>
    </div>
  )
}

export default function ResultCard({ result }: Props) {
  const d = new Date(result.draw_date + 'T00:00:00')
  const fmt = d.toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  })

  return (
    <section style={{
      width: '100%', borderRadius: 24, overflow: 'hidden',
      background: 'linear-gradient(160deg, #2a0a10 0%, #3d0c15 40%, #1e0509 100%)',
      border: '1px solid rgba(255,215,0,0.1)',
      boxShadow: '0 4px 60px rgba(196,30,58,0.15), 0 1px 0 rgba(255,215,0,0.06) inset',
    }}>
      {/* 상단 라인 */}
      <div style={{ height: 2,
        background: 'linear-gradient(90deg, transparent, #c41e3a 20%, #FFD700 50%, #c41e3a 80%, transparent)' }} />

      <div style={{ padding: '28px 28px 32px' }}>
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p className="shimmer-text" style={{ fontSize: 18, fontWeight: 900, marginBottom: 4 }}>
            ผลหวยลาววันนี้
          </p>
          <p style={{ fontSize: 12, color: 'rgba(245,230,211,0.4)' }}>{fmt}</p>
          {result.animal_name_th && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10,
              padding: '4px 14px', borderRadius: 20,
              background: 'rgba(196,30,58,0.1)', border: '1px solid rgba(196,30,58,0.25)' }}>
              <span style={{ fontSize: 11, color: 'rgba(255,215,0,0.65)' }}>
                นามสัตว์ · <strong>{result.animal_name_th}</strong>
                {result.animal_name_lo && <span style={{ opacity: 0.5, marginLeft: 6 }}>{result.animal_name_lo}</span>}
              </span>
            </div>
          )}
        </div>

        {/* 6자리 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <Block label="เลข 6 ตัว" value={result.num6} size="xl" delay={0} />
        </div>

        {/* 구분선 */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', marginBottom: 20 }} />

        {/* 5자리, 4자리 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Block label="เลข 5 ตัว" value={result.num5} size="md" delay={80} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Block label="เลข 4 ตัว" value={result.num4} size="md" delay={160} />
          </div>
        </div>

        {/* 3자리, 2상단, 2하단 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: '3 ตัวบน',  val: result.num3_top,    d: 240 },
            { label: '2 ตัวบน',  val: result.num2_top,    d: 320 },
            { label: '2 ตัวล่าง', val: result.num2_bottom, d: 400 },
          ].map(({ label, val, d }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'center' }}>
              <Block label={label} value={val} size="sm" delay={d} />
            </div>
          ))}
        </div>
      </div>

      {/* 하단 라인 */}
      <div style={{ height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent)' }} />
    </section>
  )
}
