import { buildPublicArtifacts } from '../scripts/build-public-artifacts-lib'

type CutoverReport = {
  generatedAt: string
  merchants: {
    total: number
    withEvidence: number
    withWebsite: number
    highConfidence: number
    mediumConfidence: number
    lowConfidence: number
  }
  stats: {
    totalMerchants: number
    modeBreakdown: Record<string, number>
    confidenceBreakdown: Record<string, number>
    countryBreakdown: Record<string, number>
    processorBreakdown: Record<string, number>
  }
  reviewQueue: {
    total: number
  }
}

export function getGeneratedCutoverReport(): CutoverReport {
  return buildPublicArtifacts().cutoverReport
}
