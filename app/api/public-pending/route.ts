import { NextResponse } from 'next/server'
import { getGeneratedReviewQueue } from '../../../lib/generated-review-data'

export function GET() {
  const pending = getGeneratedReviewQueue()
  return NextResponse.json({
    total: pending.length,
    pending,
  })
}
