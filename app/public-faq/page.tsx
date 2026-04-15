export default function PublicFaqPage() {
  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>Public FAQ</h1>

      <h2>Why are some merchants missing from the public catalog?</h2>
      <p>
        The public catalog only shows the ready baseline. Records without usable external reference
        coverage stay in the pending backlog until they can be reviewed.
      </p>

      <h2>What does ready mean?</h2>
      <p>
        Ready means the record is in the current public baseline and passed the current split used by
        the cutover process.
      </p>

      <h2>What does pending mean?</h2>
      <p>
        Pending means the record still needs external reference review and is intentionally kept out of
        the public-ready baseline.
      </p>

      <h2>Does the catalog claim perfect coverage?</h2>
      <p>No. The public baseline is intentionally narrower than the total candidate pool.</p>

      <h2>Where can I inspect the split?</h2>
      <p>Use the public cutover, public status, public checks, and public review gaps surfaces.</p>
    </main>
  )
}
