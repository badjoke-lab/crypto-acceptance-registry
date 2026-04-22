import { generatedProductStatsData } from './generated-product-stats-data'

type ProductStats = {
  totalMerchants: number
  modeBreakdown: Record<string, number>
  confidenceBreakdown: Record<string, number>
  countryBreakdown: Record<string, number>
  processorBreakdown: Record<string, number>
}

export function getGeneratedProductStats(): ProductStats {
  return generatedProductStatsData as ProductStats
}
