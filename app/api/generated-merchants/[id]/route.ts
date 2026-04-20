import { NextResponse } from 'next/server'
import { getGeneratedProductMerchantById } from '../../../../lib/generated-product-data'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const merchant = getGeneratedProductMerchantById(id)

  if (!merchant) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  return NextResponse.json({ merchant })
}
