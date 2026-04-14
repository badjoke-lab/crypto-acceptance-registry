import { readFileSync, writeFileSync } from 'node:fs'
import type { ClassifiedCandidateRecord } from '../export/types'

const raw = readFileSync('data/classified-candidates.json', 'utf-8')
const records = JSON.parse(raw) as ClassifiedCandidateRecord[]

const productRecords = records.map((record) => ({
  legacy_id: record.legacy_id,
  display_name: record.display_name,
  country: record.country,
  city: record.city,
  website: record.website,
  verification_status: record.verification_status,
  accepted_assets: record.accepted_assets,
  accepted_chains: record.accepted_chains,
  payment_methods: record.payment_methods,
  payment_processors: record.payment_processors,
  payment_notes: record.payment_notes,
  social_links: record.social_links,
  proposed_mode: record.proposed_mode,
  confidence: record.confidence,
  review_reasons: record.review_reasons,
  evidence_refs: record.evidence_refs,
}))

writeFileSync(
  'data/product-merchants.json',
  JSON.stringify(productRecords, null, 2),
  'utf-8',
)

console.log(`product merchants: ${productRecords.length}`)
