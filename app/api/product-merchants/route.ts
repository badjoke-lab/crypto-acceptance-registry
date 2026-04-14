import { NextResponse } from 'next/server'
import { getAllProductMerchants } from '../../../lib/product-data'

export function GET() {
  return NextResponse.json({ merchants: getAllProductMerchants() })
}
