import Link from 'next/link'
import { getGeneratedProductMerchants } from '../../lib/generated-product-data'

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

export default function PublicCitiesPage() {
  const records = getGeneratedProductMerchants()
  const cityKeys = records.map((record) => [record.city, record.country].filter(Boolean).join(', ') || 'Unknown')
  const cities = Object.entries(countBy(cityKeys)).sort((a, b) => b[1] - a[1])

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Cities</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        Browse the ready baseline by city and country. Each entry opens the public search surface.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, paddingTop: 18 }}>
        {cities.map(([city, count]) => (
          <Link
            key={city}
            href={`/public-search?q=${encodeURIComponent(city)}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #dbeafe',
              borderRadius: 16,
              padding: 18,
              background: '#f8fbff',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>{city}</div>
            <div style={{ fontSize: 14, color: '#4b5563', marginTop: 6 }}>{count} ready merchants</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
