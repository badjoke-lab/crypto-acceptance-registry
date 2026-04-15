import { NextResponse } from 'next/server'
import { getGeneratedProductStats } from '../../../lib/generated-product-stats'

export function GET() {
  const stats = getGeneratedProductStats()
  const countries = Object.entries(stats.countryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([country, count]) => ({ country, count }))

  return NextResponse.json({
    total: countries.length,
    countries,
  })
}
