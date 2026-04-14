import Link from 'next/link'

const cards = [
  {
    href: '/generated',
    title: 'Generated catalog',
    desc: 'Public-ready merchant records backed by the ready dataset.',
  },
  {
    href: '/generated-stats',
    title: 'Generated stats',
    desc: 'Mode, confidence, country, and processor breakdowns for the ready baseline.',
  },
  {
    href: '/generated-checks',
    title: 'Generated checks',
    desc: 'Pending records that still need external reference review.',
  },
  {
    href: '/cutover',
    title: 'Cutover report',
    desc: 'Current readiness snapshot for public vs pending records.',
  },
]

export default function HomePage() {
  return (
    <main style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }}>
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
          Public baseline
        </p>
        <h1
          style={{
            margin: '10px 0 12px',
            fontSize: 40,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
          }}
        >
          Ready merchants are now the mainline surface.
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
          Use the generated routes as the primary product surface. Pending records remain
          separate until they gain reference-backed evidence.
        </p>
      </section>

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
