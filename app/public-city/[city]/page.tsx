import Link from 'next/link'
import { getGeneratedProductMerchants } from '../../../lib/generated-product-data'

type PublicCityDetailPageProps = {
  params: {
    city: string
  }
}

function whyReadyLine(merchant: ReturnType<typeof getGeneratedProductMerchants>[number]): string {
  const reasons: string[] = []
  if (merchant.evidence_refs.length > 0) reasons.push(`${merchant.evidence_refs.length} reference${merchant.evidence_refs.length > 1 ? 's' : ''}`)
  if (merchant.website) reasons.push('website')
  if (merchant.payment_processors.length > 0) reasons.push(`processor: ${merchant.payment_processors.join(', ')}`)
  if (merchant.accepted_assets.length > 0) reasons.push(`assets: ${merchant.accepted_assets.slice(0, 3).join(', ')}`)
  return reasons.join(' · ') || 'ready baseline'
}

export default function PublicCityDetailPage({ params }: PublicCityDetailPageProps) {
  const city = decodeURIComponent(params.city)
  const merchants = getGeneratedProductMerchants()
    .filter((merchant) => [merchant.city, merchant.country].filter(Boolean).join(', ').toLowerCase() === city.toLowerCase())
    .slice(0, 300)

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <p><Link href="/public-cities">← Back to public cities</Link></p>
      <h1>City: {city}</h1>
      <p style={{ color: '#4b5563' }}>Ready merchants in this city bucket: {merchants.length}</p>

      <div style={{ display: 'grid', gap: 14, paddingTop: 12 }}>
        {merchants.map((merchant) => (
          <article key={merchant.legacy_id} style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  <Link href={`/public/${encodeURIComponent(merchant.legacy_id)}`}>{merchant.display_name}</Link>
                </div>
                <div style={{ fontSize: 14, color: '#4b5563' }}>{[merchant.city, merchant.country].filter(Boolean).join(', ') || 'Unknown location'}</div>
              </div>
              <div style={{ fontSize: 13, color: '#374151' }}>{merchant.proposed_mode} · {merchant.confidence}</div>
            </div>
            <div style={{ fontSize: 14, color: '#1f2937', marginTop: 10 }}>{whyReadyLine(merchant)}</div>
          </article>
        ))}
      </div>
    </main>
  )
}
