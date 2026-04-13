import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getLatestResult, getHotColdNumbers } from '@/lib/db'
import ResultCard from '@/components/lottery/ResultCard'
import HotColdNumbers from '@/components/lottery/HotColdNumbers'

export const revalidate = 0

export default async function HomePage() {
  const { env } = await getCloudflareContext({ async: true })
  const [latest, hotCold] = await Promise.all([
    getLatestResult(env.DB),
    getHotColdNumbers(env.DB, 50),
  ])

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        <div className="text-center">
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: '#FFD700', textShadow: '0 0 20px rgba(255,165,0,0.4)' }}
          >
            🎯 Lao Lottery Hub
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            ผลหวยลาวอัปเดตอัตโนมัติ · ทุกวันจันทร์ พุธ ศุกร์
          </p>
        </div>

        {latest ? (
          <ResultCard result={latest} />
        ) : (
          <div className="w-full rounded-2xl p-10 text-center bg-slate-800 text-slate-400">
            ยังไม่มีข้อมูล กรุณารอผลงวดถัดไป
          </div>
        )}

        <HotColdNumbers hot={hotCold.hot} cold={hotCold.cold} />

      </div>
    </main>
  )
}
