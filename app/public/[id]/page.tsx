import Link from 'next/link'
import { getGeneratedProductMerchantById } from '../../../lib/generated-product-data'

type PublicDetailPageProps = {
  params: {
    id: string
  }
}

export default function PublicDetailPage({ params }: PublicDetailPageProps) {
  const merchant = getGeneratedProductMerchantById(params.id)

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
