import Link from 'next/link'

const groups = [
  {
    title: 'Primary exports',
    links: [
      { href: '/api/public-ready', label: 'public-ready JSON' },
      { href: '/api/public-pending', label: 'public-pending JSON' },
      { href: '/api/public-overview', label: 'public-overview JSON' },
      { href: '/api/public-status', label: 'public-status JSON' },
    ],
  },
  {
    title: 'Browse exports',
    links: [
      { href: '/api/public-countries', label: 'countries JSON' },
      { href: '/api/public-cities', label: 'cities JSON' },
      { href: '/api/public-assets', label: 'assets JSON' },
      { href: '/api/public-modes', label: 'modes JSON' },
      { href: '/api/public-confidence', label: 'confidence JSON' },
      { href: '/api/public-proofs', label: 'proofs JSON' },
    ],
  },
  {
    title: 'Review exports',
    links: [
      { href: '/api/public-checks', label: 'checks JSON' },
      { href: '/api/public-review-gaps', label: 'review gaps JSON' },
      { href: '/api/public-cutover', label: 'cutover JSON' },
    ],
  },
]

export default function PublicDownloadsPage() {
  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Downloads</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        Download or inspect JSON exports for the ready baseline, the pending backlog, and the main public browse surfaces.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, paddingTop: 18 }}>
        {groups.map((group) => (
          <section key={group.title} style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
            <h2 style={{ marginTop: 0 }}>{group.title}</h2>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
