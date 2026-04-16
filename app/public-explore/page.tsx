import Link from 'next/link'

const cards = [
  { href: '/public-countries', title: 'By country', desc: 'Enter the ready baseline through country buckets.' },
  { href: '/public-cities', title: 'By city', desc: 'Enter through city and country buckets.' },
  { href: '/public-assets', title: 'By asset', desc: 'Browse merchants by accepted asset.' },
  { href: '/public-chains', title: 'By chain', desc: 'Browse merchants by accepted chain.' },
  { href: '/public-modes', title: 'By mode', desc: 'Browse merchants by acceptance mode.' },
  { href: '/public-confidence', title: 'By confidence', desc: 'Browse merchants by confidence level.' },
  { href: '/public-proofs', title: 'Proof-ranked', desc: 'See proof-heavy ready merchants first.' },
  { href: '/public-top', title: 'Top', desc: 'Top-ranked ready merchants by visible signals.' },
]

export default function PublicExplorePage() {
  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Explore</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        Structured entrypoints into the ready baseline. Use this page when you want to browse by a specific dimension instead of free-text search.
      </p>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, paddingTop: 18 }}>
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
