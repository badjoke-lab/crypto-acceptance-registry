export type AcceptanceTypeV2 =
  | 'direct_crypto'
  | 'crypto_card'
  | 'digital_cash'
  | 'processor_checkout'
  | 'unknown'

export type ConfidenceLevelV2 = 'high' | 'medium' | 'low'

export type EvidenceKindV2 =
  | 'official_payment_page'
  | 'official_help_center'
  | 'official_blog'
  | 'official_press_release'
  | 'official_checkout'
  | 'official_store_locator'
  | 'owner_submission'
  | 'community_submission'
  | 'receipt_or_terminal_photo'
  | 'other'

export type VerificationMethodV2 =
  | 'manual_official_source_review'
  | 'owner_attestation_with_evidence'
  | 'community_evidence_review'
  | 'unknown'

export type RegistryScopeV2 = 'merchant' | 'program' | 'network'

export type SupportRailV2 = {
  rail_id: string
  rail_type: 'asset' | 'chain' | 'card_program' | 'digital_cash_program' | 'processor'
  label: string
}

export type EvidenceRefV2 = {
  label: string
  url: string
  kind: EvidenceKindV2
  publisher: string
}

export type RegistryRecordV2 = {
  registry_id: string
  scope: RegistryScopeV2
  display_name: string
  country: string | null
  city: string | null
  website: string | null
  acceptance_type: AcceptanceTypeV2
  supports_program_or_network: string | null
  explicit_support: string
  support_rails: SupportRailV2[]
  confidence: ConfidenceLevelV2
  verification_method: VerificationMethodV2
  verified_at: string
  evidence_refs: EvidenceRefV2[]
  notes: string[]
  source_origin: 'official_seed' | 'owner_submission' | 'community_submission' | 'legacy_candidate'
}
