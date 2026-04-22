import { generatedReviewQueueData } from './generated-review-queue-data'
import type { ClassifiedCandidateRecord } from '../scripts/export/types'

const generatedReviewQueue =
  generatedReviewQueueData as unknown as ClassifiedCandidateRecord[]

export function getGeneratedReviewQueue(): ClassifiedCandidateRecord[] {
  return generatedReviewQueue
}

export function getGeneratedReviewRecordById(id: string): ClassifiedCandidateRecord | null {
  return generatedReviewQueue.find((record) => record.legacy_id === id) ?? null
}
