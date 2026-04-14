import { readFileSync, writeFileSync } from 'node:fs'
import type { ClassifiedCandidateRecord } from '../export/types'

const raw = readFileSync('data/review-queue.json', 'utf-8')
const records = JSON.parse(raw) as ClassifiedCandidateRecord[]

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

const summary = {
  total: records.length,
  modeBreakdown: countBy(records.map((record) => record.proposed_mode)),
  confidenceBreakdown: countBy(records.map((record) => record.confidence)),
  reviewReasonBreakdown: countBy(records.flatMap((record) => record.review_reasons)),
  topCountries: countBy(records.map((record) => record.country ?? 'Unknown')),
}

writeFileSync('data/review-queue-summary.json', JSON.stringify(summary, null, 2), 'utf-8')
console.log(JSON.stringify(summary, null, 2))
