import fs from 'node:fs'
import path from 'node:path'
import type { RegistryRecordV2 } from '../scripts/export/types-v2-helper'
import type { RegistryRecordV3, AcceptanceScopeV3, EntityTypeV3 } from '../scripts/export/types-v3'

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

function parseSeedFilename(name: string): { batch: number; part: number } {
  if (name === 'registry-v2-seeds.json') return { batch: 0, part: 0 }

  const match = name.match(/^registry-v2-seeds-batch-(\d+)(?:-part-(\d+))?\.json$/)
  if (!match) return { batch: Number.MAX_SAFE_INTEGER, part: Number.MAX_SAFE_INTEGER }

  return {
    batch: Number(match[1]),
    part: match[2] ? Number(match[2]) : 0,
  }
}

function sortSeedFilenames(a: string, b: string): number {
  const left = parseSeedFilename(a)
  const right = parseSeedFilename(b)
  return left.batch - right.batch || left.part - right.part || a.localeCompare(b)
}

function loadAllV2Seeds(): RegistryRecordV2[] {
  const dataDir = path.join(process.cwd(), 'data')
  const filenames = fs
    .readdirSync(dataDir)
    .filter(
      (name) =>
        name === 'registry-v2-seeds.json' || /^registry-v2-seeds-batch-\d+(?:-part-\d+)?\.json$/.test(name),
    )
    .sort(sortSeedFilenames)

  return filenames.flatMap((filename) => {
    const raw = fs.readFileSync(path.join(dataDir, filename), 'utf8')
    return JSON.parse(raw) as RegistryRecordV2[]
  })
}

const registryV3Seeds = loadAllV2Seeds().map(toV3)

export function getRegistryV3Seeds(): RegistryRecordV3[] {
  return registryV3Seeds
}

export function getRegistryV3SeedById(id: string): RegistryRecordV3 | null {
  return registryV3Seeds.find((record) => record.registry_id === id) ?? null
}
