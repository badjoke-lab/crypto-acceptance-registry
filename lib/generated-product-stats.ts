import productStats from '../data/product-stats.json'

type ProductStats = {
  totalMerchants: number
  modeBreakdown: Record<string, number>
  confidenceBreakdown: Record<string, number>
  countryBreakdown: Record<string, number>
  processorBreakdown: Record<string, number>
}

const stats = productStats as ProductStats

export function getGeneratedProductStats(): ProductStats {
  return stats
}
