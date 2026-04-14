import { readFileSync, writeFileSync } from 'node:fs'
import type { ClassifiedCandidateRecord } from '../export/types'

const raw = readFileSync('data/review-queue.json', 'utf-8')
const records = JSON.parse(raw) as ClassifiedCandidateRecord[]

const samples = records
  .filter((record) => record.review_reasons.includes('missing_reference'))
  .slice(0, 50)
  .map((record) => ({
    legacy_id: record.legacy_id,
    display_name: record.display_name,
    country: record.country,
    city: record.city,
    verification_status: record.verification_status,
    accepted_assets: record.accepted_assets,
    payment_notes_preview: record.payment_notes.slice(0, 5),
    social_links: record.social_links,
    evidence_refs: record.evidence_refs,
  }))

writeFileSync('data/missing-reference-samples.json', JSON.stringify(samples, null, 2), 'utf-8')
console.log(JSON.stringify(samples, null, 2))
