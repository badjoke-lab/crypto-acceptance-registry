import { generatedProductMerchantsData } from './generated-product-merchants-data'
import type { ClassifiedCandidateRecord } from '../scripts/export/types'

const generatedProductMerchants =
  generatedProductMerchantsData as unknown as ClassifiedCandidateRecord[]

export function getGeneratedProductMerchants(): ClassifiedCandidateRecord[] {
  return generatedProductMerchants
}

export function getGeneratedProductMerchantById(id: string): ClassifiedCandidateRecord | null {
  return generatedProductMerchants.find((record) => record.legacy_id === id) ?? null
}
