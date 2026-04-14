export type AcceptanceMode = 'direct' | 'processor' | 'bridge' | 'unknown'
export type ConfidenceLevel = 'high' | 'medium' | 'low'

export type LegacyPaymentAccept = {
  asset: string | null
  chain: string | null
  method: string | null
  processor: string | null
  note: string | null
}

export type LegacySocialLink = {
  platform: string
  url: string | null
  handle: string | null
}

export type LegacyVerification = {
  status: string | null
  last_checked: string | null
  last_verified: string | null
}

export type LegacyPlaceRecord = {
  legacy_id: string
  name: string
  country: string | null
  city: string | null
  website: string | null
  verification_status: string | null
  accepted_assets: string[]
  accepted_chains: string[]
  payment_accepts: LegacyPaymentAccept[]
  socials: LegacySocialLink[]
  notes: string[]
}

export type NormalizedCandidateRecord = {
  legacy_id: string
  display_name: string
  country: string | null
  city: string | null
  website: string | null
  verification_status: string | null
  accepted_assets: string[]
  accepted_chains: string[]
  payment_methods: string[]
  payment_processors: string[]
  payment_notes: string[]
  social_links: LegacySocialLink[]
}

export type ClassifiedCandidateRecord = NormalizedCandidateRecord & {
  proposed_mode: AcceptanceMode
  confidence: ConfidenceLevel
  review_reasons: string[]
  evidence_refs: string[]
}
