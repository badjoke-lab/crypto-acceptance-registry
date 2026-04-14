type MerchantDetailPageProps = {
  params: {
    id: string
  }
}

export default function MerchantDetailPage({ params }: MerchantDetailPageProps) {
  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>Merchant Detail</h1>
      <p>ID: {params.id}</p>
      <ul>
        <li>Acceptance mode</li>
        <li>Confidence</li>
        <li>Assets and chains</li>
        <li>Website and social links</li>
        <li>Evidence references</li>
        <li>Review reasons</li>
      </ul>
    </main>
  )
}
