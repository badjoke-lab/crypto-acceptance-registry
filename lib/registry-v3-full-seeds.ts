import enrichments from '../data/registry-v3-enrichments-all.json'
import { getRegistryV3Seeds } from './registry-v3-seeds'

type Enrichment = {
  registry_id: string
  entity_type?: string
  legal_or_brand_name?: string | null
  address?: {
    address_full?: string | null
    street?: string | null
    city?: string | null
    state_or_region?: string | null
    postal_code?: string | null
    country?: string | null
  }
  geo?: {
    lat?: number | null
    lng?: number | null
  }
  contact_channels?: Array<{ type: string; value: string; label?: string | null }>
  social_profiles?: Array<{ platform: string; url: string; handle?: string | null }>
  acceptance_scope?: string
  verification_target?: string
  coverage_region?: string
}

const enrichmentMap = new Map((enrichments as Enrichment[]).map((item) => [item.registry_id, item]))

export function getRegistryV3FullSeeds() {
  const base = getRegistryV3Seeds()
  return base.map((record) => {
    const patch = enrichmentMap.get(record.registry_id)
    if (!patch) return record
    return {
      ...record,
      entity_type: (patch.entity_type as typeof record.entity_type) || record.entity_type,
      legal_or_brand_name: patch.legal_or_brand_name ?? record.legal_or_brand_name,
      address: {
        ...record.address,
        ...(patch.address || {}),
      },
      geo: {
        ...record.geo,
        ...(patch.geo || {}),
      },
      contact_channels: patch.contact_channels ?? record.contact_channels,
      social_profiles: patch.social_profiles ?? record.social_profiles,
      acceptance_scope: (patch.acceptance_scope as typeof record.acceptance_scope) || record.acceptance_scope,
      verification_target: patch.verification_target || record.verification_target,
      coverage_region: patch.coverage_region || record.coverage_region,
    }
  })
}

export function getRegistryV3FullSeedById(id: string) {
  return getRegistryV3FullSeeds().find((record) => record.registry_id === id) ?? null
}
