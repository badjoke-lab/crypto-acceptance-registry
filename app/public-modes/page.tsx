import Link from 'next/link'
import { getGeneratedProductStats } from '../../lib/generated-product-stats'

export default function PublicModesPage() {
  const stats = getGeneratedProductStats()
  const modes = Object.entries(stats.modeBreakdown).sort((a, b) => b[1] - a[1])

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Modes</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        Browse the ready baseline by acceptance mode. Each entry links into the public search surface.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, paddingTop: 18 }}>
        {modes.map(([mode, count]) => (
          <Link
            key={mode}
            href={`/public-search?q=${encodeURIComponent(mode)}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #dbeafe',
              borderRadius: 16,
              padding: 18,
              background: '#f8fbff',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>{mode}</div>
            <div style={{ fontSize: 14, color: '#4b5563', marginTop: 6 }}>{count} ready merchants</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
