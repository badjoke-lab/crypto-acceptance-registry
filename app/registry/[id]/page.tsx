import Link from 'next/link'
import { getMerchantRecordById } from '../../../lib/merchant-data'

type RegistryDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function RegistryDetailPage({ params }: RegistryDetailPageProps) {
  const { id } = await params
  const merchant = getMerchantRecordById(id)

  if (!merchant) {
    return (
      <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
        <h1>Merchant not found</h1>
        <p>No merchant record matched this id.</p>
        <Link href="/registry">Back to registry</Link>
      </main>
    )
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <p><Link href="/registry">← Back to registry</Link></p>
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

      <h2>Review Reasons</h2>
      <ul>
        {merchant.review_reasons.length > 0 ? merchant.review_reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        )) : <li>None</li>}
      </ul>
    </main>
  )
}
