import { readFileSync, writeFileSync } from 'node:fs'
import type { ClassifiedCandidateRecord } from '../export/types'

const raw = readFileSync('data/classified-candidates-v2.json', 'utf-8')
const records = JSON.parse(raw) as ClassifiedCandidateRecord[]

const reviewQueue = records.filter((record) => {
  if (record.confidence === 'low') return true
  if (record.review_reasons.length > 0) return true
  return false
})

writeFileSync(
  'data/review-queue-v2.json',
  JSON.stringify(reviewQueue, null, 2),
  'utf-8',
)

console.log(`review queue v2 size: ${reviewQueue.length}`)
