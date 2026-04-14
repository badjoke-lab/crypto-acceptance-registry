import { NextResponse } from 'next/server'
import { getGeneratedProductStats } from '../../../lib/generated-product-stats'

export function GET() {
  return NextResponse.json(getGeneratedProductStats())
}
