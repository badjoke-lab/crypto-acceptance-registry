import productMerchants from '../data/product-merchants.json'
import type { ClassifiedCandidateRecord } from '../scripts/export/types'

const generatedProductMerchants = productMerchants as ClassifiedCandidateRecord[]

export function getGeneratedProductMerchants(): ClassifiedCandidateRecord[] {
  return generatedProductMerchants
}

export function getGeneratedProductMerchantById(id: string): ClassifiedCandidateRecord | null {
  return generatedProductMerchants.find((record) => record.legacy_id === id) ?? null
}
