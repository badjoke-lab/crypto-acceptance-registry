import type { ClassifiedCandidateRecord } from '../scripts/export/types'
import { buildPublicArtifacts } from '../scripts/build-public-artifacts-lib'

export function getGeneratedReviewQueue(): ClassifiedCandidateRecord[] {
  return buildPublicArtifacts().pending
}

export function getGeneratedReviewRecordById(id: string): ClassifiedCandidateRecord | null {
  return getGeneratedReviewQueue().find((record) => record.legacy_id === id) ?? null
}
