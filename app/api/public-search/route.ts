import { NextResponse } from 'next/server'
import { searchPublicMerchants } from '../../../lib/public-search'

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const merchants = searchPublicMerchants(q)

  return NextResponse.json({
    query: q,
    total: merchants.length,
    merchants,
  })
}
