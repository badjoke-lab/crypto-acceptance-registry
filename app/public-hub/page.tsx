import Link from 'next/link'

const cards = [
  {
    href: '/public',
    title: 'Public catalog',
    desc: 'Ready baseline only. Merchant records intended for public-facing browsing.',
  },
  {
    href: '/public-stats',
    title: 'Public stats',
    desc: 'Aggregates for the ready baseline: mode, confidence, country, and processor counts.',
  },
  {
    href: '/public-checks',
    title: 'Public checks',
    desc: 'Pending records that still need external reference review before promotion.',
  },
  {
    href: '/public-cutover',
    title: 'Public cutover',
    desc: 'Current split between ready baseline and pending backlog.',
  },
  {
    href: '/public-status',
    title: 'Public status',
    desc: 'Snapshot of the current ready baseline and pending review backlog.',
  },
  {
    href: '/public-methodology',
    title: 'Public methodology',
    desc: 'How records are classified and why missing-reference records remain outside the public baseline.',
  },
]

export default function PublicHubPage() {
  return (
    <main style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Hub</h1>
      <p style={{ maxWidth: 760, lineHeight: 1.6, color: '#4b5563' }}>
        Public-ready routes for the current baseline. Use these surfaces when treating ready merchants
        as the main product layer and pending records as review backlog.
      </p>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          paddingTop: 20,
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #dbeafe',
              borderRadius: 18,
              padding: 20,
              background: '#f8fbff',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{card.title}</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: '#4b5563' }}>{card.desc}</div>
          </Link>
        ))}
      </section>
    </main>
  )
}
