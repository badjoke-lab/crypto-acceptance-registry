import Link from 'next/link'
import { getGeneratedReviewQueue } from '../../lib/generated-review-data'

export default function GeneratedChecksPage() {
  const checks = getGeneratedReviewQueue()

  return (
    <main style={{ padding: 24, maxWidth: 1040, margin: '0 auto' }}>
      <h1>Generated Checks</h1>
      <p>Generated review queue backed by review-queue.json.</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Mode</th>
            <th align="left">Confidence</th>
            <th align="left">Review Reasons</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((record) => (
            <tr key={record.legacy_id}>
              <td>
                <Link href={`/generated/${encodeURIComponent(record.legacy_id)}`}>
                  {record.display_name}
                </Link>
              </td>
              <td>{record.proposed_mode}</td>
              <td>{record.confidence}</td>
              <td>{record.review_reasons.join(', ') || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
