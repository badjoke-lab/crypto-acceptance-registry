import { NextResponse } from 'next/server'
import { getGeneratedReviewQueue } from '../../../lib/generated-review-data'

export function GET() {
  return NextResponse.json({ checks: getGeneratedReviewQueue() })
}
