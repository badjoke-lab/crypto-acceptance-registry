import Link from 'next/link'
import { getAllProductMerchants } from '../../lib/product-data'

export default function CatalogPage() {
  const merchants = getAllProductMerchants()

  return (
    <main style={{ padding: 24, maxWidth: 1040, margin: '0 auto' }}>
      <h1>Catalog</h1>
      <p>Product-facing merchant dataset surface.</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Location</th>
            <th align="left">Mode</th>
            <th align="left">Confidence</th>
            <th align="left">Processors</th>
          </tr>
        </thead>
        <tbody>
          {merchants.map((merchant) => (
            <tr key={merchant.legacy_id}>
              <td>
                <Link href={`/catalog/${encodeURIComponent(merchant.legacy_id)}`}>
                  {merchant.display_name}
                </Link>
              </td>
              <td>{[merchant.city, merchant.country].filter(Boolean).join(', ') || 'Unknown'}</td>
              <td>{merchant.proposed_mode}</td>
              <td>{merchant.confidence}</td>
              <td>{merchant.payment_processors.join(', ') || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
