import { readFileSync, writeFileSync } from 'node:fs'
import type { ClassifiedCandidateRecord } from '../export/types'

const raw = readFileSync('data/classified-candidates.json', 'utf-8')
const records = JSON.parse(raw) as ClassifiedCandidateRecord[]

function countBy<T extends string>(values: T[]): Record<string, number> {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

const modeBreakdown = countBy(records.map((record) => record.proposed_mode))
const confidenceBreakdown = countBy(records.map((record) => record.confidence))
const reviewReasonBreakdown = countBy(records.flatMap((record) => record.review_reasons))
const verificationBreakdown = countBy(records.map((record) => record.verification_status ?? 'null'))

const noWebsite = records.filter((record) => !record.website).length
const noEvidence = records.filter((record) => record.evidence_refs.length === 0).length
const withProcessor = records.filter((record) => record.payment_processors.length > 0).length
const withAssets = records.filter((record) => record.accepted_assets.length > 0 || record.accepted_chains.length > 0).length

const summary = {
  total: records.length,
  modeBreakdown,
  confidenceBreakdown,
  reviewReasonBreakdown,
  verificationBreakdown,
  noWebsite,
  noEvidence,
  withProcessor,
  withAssets,
}

writeFileSync('data/classification-summary.json', JSON.stringify(summary, null, 2), 'utf-8')
console.log(JSON.stringify(summary, null, 2))
