import Link from 'next/link'
import { getGeneratedProductMerchants } from '../../lib/generated-product-data'

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

export default function PublicChainsPage() {
  const records = getGeneratedProductMerchants()
  const chains = Object.entries(countBy(records.flatMap((record) => record.accepted_chains)))
    .sort((a, b) => b[1] - a[1])

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Chains</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        Browse the ready baseline by accepted chain. Each entry opens a fixed chain page.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, paddingTop: 18 }}>
        {chains.map(([chain, count]) => (
          <Link
            key={chain}
            href={`/public-chain/${encodeURIComponent(chain)}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #dbeafe',
              borderRadius: 16,
              padding: 18,
              background: '#f8fbff',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>{chain}</div>
            <div style={{ fontSize: 14, color: '#4b5563', marginTop: 6 }}>{count} ready merchants</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
