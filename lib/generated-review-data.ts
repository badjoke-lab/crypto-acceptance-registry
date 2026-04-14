import reviewQueue from '../data/review-queue.json'
import type { ClassifiedCandidateRecord } from '../scripts/export/types'

const records = reviewQueue as ClassifiedCandidateRecord[]

export function getGeneratedReviewQueue(): ClassifiedCandidateRecord[] {
  return records
}

export function getGeneratedReviewRecordById(id: string): ClassifiedCandidateRecord | null {
  return records.find((record) => record.legacy_id === id) ?? null
}
