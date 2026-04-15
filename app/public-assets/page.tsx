import Link from 'next/link'
import { getGeneratedProductMerchants } from '../../lib/generated-product-data'

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

export default function PublicAssetsPage() {
  const records = getGeneratedProductMerchants()
  const assets = Object.entries(countBy(records.flatMap((record) => record.accepted_assets)))
    .sort((a, b) => b[1] - a[1])

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Assets</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        Browse the ready baseline by accepted asset. Each entry opens the public search surface.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, paddingTop: 18 }}>
        {assets.map(([asset, count]) => (
          <Link
            key={asset}
            href={`/public-search?q=${encodeURIComponent(asset)}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #dbeafe',
              borderRadius: 16,
              padding: 18,
              background: '#f8fbff',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>{asset}</div>
            <div style={{ fontSize: 14, color: '#4b5563', marginTop: 6 }}>{count} ready merchants</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
