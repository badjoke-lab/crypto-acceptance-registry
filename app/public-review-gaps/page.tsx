import { getGeneratedReviewQueue } from '../../lib/generated-review-data'

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

export default function PublicReviewGapsPage() {
  const records = getGeneratedReviewQueue()
  const reasonBreakdown = Object.entries(countBy(records.flatMap((record) => record.review_reasons)))
    .sort((a, b) => b[1] - a[1])
  const countryBreakdown = Object.entries(countBy(records.map((record) => record.country || 'Unknown')))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Review Gaps</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        These are the main reasons records remain outside the public-ready baseline.
      </p>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18, paddingTop: 18 }}>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <h2 style={{ marginTop: 0 }}>Review reasons</h2>
          <ul>
            {reasonBreakdown.map(([reason, count]) => (
              <li key={reason}>{reason}: {count}</li>
            ))}
          </ul>
        </div>

        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <h2 style={{ marginTop: 0 }}>Top pending countries</h2>
          <ul>
            {countryBreakdown.map(([country, count]) => (
              <li key={country}>{country}: {count}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
