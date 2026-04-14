import records from '../../data/example-classified-candidates.json'

const pendingChecks = (records as Array<{
  legacy_id: string
  display_name: string
  proposed_mode: string
  confidence: string
  review_reasons: string[]
}>).filter((record) => record.confidence !== 'high' || record.review_reasons.length > 0)

export default function ChecksPage() {
  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>Checks</h1>
      <p>Records that need confirmation or correction.</p>
      <ul>
        {pendingChecks.map((record) => (
          <li key={record.legacy_id}>
            <strong>{record.display_name}</strong> — {record.proposed_mode} / {record.confidence}
          </li>
        ))}
      </ul>
    </main>
  )
}
