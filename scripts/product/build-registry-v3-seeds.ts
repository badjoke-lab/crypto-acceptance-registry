import { readFileSync, writeFileSync } from 'node:fs'
import type { RegistryRecordV2 } from '../export/types-v2-helper'
import type { RegistryRecordV3, AcceptanceScopeV3, EntityTypeV3 } from '../export/types-v3'

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf-8')) as T
}

function inferAcceptanceScope(record: RegistryRecordV2): AcceptanceScopeV3 {
  const text = `${record.explicit_support} ${record.notes.join(' ')}`.toLowerCase()
  if (text.includes('renewal')) return 'renewal_only'
  if (text.includes('online') && text.includes('only')) return 'online_checkout'
  if (text.includes('checkout')) return 'online_checkout'
  if (text.includes('selected products')) return 'selected_products_only'
  return 'unknown'
}

function inferEntityType(record: RegistryRecordV2): EntityTypeV3 {
  if ((record.country || '').toLowerCase() === 'global') return 'online_service'
  if (!record.city && !record.country) return 'online_service'
  if (record.website && !record.city) return 'online_service'
  return 'online_service'
}

function toV3(record: RegistryRecordV2): RegistryRecordV3 {
  return {
    registry_id: record.registry_id,
    scope: record.scope,
    entity_type: inferEntityType(record),
    display_name: record.display_name,
    legal_or_brand_name: null,
    address: {
      address_full: null,
      street: null,
      city: record.city,
      state_or_region: null,
      postal_code: null,
      country: record.country,
    },
    geo: {
      lat: null,
      lng: null,
    },
    website: record.website,
    contact_channels: record.website ? [{ type: 'support_url', value: record.website, label: 'Primary website' }] : [],
    social_profiles: [],
    acceptance_type: record.acceptance_type,
    acceptance_scope: inferAcceptanceScope(record),
    supports_program_or_network: record.supports_program_or_network,
    explicit_support: record.explicit_support,
    support_rails: record.support_rails,
    confidence: record.confidence,
    verification_method: record.verification_method,
    verification_target: 'official merchant or service payment documentation',
    coverage_region: record.country || 'Global/Unknown',
    verified_at: record.verified_at,
    evidence_refs: record.evidence_refs,
    notes: record.notes,
    source_origin: record.source_origin,
  }
}

type Batch = RegistryRecordV2[]

const batch01 = readJson<Batch>('data/registry-v2-seeds.json')
const batch02 = readJson<Batch>('data/registry-v2-seeds-batch-02.json')
const batch03 = readJson<Batch>('data/registry-v2-seeds-batch-03.json')
const batch04 = readJson<Batch>('data/registry-v2-seeds-batch-04.json')

const merged = [...batch01, ...batch02, ...batch03, ...batch04]
const output = merged.map(toV3)

writeFileSync('data/registry-v3-seeds.json', JSON.stringify(output, null, 2), 'utf-8')
console.log(`registry v3 seeds built: ${output.length}`)
