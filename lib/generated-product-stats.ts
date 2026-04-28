import { generatedProductStatsData } from './generated-product-stats-data'

type ProductStats = Record<string, unknown> & {
  totalMerchants: number
}

export function getGeneratedProductStats(): ProductStats {
  return generatedProductStatsData as ProductStats
}
