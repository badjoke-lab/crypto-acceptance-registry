import Link from 'next/link'
import records from '../../data/registry-v2-seeds.json'

export default function RegistryV2Page() {
  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Registry V2 Seeds</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        Official-source seed records using the richer registry-v2 schema. This surface is separate from the legacy CPM/OSM-style candidate layer.
      </p>

      <div style={{ display: 'grid', gap: 14, paddingTop: 18 }}>
        {records.map((record) => (
          <article key={record.registry_id} style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  <Link href={`/registry-v2/${encodeURIComponent(record.registry_id)}`}>{record.display_name}</Link>
                </div>
                <div style={{ fontSize: 14, color: '#4b5563' }}>{[record.city, record.country].filter(Boolean).join(', ') || 'Unknown location'}</div>
              </div>
              <div style={{ fontSize: 13, color: '#374151' }}>{record.acceptance_type} · {record.confidence}</div>
            </div>
            <div style={{ fontSize: 14, color: '#1f2937', marginTop: 10 }}>{record.explicit_support}</div>
            <div style={{ fontSize: 13, color: '#4b5563', marginTop: 8 }}>
              {record.supports_program_or_network ? `program/network: ${record.supports_program_or_network}` : 'program/network: —'}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
