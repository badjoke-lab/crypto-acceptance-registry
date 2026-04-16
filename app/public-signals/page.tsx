import { getGeneratedProductMerchants } from '../../lib/generated-product-data'

function pct(part: number, whole: number): string {
  if (!whole) return '0.0%'
  return `${((part / whole) * 100).toFixed(1)}%`
}

export default function PublicSignalsPage() {
  const records = getGeneratedProductMerchants()
  const total = records.length
  const cards = [
    { label: 'With evidence', value: records.filter((record) => record.evidence_refs.length > 0).length },
    { label: 'With website', value: records.filter((record) => Boolean(record.website)).length },
    { label: 'With processors', value: records.filter((record) => record.payment_processors.length > 0).length },
    { label: 'With assets', value: records.filter((record) => record.accepted_assets.length > 0).length },
    { label: 'With chains', value: records.filter((record) => record.accepted_chains.length > 0).length },
    { label: 'With social links', value: records.filter((record) => record.social_links.length > 0).length },
    { label: 'High confidence', value: records.filter((record) => record.confidence === 'high').length },
    { label: 'Medium confidence', value: records.filter((record) => record.confidence === 'medium').length },
  ]

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Signals</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        Visible signal coverage across the current public-ready baseline.
      </p>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, paddingTop: 18 }}>
        {cards.map((card) => (
          <div key={card.label} style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
            <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{card.label}</div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>{card.value}</div>
            <div style={{ fontSize: 14, color: '#4b5563' }}>{pct(card.value, total)} of ready baseline</div>
          </div>
        ))}
      </section>
    </main>
  )
}
