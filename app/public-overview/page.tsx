import Link from 'next/link'
import { getGeneratedCutoverReport } from '../../lib/generated-cutover-report'
import { getGeneratedProductStats } from '../../lib/generated-product-stats'
import { getGeneratedReviewQueue } from '../../lib/generated-review-data'

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

export default function PublicOverviewPage() {
  const report = getGeneratedCutoverReport()
  const stats = getGeneratedProductStats()
  const reviewQueue = getGeneratedReviewQueue()

  const topCountries = Object.entries(stats.countryBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 12)
  const topReviewReasons = Object.entries(countBy(reviewQueue.flatMap((record) => record.review_reasons)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Overview</h1>
      <p style={{ maxWidth: 780, color: '#4b5563', lineHeight: 1.6 }}>
        One-screen summary of the current public-ready baseline and the pending review backlog.
      </p>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, paddingTop: 18 }}>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ready baseline</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6 }}>{report.merchants.total}</div>
        </div>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pending review</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6 }}>{report.reviewQueue.total}</div>
        </div>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>High confidence</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6 }}>{report.merchants.highConfidence}</div>
        </div>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>With evidence</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6 }}>{report.merchants.withEvidence}</div>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18, paddingTop: 22 }}>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <h2 style={{ marginTop: 0 }}>Top ready countries</h2>
          <ul>
            {topCountries.map(([country, count]) => (
              <li key={country}>{country}: {count}</li>
            ))}
          </ul>
          <p><Link href="/public-countries">Open country browser</Link></p>
        </div>

        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <h2 style={{ marginTop: 0 }}>Top pending reasons</h2>
          <ul>
            {topReviewReasons.map(([reason, count]) => (
              <li key={reason}>{reason}: {count}</li>
            ))}
          </ul>
          <p><Link href="/public-review-gaps">Open review gaps</Link></p>
        </div>
      </section>

      <section style={{ display: 'flex', gap: 16, flexWrap: 'wrap', paddingTop: 12 }}>
        <Link href="/public-search">Search</Link>
        <Link href="/public">Catalog</Link>
        <Link href="/public-stats">Stats</Link>
        <Link href="/public-methodology">Methodology</Link>
      </section>
    </main>
  )
}
