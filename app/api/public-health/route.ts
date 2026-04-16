import { NextResponse } from 'next/server'
import { getGeneratedCutoverReport } from '../../../lib/generated-cutover-report'

function pct(part: number, whole: number): number {
  if (!whole) return 0
  return Number(((part / whole) * 100).toFixed(1))
}

export function GET() {
  const report = getGeneratedCutoverReport()
  const ready = report.merchants.total
  const pending = report.reviewQueue.total
  const total = ready + pending

  return NextResponse.json({
    total,
    ready,
    pending,
    readySharePct: pct(ready, total),
    pendingSharePct: pct(pending, total),
    withEvidence: report.merchants.withEvidence,
    withEvidencePct: pct(report.merchants.withEvidence, ready),
    withWebsite: report.merchants.withWebsite,
    withWebsitePct: pct(report.merchants.withWebsite, ready),
    highConfidence: report.merchants.highConfidence,
    highConfidencePct: pct(report.merchants.highConfidence, ready),
    mediumConfidence: report.merchants.mediumConfidence,
    mediumConfidencePct: pct(report.merchants.mediumConfidence, ready),
    lowConfidence: report.merchants.lowConfidence,
    lowConfidencePct: pct(report.merchants.lowConfidence, ready),
  })
}
