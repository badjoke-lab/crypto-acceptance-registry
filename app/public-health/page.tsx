import { getGeneratedCutoverReport } from '../../lib/generated-cutover-report'

function pct(part: number, whole: number): string {
  if (!whole) return '0.0%'
  return `${((part / whole) * 100).toFixed(1)}%`
}

export default function PublicHealthPage() {
  const report = getGeneratedCutoverReport()
  const ready = report.merchants.total
  const pending = report.reviewQueue.total
  const total = ready + pending

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Public Health</h1>
      <p style={{ maxWidth: 760, color: '#4b5563', lineHeight: 1.6 }}>
        Health-style summary of the current ready baseline and the pending backlog.
      </p>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, paddingTop: 18 }}>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ready share</div>
          <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>{pct(ready, total)}</div>
          <div style={{ fontSize: 14, color: '#4b5563' }}>{ready} / {total}</div>
        </div>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pending share</div>
          <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>{pct(pending, total)}</div>
          <div style={{ fontSize: 14, color: '#4b5563' }}>{pending} / {total}</div>
        </div>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>With evidence</div>
          <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>{pct(report.merchants.withEvidence, ready)}</div>
          <div style={{ fontSize: 14, color: '#4b5563' }}>{report.merchants.withEvidence} / {ready}</div>
        </div>
        <div style={{ border: '1px solid #dbeafe', borderRadius: 16, padding: 18, background: '#f8fbff' }}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>With website</div>
          <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>{pct(report.merchants.withWebsite, ready)}</div>
          <div style={{ fontSize: 14, color: '#4b5563' }}>{report.merchants.withWebsite} / {ready}</div>
        </div>
      </section>
    </main>
  )
}
