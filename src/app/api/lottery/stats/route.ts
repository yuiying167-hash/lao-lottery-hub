import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getHotColdNumbers } from '@/lib/db'

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true })
    const data = await getHotColdNumbers(env.DB, 50)
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
