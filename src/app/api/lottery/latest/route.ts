import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getLatestResult } from '@/lib/db'

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true })
    const result = await getLatestResult(env.DB)
    if (!result) {
      return NextResponse.json({ error: 'No data' }, { status: 404 })
    }
    return NextResponse.json(result)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
