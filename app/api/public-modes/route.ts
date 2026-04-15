import { NextResponse } from 'next/server'
import { getGeneratedProductStats } from '../../../lib/generated-product-stats'

export function GET() {
  const stats = getGeneratedProductStats()
  const modes = Object.entries(stats.modeBreakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([mode, count]) => ({ mode, count }))

  return NextResponse.json({
    total: modes.length,
    modes,
  })
}
