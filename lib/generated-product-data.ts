import productMerchants from '../data/product-merchants.json'
import type { ClassifiedCandidateRecord } from '../scripts/export/types'

const records = productMerchants as ClassifiedCandidateRecord[]

export function getGeneratedProductMerchants(): ClassifiedCandidateRecord[] {
  return records
}

export function getGeneratedProductMerchantById(id: string): ClassifiedCandidateRecord | null {
  return records.find((record) => record.legacy_id === id) ?? null
}
