import { getGeneratedCutoverReport } from '../../lib/generated-cutover-report'

export default function PublicCutoverPage() {
  const report = getGeneratedCutoverReport()

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>Public Cutover</h1>
      <p>Generated at: {report.generatedAt}</p>

      <h2>Public Baseline</h2>
      <ul>
        <li>Total ready merchants: {report.merchants.total}</li>
        <li>With evidence: {report.merchants.withEvidence}</li>
        <li>With website: {report.merchants.withWebsite}</li>
        <li>High confidence: {report.merchants.highConfidence}</li>
        <li>Medium confidence: {report.merchants.mediumConfidence}</li>
        <li>Low confidence: {report.merchants.lowConfidence}</li>
      </ul>

      <h2>Pending Review</h2>
      <p>Total pending checks: {report.reviewQueue.total}</p>

      <h2>Mode Breakdown</h2>
      <ul>
        {Object.entries(report.stats.modeBreakdown).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
    </main>
  )
}
