import { getAllMerchantRecords } from './merchant-data'

export function getModeBreakdown(): Record<string, number> {
  const records = getAllMerchantRecords()
  return records.reduce<Record<string, number>>((acc, record) => {
    acc[record.proposed_mode] = (acc[record.proposed_mode] ?? 0) + 1
    return acc
  }, {})
}

export function getConfidenceBreakdown(): Record<string, number> {
  const records = getAllMerchantRecords()
  return records.reduce<Record<string, number>>((acc, record) => {
    acc[record.confidence] = (acc[record.confidence] ?? 0) + 1
    return acc
  }, {})
}
