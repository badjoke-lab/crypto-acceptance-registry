export type EntityTypeV3 = 'physical_merchant' | 'online_service' | 'payment_program'

export type AcceptanceTypeV3 =
  | 'direct_crypto'
  | 'crypto_card'
  | 'digital_cash'
  | 'processor_checkout'
  | 'mixed'
  | 'unknown'

export type AcceptanceScopeV3 =
  | 'in_store'
  | 'online_checkout'
  | 'renewal_only'
  | 'selected_products_only'
  | 'mixed'
  | 'unknown'

export type ConfidenceLevelV3 = 'high' | 'medium' | 'low'

export type EvidenceKindV3 =
  | 'official_payment_page'
  | 'official_help_center'
  | 'official_blog'
  | 'official_press_release'
  | 'official_checkout'
  | 'official_store_locator'
  | 'official_terms'
  | 'owner_submission'
  | 'community_submission'
  | 'receipt_or_terminal_photo'
  | 'other'

export type VerificationMethodV3 =
  | 'manual_official_source_review'
  | 'owner_attestation_with_evidence'
  | 'community_evidence_review'
  | 'unknown'

export type RegistryScopeV3 = 'merchant' | 'program' | 'network'

export type ContactChannelV3 = {
  type: 'email' | 'phone' | 'support_url' | 'contact_form' | 'other'
  value: string
  label?: string | null
}

export type SocialProfileV3 = {
  platform: string
  url: string
  handle?: string | null
}

export type AddressV3 = {
  address_full: string | null
  street: string | null
  city: string | null
  state_or_region: string | null
  postal_code: string | null
  country: string | null
}

export type GeoPointV3 = {
  lat: number | null
  lng: number | null
}

export type SupportRailV3 = {
  rail_id: string
  rail_type: 'asset' | 'chain' | 'card_program' | 'digital_cash_program' | 'processor'
  label: string
}

export type EvidenceRefV3 = {
  label: string
  url: string
  kind: EvidenceKindV3
  publisher: string
}

export type RegistryRecordV3 = {
  registry_id: string
  scope: RegistryScopeV3
  entity_type: EntityTypeV3
  display_name: string
  legal_or_brand_name: string | null
  address: AddressV3
  geo: GeoPointV3
  website: string | null
  contact_channels: ContactChannelV3[]
  social_profiles: SocialProfileV3[]
  acceptance_type: AcceptanceTypeV3
  acceptance_scope: AcceptanceScopeV3
  supports_program_or_network: string | null
  explicit_support: string
  support_rails: SupportRailV3[]
  confidence: ConfidenceLevelV3
  verification_method: VerificationMethodV3
  verification_target: string
  coverage_region: string
  verified_at: string
  evidence_refs: EvidenceRefV3[]
  notes: string[]
  source_origin: 'official_seed' | 'owner_submission' | 'community_submission' | 'legacy_candidate'
}
