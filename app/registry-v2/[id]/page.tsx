import Link from 'next/link'
import records from '../../../data/registry-v2-seeds.json'

type RegistryV2DetailPageProps = {
  params: {
    id: string
  }
}

export default function RegistryV2DetailPage({ params }: RegistryV2DetailPageProps) {
  const id = decodeURIComponent(params.id)
  const record = records.find((item) => item.registry_id === id)

  if (!record) {
    return (
      <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
        <h1>Registry V2 record not found</h1>
        <p>No registry-v2 seed matched this id.</p>
        <Link href="/registry-v2">Back to registry v2 seeds</Link>
      </main>
    )
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <p><Link href="/registry-v2">← Back to registry v2 seeds</Link></p>
      <h1>{record.display_name}</h1>
      <p>{[record.city, record.country].filter(Boolean).join(', ') || 'Unknown location'}</p>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, padding: '6px 0 20px' }}>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 14, padding: 16, background: '#f8fbff' }}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Acceptance type</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{record.acceptance_type}</div>
        </div>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 14, padding: 16, background: '#f8fbff' }}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Program / network</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{record.supports_program_or_network || '—'}</div>
        </div>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 14, padding: 16, background: '#f8fbff' }}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Confidence</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{record.confidence}</div>
        </div>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 14, padding: 16, background: '#f8fbff' }}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Verified at</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{record.verified_at}</div>
        </div>
      </section>

      <h2>Explicit support</h2>
      <p>{record.explicit_support}</p>

      <h2>Support rails</h2>
      <ul>
        {record.support_rails.map((rail) => (
          <li key={rail.rail_id}>{rail.rail_type}: {rail.label}</li>
        ))}
      </ul>

      <h2>Evidence</h2>
      <ul>
        {record.evidence_refs.map((evidence) => (
          <li key={evidence.url}>
            <a href={evidence.url}>{evidence.label}</a> — {evidence.kind} — {evidence.publisher}
          </li>
        ))}
      </ul>

      <h2>Notes</h2>
      <ul>
        {record.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </main>
  )
}
