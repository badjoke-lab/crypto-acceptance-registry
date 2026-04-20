import { buildPublicArtifacts } from '../scripts/build-public-artifacts-lib'

type ProductStats = {
  totalMerchants: number
  modeBreakdown: Record<string, number>
  confidenceBreakdown: Record<string, number>
  countryBreakdown: Record<string, number>
  processorBreakdown: Record<string, number>
}

export function getGeneratedProductStats(): ProductStats {
  return buildPublicArtifacts().stats
}
