const placeholderRows = [
  {
    legacy_id: 'legacy:example-merchant-1',
    display_name: 'Example Merchant',
    country: 'Japan',
    city: 'Tokyo',
    proposed_mode: 'direct',
    confidence: 'medium',
  },
]

export default function MerchantsPage() {
  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>Merchants</h1>
      <p>Searchable merchant acceptance records will render here.</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Location</th>
            <th align="left">Mode</th>
            <th align="left">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {placeholderRows.map((row) => (
            <tr key={row.legacy_id}>
              <td>{row.display_name}</td>
              <td>{row.city}, {row.country}</td>
              <td>{row.proposed_mode}</td>
              <td>{row.confidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
