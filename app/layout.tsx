import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/public-hub', label: 'Hub' },
  { href: '/public-search', label: 'Search' },
  { href: '/public-browse', label: 'Browse' },
  { href: '/public-countries', label: 'Countries' },
  { href: '/public-cities', label: 'Cities' },
  { href: '/public-assets', label: 'Assets' },
  { href: '/public-modes', label: 'Modes' },
  { href: '/public-confidence', label: 'Confidence' },
  { href: '/public-proofs', label: 'Proofs' },
  { href: '/public-overview', label: 'Overview' },
  { href: '/public-stats', label: 'Stats' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: '#ffffff',
          color: '#111827',
        }}
      >
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              maxWidth: 1180,
              margin: '0 auto',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
            }}
          >
            <Link
              href="/"
              style={{
                textDecoration: 'none',
                color: '#111827',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              Crypto Acceptance Registry
            </Link>

            <nav style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    textDecoration: 'none',
                    color: '#2563eb',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  )
}
