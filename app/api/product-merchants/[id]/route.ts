import { NextResponse } from 'next/server'
import { getProductMerchantById } from '../../../../lib/product-data'

type RouteContext = {
  params: {
    id: string
  }
}

export function GET(_request: Request, context: RouteContext) {
  const merchant = getProductMerchantById(context.params.id)

  if (!merchant) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  return NextResponse.json({ merchant })
}
