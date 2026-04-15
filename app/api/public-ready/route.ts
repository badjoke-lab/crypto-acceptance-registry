import { NextResponse } from 'next/server'
import { getGeneratedProductMerchants } from '../../../lib/generated-product-data'

export function GET() {
  const ready = getGeneratedProductMerchants()
  return NextResponse.json({
    total: ready.length,
    ready,
  })
}
