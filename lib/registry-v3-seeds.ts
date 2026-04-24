import fs from 'node:fs'
import path from 'node:path'
import type { RegistryRecordV2 } from '../scripts/export/types-v2-helper'
import type { RegistryRecordV3, AcceptanceScopeV3, EntityTypeV3 } from '../scripts/export/types-v3'

type CompactBitrefillSeedBatch = {
  format: 'compact-bitrefill-v2-seed-batch-v1'
  verified_at: string
  sources: Record<string, { label: string; url: string }>
  entries: Array<{ id: string; name: string; source: string }>
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
    acceptance_type: record.acceptance_type === 'unknown' ? 'unknown' : (record.acceptance_type as RegistryRecordV3['acceptance_type']),
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

function isCompactBitrefillSeedBatch(value: unknown): value is CompactBitrefillSeedBatch {
  return Boolean(
    value &&
      typeof value === 'object' &&
      (value as { format?: unknown }).format === 'compact-bitrefill-v2-seed-batch-v1',
  )
}

function expandCompactBitrefillSeedBatch(batch: CompactBitrefillSeedBatch): RegistryRecordV2[] {
  return batch.entries.map((entry) => {
    const source = batch.sources[entry.source]
    if (!source) throw new Error(`Unknown compact Bitrefill seed source: ${entry.source}`)

    return {
      registry_id: entry.id,
      scope: 'merchant',
      display_name: entry.name,
      country: null,
      city: null,
      website: null,
      acceptance_type: 'processor_checkout',
      supports_program_or_network: 'Bitrefill',
      explicit_support: `Bitrefill lists ${entry.name} on its official retail gift card page.`,
      support_rails: [
        {
          rail_id: 'processor:bitrefill',
          rail_type: 'processor',
          label: 'Bitrefill',
        },
      ],
      confidence: 'high',
      verification_method: 'manual_official_source_review',
      verified_at: batch.verified_at,
      evidence_refs: [
        {
          label: source.label,
          url: source.url,
          kind: 'official_store_locator',
          publisher: 'Bitrefill',
        },
      ],
      notes: [],
      source_origin: 'official_seed',
    }
  })
}

function sortSeedFilenames(a: string, b: string): number {
  const score = (name: string) => {
    if (name === 'registry-v2-seeds.json') return 0
    const match = name.match(/batch-(\d+)\.json$/)
    return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
  }
  return score(a) - score(b) || a.localeCompare(b)
}

function loadSeedFile(filepath: string): RegistryRecordV2[] {
  const parsed = JSON.parse(fs.readFileSync(filepath, 'utf8')) as unknown
  if (Array.isArray(parsed)) return parsed as RegistryRecordV2[]
  if (isCompactBitrefillSeedBatch(parsed)) return expandCompactBitrefillSeedBatch(parsed)
  throw new Error(`Unsupported registry seed file format: ${filepath}`)
}

function loadAllV2Seeds(): RegistryRecordV2[] {
  const dataDir = path.join(process.cwd(), 'data')
  const filenames = fs
    .readdirSync(dataDir)
    .filter((name) => name === 'registry-v2-seeds.json' || /^registry-v2-seeds-batch-\d+\.json$/.test(name))
    .sort(sortSeedFilenames)

  return filenames.flatMap((filename) => loadSeedFile(path.join(dataDir, filename)))
}

const registryV3Seeds = loadAllV2Seeds().map(toV3)

export function getRegistryV3Seeds(): RegistryRecordV3[] {
  return registryV3Seeds
}

export function getRegistryV3SeedById(id: string): RegistryRecordV3 | null {
  return registryV3Seeds.find((record) => record.registry_id === id) ?? null
}
