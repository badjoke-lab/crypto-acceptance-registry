import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/generated', label: 'Generated' },
  { href: '/generated-stats', label: 'Stats' },
  { href: '/generated-checks', label: 'Checks' },
  { href: '/cutover', label: 'Cutover' },
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
              maxWidth: 1100,
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
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              Crypto Acceptance Registry
            </Link>

            <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
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
