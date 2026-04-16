import Link from 'next/link'
import { getRegistryV3SeedById } from '../../../lib/registry-v3-seeds'

type RegistryV3DetailPageProps = {
  params: {
    id: string
  }
}

export default function RegistryV3DetailPage({ params }: RegistryV3DetailPageProps) {
  const id = decodeURIComponent(params.id)
  const record = getRegistryV3SeedById(id)

  if (!record) {
    return (
      <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
        <h1>Registry V3 record not found</h1>
        <p>No registry-v3 seed matched this id.</p>
        <Link href="/registry-v3">Back to registry v3 seeds</Link>
      </main>
    )
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <p><Link href="/registry-v3">← Back to registry v3 seeds</Link></p>
      <h1>{record.display_name}</h1>
      <p>{[record.address.city, record.address.country].filter(Boolean).join(', ') || 'Unknown location'}</p>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, padding: '6px 0 20px' }}>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 14, padding: 16, background: '#f8fbff' }}><div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Entity type</div><div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{record.entity_type}</div></div>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 14, padding: 16, background: '#f8fbff' }}><div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Acceptance type</div><div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{record.acceptance_type}</div></div>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 14, padding: 16, background: '#f8fbff' }}><div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Acceptance scope</div><div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{record.acceptance_scope}</div></div>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 14, padding: 16, background: '#f8fbff' }}><div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Verified at</div><div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{record.verified_at}</div></div>
      </section>

      <h2>Address</h2>
      <ul>
        <li>Address full: {record.address.address_full || '—'}</li>
        <li>Street: {record.address.street || '—'}</li>
        <li>City: {record.address.city || '—'}</li>
        <li>State/Region: {record.address.state_or_region || '—'}</li>
        <li>Postal code: {record.address.postal_code || '—'}</li>
        <li>Country: {record.address.country || '—'}</li>
      </ul>

      <h2>Geo</h2>
      <ul>
        <li>Latitude: {record.geo.lat ?? '—'}</li>
        <li>Longitude: {record.geo.lng ?? '—'}</li>
      </ul>

      <h2>Contacts</h2>
      <ul>
        {record.contact_channels.length > 0 ? record.contact_channels.map((channel) => (
          <li key={`${channel.type}:${channel.value}`}>{channel.type}: {channel.value}</li>
        )) : <li>—</li>}
      </ul>

      <h2>Support rails</h2>
      <ul>
        {record.support_rails.map((rail) => (
          <li key={rail.rail_id}>{rail.rail_type}: {rail.label}</li>
        ))}
      </ul>

      <h2>Evidence</h2>
      <ul>
        {record.evidence_refs.map((evidence) => (
          <li key={evidence.url}><a href={evidence.url}>{evidence.label}</a> — {evidence.kind} — {evidence.publisher}</li>
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
