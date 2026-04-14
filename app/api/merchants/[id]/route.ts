import { NextResponse } from 'next/server'
import { getMerchantRecordById } from '../../../../lib/merchant-data'

type RouteContext = {
  params: {
    id: string
  }
}

export function GET(_request: Request, context: RouteContext) {
  const merchant = getMerchantRecordById(context.params.id)

  if (!merchant) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  return NextResponse.json({ merchant })
}
