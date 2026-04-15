import Link from 'next/link'

const cards = [
  {
    href: '/public-hub',
    title: 'Public hub',
    desc: 'Main entry to the ready baseline and the pending review backlog.',
  },
  {
    href: '/public-search',
    title: 'Search',
    desc: 'Search ready merchants by name, place, asset, chain, processor, or note text.',
  },
  {
    href: '/public-browse',
    title: 'Browse',
    desc: 'Fast entrypoints into the ready baseline by country, mode, and processor coverage.',
  },
  {
    href: '/public-proofs',
    title: 'Proofs',
    desc: 'Ready merchants ranked by visible proof signals such as references and website presence.',
  },
  {
    href: '/public-overview',
    title: 'Overview',
    desc: 'One-screen summary of ready baseline, confidence, top countries, and pending reasons.',
  },
  {
    href: '/public-checks',
    title: 'Checks',
    desc: 'Pending records that still need external reference review.',
  },
]

export default function HomePage() {
  return (
    <main style={{ padding: 32, maxWidth: 1180, margin: '0 auto' }}>
      <section style={{ padding: '32px 0 20px' }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#2563eb',
          }}
        >
          Public-ready baseline
        </p>
        <h1
          style={{
            margin: '10px 0 12px',
            fontSize: 40,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
          }}
        >
          Ready merchants are the mainline surface.
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: 760,
            fontSize: 16,
            lineHeight: 1.6,
            color: '#4b5563',
          }}
        >
          The public surface shows the ready baseline only. Records without usable external
          reference coverage stay in the pending backlog until reviewed.
        </p>
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 8,
                color: '#111827',
              }}
            >
              {card.title}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: '#4b5563' }}>
              {card.desc}
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}
