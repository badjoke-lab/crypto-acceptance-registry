import { readFileSync } from 'node:fs'
import type { ClassifiedCandidateRecord } from '../export/types'

const raw = readFileSync('data/product-merchants.json', 'utf-8')
const records = JSON.parse(raw) as ClassifiedCandidateRecord[]

const errors: string[] = []

for (const record of records) {
  if (!record.legacy_id) errors.push('missing legacy_id')
  if (!record.display_name) errors.push(`missing display_name for ${record.legacy_id}`)
  if (!record.proposed_mode) errors.push(`missing proposed_mode for ${record.legacy_id}`)
  if (!record.confidence) errors.push(`missing confidence for ${record.legacy_id}`)
  if (!Array.isArray(record.evidence_refs)) errors.push(`missing evidence_refs array for ${record.legacy_id}`)
  if (!Array.isArray(record.review_reasons)) errors.push(`missing review_reasons array for ${record.legacy_id}`)
}

if (errors.length > 0) {
  console.error('product dataset validation failed')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`product dataset valid: ${records.length} records`)
