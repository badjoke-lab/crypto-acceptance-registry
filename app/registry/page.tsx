import Link from 'next/link'
import { getAllMerchantRecords } from '../../lib/merchant-data'

export default function RegistryPage() {
  const merchants = getAllMerchantRecords()

  return (
    <main style={{ padding: 24, maxWidth: 1040, margin: '0 auto' }}>
      <h1>Registry</h1>
      <p>Merchant acceptance records with explicit mode, confidence, and evidence.</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Location</th>
            <th align="left">Mode</th>
            <th align="left">Confidence</th>
            <th align="left">Assets</th>
          </tr>
        </thead>
        <tbody>
          {merchants.map((merchant) => (
            <tr key={merchant.legacy_id}>
              <td>
                <Link href={`/registry/${encodeURIComponent(merchant.legacy_id)}`}>
                  {merchant.display_name}
                </Link>
              </td>
              <td>{[merchant.city, merchant.country].filter(Boolean).join(', ') || 'Unknown'}</td>
              <td>{merchant.proposed_mode}</td>
              <td>{merchant.confidence}</td>
              <td>{merchant.accepted_assets.join(', ') || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
