import { NextResponse } from 'next/server'
import { getAllMerchantRecords } from '../../../lib/merchant-data'

export function GET() {
  return NextResponse.json({ merchants: getAllMerchantRecords() })
}
