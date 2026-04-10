import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getHistoryResults } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get('per_page') ?? '20')))
    const search = searchParams.get('q') ?? ''

    const { env } = await getCloudflareContext({ async: true })
    const data = await getHistoryResults(env.DB, page, perPage, search)
    return NextResponse.json({ ...data, page, perPage })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
