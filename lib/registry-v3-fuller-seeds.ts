import socialEnrichmentsBatch01 from '../data/registry-v3-social-enrichments-batch-01.json'
import socialEnrichmentsBatch02 from '../data/registry-v3-social-enrichments-batch-02.json'
import coreEnrichmentsBatch02 from '../data/registry-v3-core-enrichments-batch-02.json'
import coreEnrichmentsBatch03 from '../data/registry-v3-core-enrichments-batch-03.json'
import coreEnrichmentsBatch04 from '../data/registry-v3-core-enrichments-batch-04.json'
import coreEnrichmentsBatch05 from '../data/registry-v3-core-enrichments-batch-05.json'
import coreEnrichmentsBatch06 from '../data/registry-v3-core-enrichments-batch-06.json'
import coreEnrichmentsBatch07 from '../data/registry-v3-core-enrichments-batch-07.json'
import coreEnrichmentsBatch08 from '../data/registry-v3-core-enrichments-batch-08.json'
import coreEnrichmentsBatch09 from '../data/registry-v3-core-enrichments-batch-09.json'
import coreEnrichmentsBatch10 from '../data/registry-v3-core-enrichments-batch-10.json'
import coreEnrichmentsBatch11 from '../data/registry-v3-core-enrichments-batch-11.json'
import coreEnrichmentsBatch12 from '../data/registry-v3-core-enrichments-batch-12.json'
import coreEnrichmentsBatch13 from '../data/registry-v3-core-enrichments-batch-13.json'
import coreEnrichmentsBatch14 from '../data/registry-v3-core-enrichments-batch-14.json'
import coreEnrichmentsBatch15 from '../data/registry-v3-core-enrichments-batch-15.json'
import coreEnrichmentsBatch16 from '../data/registry-v3-core-enrichments-batch-16.json'
import { getRegistryV3FullSeeds } from './registry-v3-full-seeds'

type SocialPatch = {
  registry_id: string
  social_profiles?: Array<{ platform: string; url: string; handle?: string | null }>
  notes_append?: string[]
}

type CorePatch = {
  registry_id: string
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
  acceptance_scope?: string
  verification_target?: string
  coverage_region?: string
  notes_append?: string[]
}

const socialMap = new Map(
  [...(socialEnrichmentsBatch01 as SocialPatch[]), ...(socialEnrichmentsBatch02 as SocialPatch[])].map((item) => [item.registry_id, item]),
)

const coreMap = new Map(
  [...(coreEnrichmentsBatch02 as CorePatch[]), ...(coreEnrichmentsBatch03 as CorePatch[]), ...(coreEnrichmentsBatch04 as CorePatch[]), ...(coreEnrichmentsBatch05 as CorePatch[]), ...(coreEnrichmentsBatch06 as CorePatch[]), ...(coreEnrichmentsBatch07 as CorePatch[]), ...(coreEnrichmentsBatch08 as CorePatch[]), ...(coreEnrichmentsBatch09 as CorePatch[]), ...(coreEnrichmentsBatch10 as CorePatch[]), ...(coreEnrichmentsBatch11 as CorePatch[]), ...(coreEnrichmentsBatch12 as CorePatch[]), ...(coreEnrichmentsBatch13 as CorePatch[]), ...(coreEnrichmentsBatch14 as CorePatch[]), ...(coreEnrichmentsBatch15 as CorePatch[]), ...(coreEnrichmentsBatch16 as CorePatch[])].map((item) => [item.registry_id, item]),
)

export function getRegistryV3FullerSeeds() {
  return getRegistryV3FullSeeds().map((record) => {
    const socialPatch = socialMap.get(record.registry_id)
    const corePatch = coreMap.get(record.registry_id)
    if (!socialPatch && !corePatch) return record

    return {
      ...record,
      address: corePatch?.address ? { ...record.address, ...corePatch.address } : record.address,
      geo: corePatch?.geo ? { ...record.geo, ...corePatch.geo } : record.geo,
      contact_channels: corePatch?.contact_channels ?? record.contact_channels,
      social_profiles: socialPatch?.social_profiles ?? record.social_profiles,
      acceptance_scope: corePatch?.acceptance_scope ?? record.acceptance_scope,
      verification_target: corePatch?.verification_target ?? record.verification_target,
      coverage_region: corePatch?.coverage_region ?? record.coverage_region,
      notes: [...record.notes, ...(socialPatch?.notes_append ?? []), ...(corePatch?.notes_append ?? [])],
    }
  })
}

export function getRegistryV3FullerSeedById(id: string) {
  return getRegistryV3FullerSeeds().find((record) => record.registry_id === id) ?? null
}
