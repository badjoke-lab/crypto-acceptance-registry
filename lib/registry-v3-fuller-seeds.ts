import socialEnrichmentsBatch01 from '../data/registry-v3-social-enrichments-batch-01.json'
import socialEnrichmentsBatch02 from '../data/registry-v3-social-enrichments-batch-02.json'
import { getRegistryV3FullSeeds } from './registry-v3-full-seeds'

type SocialPatch = {
  registry_id: string
  social_profiles?: Array<{ platform: string; url: string; handle?: string | null }>
  notes_append?: string[]
}

const socialMap = new Map(
  [...(socialEnrichmentsBatch01 as SocialPatch[]), ...(socialEnrichmentsBatch02 as SocialPatch[])].map((item) => [item.registry_id, item]),
)

export function getRegistryV3FullerSeeds() {
  return getRegistryV3FullSeeds().map((record) => {
    const patch = socialMap.get(record.registry_id)
    if (!patch) return record
    return {
      ...record,
      social_profiles: patch.social_profiles ?? record.social_profiles,
      notes: patch.notes_append ? [...record.notes, ...patch.notes_append] : record.notes,
    }
  })
}

export function getRegistryV3FullerSeedById(id: string) {
  return getRegistryV3FullerSeeds().find((record) => record.registry_id === id) ?? null
}
