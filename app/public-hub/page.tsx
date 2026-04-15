import Link from 'next/link'

const cards = [
  { href: '/public', title: 'Catalog', desc: 'Ready baseline catalog.' },
  { href: '/public-search', title: 'Search', desc: 'Search the ready baseline.' },
  { href: '/public-browse', title: 'Browse', desc: 'Quick browse entrypoints.' },
  { href: '/public-overview', title: 'Overview', desc: 'One-screen summary of ready and pending.' },
  { href: '/public-stats', title: 'Stats', desc: 'Counts for the ready baseline.' },
  { href: '/public-countries', title: 'Countries', desc: 'Browse ready merchants by country.' },
  { href: '/public-cities', title: 'Cities', desc: 'Browse ready merchants by city.' },
  { href: '/public-assets', title: 'Assets', desc: 'Browse ready merchants by asset.' },
  { href: '/public-modes', title: 'Modes', desc: 'Browse ready merchants by acceptance mode.' },
  { href: '/public-confidence', title: 'Confidence', desc: 'Browse ready merchants by confidence level.' },
  { href: '/public-proofs', title: 'Proofs', desc: 'See proof-heavy ready merchants first.' },
  { href: '/public-checks', title: 'Checks', desc: 'Pending review backlog.' },
  { href: '/public-review-gaps', title: 'Review gaps', desc: 'Why records remain outside the public baseline.' },
  { href: '/public-status', title: 'Status', desc: 'Current ready vs pending snapshot.' },
  { href: '/public-cutover', title: 'Cutover', desc: 'Readiness split for public vs pending.' },
  { href: '/public-methodology', title: 'Methodology', desc: 'How the split and classification work.' },
  { href: '/public-faq', title: 'FAQ', desc: 'Short answers about ready vs pending.' },
]

export default function PublicHubPage() {
  return (
    <main style={{ padding: 32, maxWidth: 1180, margin: '0 auto' }}>
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
