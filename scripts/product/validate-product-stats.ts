import { readFileSync } from 'node:fs'

type ProductStats = {
  totalMerchants: number
  modeBreakdown: Record<string, number>
  confidenceBreakdown: Record<string, number>
  countryBreakdown: Record<string, number>
  processorBreakdown: Record<string, number>
}

const raw = readFileSync('data/product-stats.json', 'utf-8')
const stats = JSON.parse(raw) as ProductStats

const errors: string[] = []

if (typeof stats.totalMerchants !== 'number') errors.push('missing totalMerchants')
if (!stats.modeBreakdown || typeof stats.modeBreakdown !== 'object') errors.push('missing modeBreakdown')
if (!stats.confidenceBreakdown || typeof stats.confidenceBreakdown !== 'object') errors.push('missing confidenceBreakdown')
if (!stats.countryBreakdown || typeof stats.countryBreakdown !== 'object') errors.push('missing countryBreakdown')
if (!stats.processorBreakdown || typeof stats.processorBreakdown !== 'object') errors.push('missing processorBreakdown')

if (errors.length > 0) {
  console.error('product stats validation failed')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`product stats valid: total=${stats.totalMerchants}`)
