import productMerchants from '../data/example-classified-candidates.json'
import type { ClassifiedCandidateRecord } from '../scripts/export/types'

const records = productMerchants as ClassifiedCandidateRecord[]

export function getAllProductMerchants(): ClassifiedCandidateRecord[] {
  return records
}

export function getProductMerchantById(id: string): ClassifiedCandidateRecord | null {
  return records.find((record) => record.legacy_id === id) ?? null
}
