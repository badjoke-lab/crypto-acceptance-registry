import { getGeneratedProductStats } from '../../lib/generated-product-stats'

export default function PublicStatsPage() {
  const stats = getGeneratedProductStats()

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>Public Stats</h1>

      <p>Total merchants: {stats.totalMerchants}</p>

      <h2>Mode Breakdown</h2>
      <ul>
        {Object.entries(stats.modeBreakdown).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>

      <h2>Confidence Breakdown</h2>
      <ul>
        {Object.entries(stats.confidenceBreakdown).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>

      <h2>Country Breakdown</h2>
      <ul>
        {Object.entries(stats.countryBreakdown).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>

      <h2>Processor Breakdown</h2>
      <ul>
        {Object.entries(stats.processorBreakdown).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
    </main>
  )
}
