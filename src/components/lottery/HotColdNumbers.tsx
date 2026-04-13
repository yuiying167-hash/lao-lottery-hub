interface NumberStat { digit: string; count: number }
interface Props { hot: NumberStat[]; cold: NumberStat[] }

function Badge({ digit, count, variant, rank }: {
  digit: string; count: number; variant: 'hot'|'cold'; rank: number
}) {
  const isHot = variant === 'hot'
  const medals = ['🥇','🥈','🥉']
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '10px 14px', borderRadius: 14, minWidth: 60, cursor: 'default',
      transition: 'transform 0.15s',
      background: isHot
        ? 'linear-gradient(135deg, rgba(196,30,58,0.15), rgba(196,30,58,0.05))'
        : 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.04))',
      border: `1px solid ${isHot ? 'rgba(196,30,58,0.3)' : 'rgba(59,130,246,0.25)'}`,
    }}
    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {rank < 3 && <span style={{ fontSize: 9, marginBottom: 2 }}>{medals[rank]}</span>}
      <span className="font-mono-num" style={{
        fontSize: 22, fontWeight: 800,
        color: isHot ? '#fca5a5' : '#93c5fd',
      }}>{digit}</span>
      <span style={{ fontSize: 9, marginTop: 2, opacity: 0.45 }}>{count}ครั้ง</span>
    </div>
  )
}

export default function HotColdNumbers({ hot, cold }: Props) {
  return (
    <section style={{
      width: '100%', borderRadius: 20, padding: 24,
      background: 'linear-gradient(135deg, #2a0a10, #1e0509)',
      border: '1px solid rgba(255,215,0,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f5e6d3', margin: 0 }}>
          สถิติเลข 2 ตัวบน
        </h2>
        <a href="/statistics" style={{
          fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 20, textDecoration: 'none',
          background: 'rgba(255,215,0,0.1)', color: '#FFD700',
          border: '1px solid rgba(255,215,0,0.2)',
        }}>ดูสถิติเต็ม →</a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#f87171', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 6 }}>
            🔥 เลขร้อน <span style={{ color: 'rgba(245,230,211,0.25)', fontWeight: 400 }}>ออกบ่อย</span>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {hot.map((item, i) => (
              <Badge key={item.digit} digit={item.digit} count={item.count} variant="hot" rank={i} />
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 6 }}>
            🧊 เลขเย็น <span style={{ color: 'rgba(245,230,211,0.25)', fontWeight: 400 }}>ไม่ออกนาน</span>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {cold.map((item, i) => (
              <Badge key={item.digit} digit={item.digit} count={item.count} variant="cold" rank={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
