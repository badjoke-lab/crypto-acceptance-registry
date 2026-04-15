import type { ClassifiedCandidateRecord } from '../scripts/export/types'
import { getGeneratedProductMerchants } from './generated-product-data'

function haystack(record: ClassifiedCandidateRecord): string {
  return [
    record.display_name,
    record.country,
    record.city,
    ...record.accepted_assets,
    ...record.accepted_chains,
    ...record.payment_processors,
    ...record.payment_notes,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function searchPublicMerchants(query: string): ClassifiedCandidateRecord[] {
  const q = query.trim().toLowerCase()
  const records = getGeneratedProductMerchants()
  if (!q) return records
  return records.filter((record) => haystack(record).includes(q))
}
