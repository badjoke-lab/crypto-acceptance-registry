import { NextResponse } from 'next/server'
import { getGeneratedProductMerchants } from '../../../lib/generated-product-data'

function score(record: ReturnType<typeof getGeneratedProductMerchants>[number]): number {
  let value = 0
  value += record.evidence_refs.length * 3
  if (record.website) value += 2
  if (record.payment_processors.length > 0) value += 2
  if (record.confidence === 'high') value += 2
  if (record.confidence === 'medium') value += 1
  return value
}

export function GET() {
  const proofs = [...getGeneratedProductMerchants()]
    .sort((a, b) => score(b) - score(a))
    .slice(0, 200)
    .map((record) => ({
      legacy_id: record.legacy_id,
      display_name: record.display_name,
      country: record.country,
      city: record.city,
      proposed_mode: record.proposed_mode,
      confidence: record.confidence,
      evidence_count: record.evidence_refs.length,
      website: record.website,
      processors: record.payment_processors,
      proof_score: score(record),
    }))

  return NextResponse.json({ total: proofs.length, proofs })
}
