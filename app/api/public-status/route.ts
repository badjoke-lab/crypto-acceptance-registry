import { NextResponse } from 'next/server'
import { getGeneratedCutoverReport } from '../../../lib/generated-cutover-report'

export function GET() {
  const report = getGeneratedCutoverReport()

  return NextResponse.json({
    generatedAt: report.generatedAt,
    ready: report.merchants,
    pending: report.reviewQueue,
  })
}
