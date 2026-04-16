import Link from 'next/link'
import { getRegistryV3Seeds } from '../../lib/registry-v3-seeds'

export default function RegistryV3Page() {
  const records = getRegistryV3Seeds()

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Registry V3 Seeds</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        Runtime-generated registry-v3 records with address, geo, contact, acceptance scope, and structured evidence fields.
      </p>

      <div style={{ display: 'grid', gap: 14, paddingTop: 18 }}>
        {records.map((record) => (
          <article key={record.registry_id} style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  <Link href={`/registry-v3/${encodeURIComponent(record.registry_id)}`}>{record.display_name}</Link>
                </div>
                <div style={{ fontSize: 14, color: '#4b5563' }}>{[record.address.city, record.address.country].filter(Boolean).join(', ') || 'Unknown location'}</div>
              </div>
              <div style={{ fontSize: 13, color: '#374151' }}>{record.acceptance_type} · {record.acceptance_scope} · {record.confidence}</div>
            </div>
            <div style={{ fontSize: 14, color: '#1f2937', marginTop: 10 }}>{record.explicit_support}</div>
          </article>
        ))}
      </div>
    </main>
  )
}
