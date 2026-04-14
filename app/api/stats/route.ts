import { NextResponse } from 'next/server'
import { getConfidenceBreakdown, getModeBreakdown } from '../../../lib/stats'

export function GET() {
  return NextResponse.json({
    modeBreakdown: getModeBreakdown(),
    confidenceBreakdown: getConfidenceBreakdown(),
  })
}
