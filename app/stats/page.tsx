import { getConfidenceBreakdown, getModeBreakdown } from '../../lib/stats'

export default function StatsPage() {
  const modeBreakdown = getModeBreakdown()
  const confidenceBreakdown = getConfidenceBreakdown()

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>Stats</h1>

      <h2>Mode Breakdown</h2>
      <ul>
        {Object.entries(modeBreakdown).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>

      <h2>Confidence Breakdown</h2>
      <ul>
        {Object.entries(confidenceBreakdown).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
    </main>
  )
}
