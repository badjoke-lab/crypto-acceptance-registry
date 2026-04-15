import Link from 'next/link'

const sections = [
  {
    title: 'Main surfaces',
    items: [
      ['/public-hub', 'Public Hub'],
      ['/public', 'Catalog'],
      ['/public-search', 'Search'],
      ['/public-overview', 'Overview'],
      ['/public-stats', 'Stats'],
      ['/public-downloads', 'Downloads'],
    ],
  },
  {
    title: 'Browse surfaces',
    items: [
      ['/public-browse', 'Browse'],
      ['/public-countries', 'Countries'],
      ['/public-cities', 'Cities'],
      ['/public-assets', 'Assets'],
      ['/public-modes', 'Modes'],
      ['/public-confidence', 'Confidence'],
      ['/public-proofs', 'Proofs'],
    ],
  },
  {
    title: 'Review and methodology',
    items: [
      ['/public-checks', 'Checks'],
      ['/public-review-gaps', 'Review Gaps'],
      ['/public-status', 'Status'],
      ['/public-cutover', 'Cutover'],
      ['/public-methodology', 'Methodology'],
      ['/public-faq', 'FAQ'],
    ],
  },
]

export default function PublicDirectoryPage() {
  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Directory</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        Structured index of the public-ready surfaces and the pending-review surfaces.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, paddingTop: 18 }}>
        {sections.map((section) => (
          <section key={section.title} style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
            <h2 style={{ marginTop: 0 }}>{section.title}</h2>
            <ul>
              {section.items.map(([href, label]) => (
                <li key={href}><Link href={href}>{label}</Link></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
