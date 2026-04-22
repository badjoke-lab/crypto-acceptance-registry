import Link from 'next/link'
import { getGeneratedProductMerchantById } from '../../../lib/generated-product-data'

type PublicDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

function whyReadyBlocks(merchant: NonNullable<ReturnType<typeof getGeneratedProductMerchantById>>) {
  return [
    { label: 'References', value: merchant.evidence_refs.length > 0 ? `${merchant.evidence_refs.length}` : '0' },
    { label: 'Website', value: merchant.website ? 'yes' : 'no' },
    { label: 'Processors', value: merchant.payment_processors.join(', ') || '—' },
    { label: 'Assets', value: merchant.accepted_assets.join(', ') || '—' },
  ]
}

export default async function PublicDetailPage({ params }: PublicDetailPageProps) {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  const merchant = getGeneratedProductMerchantById(decodedId)

  if (!merchant) {
    return (
      <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
        <h1>Public record not found</h1>
        <p>No public-ready merchant matched this id.</p>
        <Link href="/public">Back to public catalog</Link>
      </main>
    )
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <p><Link href="/public">← Back to public catalog</Link></p>
      <h1>{merchant.display_name}</h1>
      <p>{[merchant.city, merchant.country].filter(Boolean).join(', ') || 'Unknown location'}</p>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
          padding: '6px 0 20px',
        }}
      >
        {whyReadyBlocks(merchant).map((item) => (
          <div
            key={item.label}
            style={{
              border: '1px solid #dbeafe',
              borderRadius: 14,
              padding: 16,
              background: '#f8fbff',
            }}
          >
            <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {item.label}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{item.value}</div>
          </div>
        ))}
      </section>

      <h2>Classification</h2>
      <ul>
        <li>Mode: {merchant.proposed_mode}</li>
        <li>Confidence: {merchant.confidence}</li>
        <li>Verification status: {merchant.verification_status ?? 'unknown'}</li>
      </ul>

      <h2>Assets and Chains</h2>
      <ul>
        <li>Assets: {merchant.accepted_assets.join(', ') || '—'}</li>
        <li>Chains: {merchant.accepted_chains.join(', ') || '—'}</li>
      </ul>

      <h2>Payment Context</h2>
      <ul>
        <li>Website: {merchant.website ? <a href={merchant.website}>{merchant.website}</a> : '—'}</li>
        <li>Methods: {merchant.payment_methods.join(', ') || '—'}</li>
        <li>Processors: {merchant.payment_processors.join(', ') || '—'}</li>
        <li>Notes: {merchant.payment_notes.join(' | ') || '—'}</li>
      </ul>

      <h2>Evidence</h2>
      <ul>
        {merchant.evidence_refs.length > 0 ? merchant.evidence_refs.map((ref) => (
          <li key={ref}><a href={ref}>{ref}</a></li>
        )) : <li>—</li>}
      </ul>
    </main>
  )
}
