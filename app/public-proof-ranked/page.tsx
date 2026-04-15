import Link from 'next/link'
import { getGeneratedProductMerchants } from '../../lib/generated-product-data'

function proofScore(record: ReturnType<typeof getGeneratedProductMerchants>[number]): number {
  let score = 0
  score += record.evidence_refs.length * 3
  if (record.website) score += 2
  if (record.payment_processors.length > 0) score += 2
  if (record.confidence === 'high') score += 2
  if (record.confidence === 'medium') score += 1
  return score
}

export default function PublicProofRankedPage() {
  const merchants = [...getGeneratedProductMerchants()]
    .sort((a, b) => proofScore(b) - proofScore(a))
    .slice(0, 200)

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Proof Ranked</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        Ready merchants ranked by visible proof signals such as evidence references, website presence,
        processor tags, and confidence.
      </p>

      <div style={{ display: 'grid', gap: 14, paddingTop: 18 }}>
        {merchants.map((merchant) => (
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
                score {proofScore(merchant)} · {merchant.proposed_mode} · {merchant.confidence}
              </div>
            </div>
            <div style={{ fontSize: 14, color: '#1f2937', marginTop: 10 }}>
              references: {merchant.evidence_refs.length} · website: {merchant.website ? 'yes' : 'no'} · processors: {merchant.payment_processors.join(', ') || '—'}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
