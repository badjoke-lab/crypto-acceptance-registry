import { NextResponse } from 'next/server'
import { getGeneratedProductMerchants } from '../../../lib/generated-product-data'

export function GET() {
  return NextResponse.json({ merchants: getGeneratedProductMerchants() })
}
