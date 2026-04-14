import { readFileSync, writeFileSync } from 'node:fs'
import type { ClassifiedCandidateRecord } from '../export/types'

function buildStats(records: ClassifiedCandidateRecord[]) {
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

  return {
    totalMerchants: records.length,
    modeBreakdown,
    confidenceBreakdown,
    countryBreakdown,
  }
}

const readyRaw = readFileSync('data/ready-merchants.json', 'utf-8')
const ready = JSON.parse(readyRaw) as ClassifiedCandidateRecord[]

const pendingRaw = readFileSync('data/pending-merchants.json', 'utf-8')
const pending = JSON.parse(pendingRaw) as ClassifiedCandidateRecord[]

writeFileSync('data/ready-stats.json', JSON.stringify(buildStats(ready), null, 2), 'utf-8')
writeFileSync('data/pending-stats.json', JSON.stringify(buildStats(pending), null, 2), 'utf-8')

console.log(`ready stats built: ${ready.length}`)
console.log(`pending stats built: ${pending.length}`)
