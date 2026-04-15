export default function PublicMethodologyPage() {
  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>Public Methodology</h1>

      <p>
        The public catalog only shows the ready baseline. Records without usable external
        reference coverage remain outside the public-ready surface until they can be reviewed.
      </p>

      <h2>Current split</h2>
      <ul>
        <li>Public-ready: evidence-backed ready merchants</li>
        <li>Pending: records that still require external reference review</li>
      </ul>

      <h2>Classification</h2>
      <ul>
        <li>direct</li>
        <li>processor</li>
        <li>bridge</li>
        <li>unknown</li>
      </ul>

      <h2>Current rule</h2>
      <p>
        Missing-reference records are not promoted into the public-ready baseline even if they
        carry asset-level acceptance signals.
      </p>
    </main>
  )
}
