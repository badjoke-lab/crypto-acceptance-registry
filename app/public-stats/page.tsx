import { getGeneratedProductStats } from '../../lib/generated-product-stats'

function titleize(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^./, (char) => char.toUpperCase())
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function renderValue(value: unknown): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value)
}

function BreakdownList({ value }: { value: Record<string, unknown> }) {
  return (
    <ul>
      {Object.entries(value).map(([key, item]) => (
        <li key={key}>{key}: {renderValue(item)}</li>
      ))}
    </ul>
  )
}

function IssueList({ value }: { value: unknown[] }) {
  return (
    <ol>
      {value.map((item, index) => (
        <li key={index}>
          <code>{renderValue(item)}</code>
        </li>
      ))}
    </ol>
  )
}

export default function PublicStatsPage() {
  const stats = getGeneratedProductStats()
  const entries = Object.entries(stats).filter(([key]) => key !== 'totalMerchants')

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <h1>Public Stats</h1>
      <p>Total merchants: {stats.totalMerchants}</p>
      <p>
        This page intentionally renders raw registry statistics and health-check outputs. It is used to detect malformed
        records, field drift, invalid country/city values, duplicate names, and inconsistent payment fields.
      </p>

      {entries.map(([key, value]) => (
        <section key={key} style={{ marginTop: 28 }}>
          <h2>{titleize(key)}</h2>
          {Array.isArray(value) ? (
            value.length > 0 ? <IssueList value={value} /> : <p>None</p>
          ) : isPlainObject(value) ? (
            <BreakdownList value={value} />
          ) : (
            <p>{renderValue(value)}</p>
          )}
        </section>
      ))}
    </main>
  )
}
