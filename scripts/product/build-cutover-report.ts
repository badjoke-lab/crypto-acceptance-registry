import { readFileSync, writeFileSync } from 'node:fs'
import type { ClassifiedCandidateRecord } from '../export/types'

type ProductStats = {
  totalMerchants: number
  modeBreakdown: Record<string, number>
  confidenceBreakdown: Record<string, number>
  countryBreakdown: Record<string, number>
  processorBreakdown: Record<string, number>
}

const merchantsRaw = readFileSync('data/product-merchants.json', 'utf-8')
const merchants = JSON.parse(merchantsRaw) as ClassifiedCandidateRecord[]

const statsRaw = readFileSync('data/product-stats.json', 'utf-8')
const stats = JSON.parse(statsRaw) as ProductStats

const reviewRaw = readFileSync('data/review-queue.json', 'utf-8')
const reviewQueue = JSON.parse(reviewRaw) as ClassifiedCandidateRecord[]

const report = {
  generatedAt: new Date().toISOString(),
  merchants: {
    total: merchants.length,
    withEvidence: merchants.filter((record) => record.evidence_refs.length > 0).length,
    withWebsite: merchants.filter((record) => Boolean(record.website)).length,
    highConfidence: merchants.filter((record) => record.confidence === 'high').length,
    mediumConfidence: merchants.filter((record) => record.confidence === 'medium').length,
    lowConfidence: merchants.filter((record) => record.confidence === 'low').length,
  },
  stats,
  reviewQueue: {
    total: reviewQueue.length,
  },
}

writeFileSync('data/cutover-report.json', JSON.stringify(report, null, 2), 'utf-8')
console.log(`cutover report built: merchants=${merchants.length} reviewQueue=${reviewQueue.length}`)
