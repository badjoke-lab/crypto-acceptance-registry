import reviewQueue from '../data/review-queue.json'
import type { ClassifiedCandidateRecord } from '../scripts/export/types'

const generatedReviewQueue = reviewQueue as ClassifiedCandidateRecord[]

export function getGeneratedReviewQueue(): ClassifiedCandidateRecord[] {
  return generatedReviewQueue
}

export function getGeneratedReviewRecordById(id: string): ClassifiedCandidateRecord | null {
  return generatedReviewQueue.find((record) => record.legacy_id === id) ?? null
}
