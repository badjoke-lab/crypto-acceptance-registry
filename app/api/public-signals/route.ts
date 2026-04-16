import { NextResponse } from 'next/server'
import { getGeneratedProductMerchants } from '../../../lib/generated-product-data'

export function GET() {
  const records = getGeneratedProductMerchants()
  const summary = {
    total: records.length,
    withEvidence: records.filter((record) => record.evidence_refs.length > 0).length,
    withWebsite: records.filter((record) => Boolean(record.website)).length,
    withProcessors: records.filter((record) => record.payment_processors.length > 0).length,
    withAssets: records.filter((record) => record.accepted_assets.length > 0).length,
    withChains: records.filter((record) => record.accepted_chains.length > 0).length,
    withSocialLinks: records.filter((record) => record.social_links.length > 0).length,
    highConfidence: records.filter((record) => record.confidence === 'high').length,
    mediumConfidence: records.filter((record) => record.confidence === 'medium').length,
    lowConfidence: records.filter((record) => record.confidence === 'low').length,
  }

  return NextResponse.json(summary)
}
