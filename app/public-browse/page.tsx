import Link from 'next/link'
import { getGeneratedProductStats } from '../../lib/generated-product-stats'

export default function PublicBrowsePage() {
  const stats = getGeneratedProductStats()
  const topCountries = Object.entries(stats.countryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)

  const topModes = Object.entries(stats.modeBreakdown).sort((a, b) => b[1] - a[1])
  const topProcessors = Object.entries(stats.processorBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 20)

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Browse</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        Fast browsing entrypoints into the ready baseline by country, mode, and processor coverage.
      </p>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, paddingTop: 20 }}>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <h2 style={{ marginTop: 0 }}>Top countries</h2>
          <ul>
            {topCountries.map(([country, count]) => (
              <li key={country}>{country}: {count}</li>
            ))}
          </ul>
        </div>

        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <h2 style={{ marginTop: 0 }}>Modes</h2>
          <ul>
            {topModes.map(([mode, count]) => (
              <li key={mode}>{mode}: {count}</li>
            ))}
          </ul>
        </div>

        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <h2 style={{ marginTop: 0 }}>Processors</h2>
          <ul>
            {topProcessors.length > 0 ? topProcessors.map(([processor, count]) => (
              <li key={processor}>{processor}: {count}</li>
            )) : <li>No processor-tagged public-ready records yet.</li>}
          </ul>
        </div>
      </section>

      <p style={{ paddingTop: 12 }}>
        <Link href="/public-search">Open public search</Link>
      </p>
    </main>
  )
}
