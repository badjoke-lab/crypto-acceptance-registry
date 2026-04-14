import { readFileSync, writeFileSync } from 'node:fs'
import type { ClassifiedCandidateRecord } from '../export/types'

const raw = readFileSync('data/product-merchants.json', 'utf-8')
const records = JSON.parse(raw) as ClassifiedCandidateRecord[]

const modeBreakdown = records.reduce<Record<string, number>>((acc, record) => {
  acc[record.proposed_mode] = (acc[record.proposed_mode] ?? 0) + 1
  return acc
}, {})

const confidenceBreakdown = records.reduce<Record<string, number>>((acc, record) => {
  acc[record.confidence] = (acc[record.confidence] ?? 0) + 1
  return acc
}, {})

const countryBreakdown = records.reduce<Record<string, number>>((acc, record) => {
  const key = record.country || 'Unknown'
  acc[key] = (acc[key] ?? 0) + 1
  return acc
}, {})

const processorBreakdown = records.reduce<Record<string, number>>((acc, record) => {
  for (const processor of record.payment_processors) {
    acc[processor] = (acc[processor] ?? 0) + 1
  }
  return acc
}, {})

const stats = {
  totalMerchants: records.length,
  modeBreakdown,
  confidenceBreakdown,
  countryBreakdown,
  processorBreakdown,
}

writeFileSync('data/product-stats.json', JSON.stringify(stats, null, 2), 'utf-8')
console.log(`product stats built for ${records.length} merchants`)
