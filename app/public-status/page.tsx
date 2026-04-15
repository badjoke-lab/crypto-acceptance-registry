import { getGeneratedCutoverReport } from '../../lib/generated-cutover-report'

export default function PublicStatusPage() {
  const report = getGeneratedCutoverReport()

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>Public Status</h1>
      <p>Generated at: {report.generatedAt}</p>

      <h2>Ready baseline</h2>
      <ul>
        <li>Total ready merchants: {report.merchants.total}</li>
        <li>With evidence: {report.merchants.withEvidence}</li>
        <li>With website: {report.merchants.withWebsite}</li>
      </ul>

      <h2>Confidence</h2>
      <ul>
        <li>High: {report.merchants.highConfidence}</li>
        <li>Medium: {report.merchants.mediumConfidence}</li>
        <li>Low: {report.merchants.lowConfidence}</li>
      </ul>

      <h2>Pending backlog</h2>
      <p>Total pending checks: {report.reviewQueue.total}</p>
    </main>
  )
}
