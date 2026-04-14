import { readFileSync, writeFileSync } from 'node:fs'
import type { ClassifiedCandidateRecord } from '../export/types'

const raw = readFileSync('data/classified-candidates.json', 'utf-8')
const records = JSON.parse(raw) as ClassifiedCandidateRecord[]

const reviewQueue = records.filter((record) => {
  if (record.confidence !== 'high') return true
  return record.review_reasons.length > 0
})

writeFileSync(
  'data/review-queue.json',
  JSON.stringify(reviewQueue, null, 2),
  'utf-8',
)

console.log(`review queue size: ${reviewQueue.length}`)
