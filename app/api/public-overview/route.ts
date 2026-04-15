import { NextResponse } from 'next/server'
import { getGeneratedCutoverReport } from '../../../lib/generated-cutover-report'
import { getGeneratedProductStats } from '../../../lib/generated-product-stats'
import { getGeneratedReviewQueue } from '../../../lib/generated-review-data'

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

export function GET() {
  const report = getGeneratedCutoverReport()
  const stats = getGeneratedProductStats()
  const reviewQueue = getGeneratedReviewQueue()

  const topCountries = Object.entries(stats.countryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([country, count]) => ({ country, count }))

  const topReviewReasons = Object.entries(countBy(reviewQueue.flatMap((record) => record.review_reasons)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([reason, count]) => ({ reason, count }))

  return NextResponse.json({
    ready: report.merchants,
    pending: report.reviewQueue,
    modeBreakdown: stats.modeBreakdown,
    confidenceBreakdown: stats.confidenceBreakdown,
    topCountries,
    topReviewReasons,
  })
}
