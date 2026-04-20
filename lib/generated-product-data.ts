import type { ClassifiedCandidateRecord } from '../scripts/export/types'
import { buildPublicArtifacts } from '../scripts/build-public-artifacts-lib'

export function getGeneratedProductMerchants(): ClassifiedCandidateRecord[] {
  return buildPublicArtifacts().ready
}

export function getGeneratedProductMerchantById(id: string): ClassifiedCandidateRecord | null {
  return getGeneratedProductMerchants().find((record) => record.legacy_id === id) ?? null
}
