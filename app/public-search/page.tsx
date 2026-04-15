import Link from 'next/link'
import { searchPublicMerchants } from '../../lib/public-search'

type PublicSearchPageProps = {
  searchParams?: {
    q?: string
  }
}

function whyReadyLine(merchant: ReturnType<typeof searchPublicMerchants>[number]): string {
  const reasons: string[] = []
  if (merchant.evidence_refs.length > 0) reasons.push(`${merchant.evidence_refs.length} reference${merchant.evidence_refs.length > 1 ? 's' : ''}`)
  if (merchant.website) reasons.push('website')
  if (merchant.payment_processors.length > 0) reasons.push(`processor: ${merchant.payment_processors.join(', ')}`)
  if (merchant.accepted_assets.length > 0) reasons.push(`assets: ${merchant.accepted_assets.slice(0, 3).join(', ')}`)
  return reasons.join(' · ') || 'ready baseline'
}

export default function PublicSearchPage({ searchParams }: PublicSearchPageProps) {
  const q = searchParams?.q ?? ''
  const merchants = searchPublicMerchants(q)

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Search</h1>
      <p style={{ color: '#4b5563', maxWidth: 760 }}>
        Search across the ready baseline by merchant name, place, asset, chain, processor, or note text.
      </p>

      <form action="/public-search" method="get" style={{ display: 'flex', gap: 12, margin: '20px 0 24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search merchants, cities, BTC, Lightning, BitPay…"
          style={{ flex: '1 1 320px', minWidth: 260, border: '1px solid #d1d5db', borderRadius: 12, padding: '12px 14px' }}
        />
        <button type="submit" style={{ border: '1px solid #2563eb', background: '#2563eb', color: '#fff', borderRadius: 12, padding: '12px 16px', fontWeight: 700 }}>
          Search
        </button>
      </form>

      <p style={{ fontSize: 14, color: '#6b7280' }}>
        Query: <strong>{q || '—'}</strong> · Results: <strong>{merchants.length}</strong>
      </p>

      <div style={{ display: 'grid', gap: 14, paddingTop: 12 }}>
        {merchants.slice(0, 200).map((merchant) => (
          <article key={merchant.legacy_id} style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  <Link href={`/public/${encodeURIComponent(merchant.legacy_id)}`}>{merchant.display_name}</Link>
                </div>
                <div style={{ fontSize: 14, color: '#4b5563' }}>
                  {[merchant.city, merchant.country].filter(Boolean).join(', ') || 'Unknown location'}
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#374151' }}>
                {merchant.proposed_mode} · {merchant.confidence}
              </div>
            </div>
            <div style={{ fontSize: 14, color: '#1f2937', marginTop: 10 }}>
              {whyReadyLine(merchant)}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
