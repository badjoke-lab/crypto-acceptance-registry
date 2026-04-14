import exampleCandidates from '../data/example-classified-candidates.json'
import type { ClassifiedCandidateRecord } from '../scripts/export/types'

const records = exampleCandidates as ClassifiedCandidateRecord[]

export function getAllMerchantRecords(): ClassifiedCandidateRecord[] {
  return records
}

export function getMerchantRecordById(id: string): ClassifiedCandidateRecord | null {
  return records.find((record) => record.legacy_id === id) ?? null
}
