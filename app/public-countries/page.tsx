import Link from 'next/link'
import { getGeneratedProductStats } from '../../lib/generated-product-stats'

export default function PublicCountriesPage() {
  const stats = getGeneratedProductStats()
  const countries = Object.entries(stats.countryBreakdown)
    .sort((a, b) => b[1] - a[1])

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Countries</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        Browse the ready baseline by country. Each entry links into the public search surface.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, paddingTop: 18 }}>
        {countries.map(([country, count]) => (
          <Link
            key={country}
            href={`/public-search?q=${encodeURIComponent(country)}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #dbeafe',
              borderRadius: 16,
              padding: 18,
              background: '#f8fbff',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>{country}</div>
            <div style={{ fontSize: 14, color: '#4b5563', marginTop: 6 }}>{count} ready merchants</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
