import { NextResponse } from 'next/server'
import { getGeneratedProductMerchants } from '../../../lib/generated-product-data'

function rankScore(record: ReturnType<typeof getGeneratedProductMerchants>[number]): number {
  let score = 0
  score += record.evidence_refs.length * 3
  if (record.website) score += 2
  if (record.payment_processors.length > 0) score += 2
  if (record.confidence === 'high') score += 2
  if (record.confidence === 'medium') score += 1
  return score
}

export function GET() {
  const ranked = [...getGeneratedProductMerchants()]
    .sort((a, b) => rankScore(b) - rankScore(a))
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
      rank_score: rankScore(record),
    }))

  return NextResponse.json({
    total: ranked.length,
    ranked,
  })
}
