import type { LotteryResult } from '@/types/lottery'

export async function getLatestResult(db: D1Database): Promise<LotteryResult | null> {
  const result = await db
    .prepare(`SELECT * FROM lottery_results ORDER BY draw_date DESC LIMIT 1`)
    .first<LotteryResult>()
  return result ?? null
}

export async function getRecentResults(
  db: D1Database,
  limit = 10
): Promise<LotteryResult[]> {
  const { results } = await db
    .prepare(`SELECT * FROM lottery_results ORDER BY draw_date DESC LIMIT ?`)
    .bind(limit)
    .all<LotteryResult>()
  return results
}

export async function getHotColdNumbers(
  db: D1Database,
  limit = 50
): Promise<{
  hot: { digit: string; count: number }[]
  cold: { digit: string; count: number }[]
}> {
  const { results } = await db
    .prepare(`SELECT num2_top FROM lottery_results ORDER BY draw_date DESC LIMIT ?`)
    .bind(limit)
    .all<{ num2_top: string | null }>()

  const freq: Record<string, number> = {}
  for (let i = 0; i <= 99; i++) {
    freq[String(i).padStart(2, '0')] = 0
  }
  for (const row of results) {
    if (row.num2_top) {
      const key = row.num2_top.padStart(2, '0')
      if (key in freq) freq[key]++
    }
  }

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
  return {
    hot: sorted.slice(0, 5).map(([digit, count]) => ({ digit, count })),
    cold: sorted.slice(-5).reverse().map(([digit, count]) => ({ digit, count })),
  }
}

export async function getHistoryResults(
  db: D1Database,
  page = 1,
  perPage = 20,
  search = ''
): Promise<{ results: LotteryResult[]; total: number }> {
  const offset = (page - 1) * perPage

  if (search) {
    const q = `%${search}%`
    const { results } = await db
      .prepare(
        `SELECT * FROM lottery_results
         WHERE num6 LIKE ? OR num5 LIKE ? OR num4 LIKE ?
            OR num3_top LIKE ? OR num2_top LIKE ? OR num2_bottom LIKE ?
         ORDER BY draw_date DESC LIMIT ? OFFSET ?`
      )
      .bind(q, q, q, q, q, q, perPage, offset)
      .all<LotteryResult>()

    const countRow = await db
      .prepare(
        `SELECT COUNT(*) as cnt FROM lottery_results
         WHERE num6 LIKE ? OR num5 LIKE ? OR num4 LIKE ?
            OR num3_top LIKE ? OR num2_top LIKE ? OR num2_bottom LIKE ?`
      )
      .bind(q, q, q, q, q, q)
      .first<{ cnt: number }>()

    return { results, total: countRow?.cnt ?? 0 }
  }

  const { results } = await db
    .prepare(
      `SELECT * FROM lottery_results ORDER BY draw_date DESC LIMIT ? OFFSET ?`
    )
    .bind(perPage, offset)
    .all<LotteryResult>()

  const countRow = await db
    .prepare(`SELECT COUNT(*) as cnt FROM lottery_results`)
    .first<{ cnt: number }>()

  return { results, total: countRow?.cnt ?? 0 }
}
