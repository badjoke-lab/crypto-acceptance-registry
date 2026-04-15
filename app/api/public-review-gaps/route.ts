import { NextResponse } from 'next/server'
import { getGeneratedReviewQueue } from '../../../lib/generated-review-data'

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

export function GET() {
  const records = getGeneratedReviewQueue()
  const reviewReasons = Object.entries(countBy(records.flatMap((record) => record.review_reasons)))
    .sort((a, b) => b[1] - a[1])
    .map(([reason, count]) => ({ reason, count }))

  const countries = Object.entries(countBy(records.map((record) => record.country || 'Unknown')))
    .sort((a, b) => b[1] - a[1])
    .map(([country, count]) => ({ country, count }))

  return NextResponse.json({
    total: records.length,
    reviewReasons,
    countries,
  })
}
