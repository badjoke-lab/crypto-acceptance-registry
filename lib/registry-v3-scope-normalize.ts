import type { AcceptanceScopeV3, RegistryRecordV3, SupportRailV3 } from '../scripts/export/types-v3'

const CATALOG_PROGRAMS = ['bitrefill', 'coincards', 'egifter', 'coinsbee', 'cryptorefills', 'dundle']

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function isCatalogLikeRecord(record: RegistryRecordV3): boolean {
  const text = [
    record.registry_id,
    record.supports_program_or_network ?? '',
    record.explicit_support,
    ...record.evidence_refs.map((ref) => `${ref.publisher} ${ref.label} ${ref.url}`),
  ]
    .join(' ')
    .toLowerCase()

  return CATALOG_PROGRAMS.some((program) => text.includes(program))
}

function inferScope(record: RegistryRecordV3): AcceptanceScopeV3 {
  if (record.acceptance_scope !== 'unknown') return record.acceptance_scope
  if (isCatalogLikeRecord(record)) return 'selected_products_only'
  if (record.acceptance_type === 'processor_checkout') return 'online_checkout'
  if (record.acceptance_type === 'crypto_card' || record.acceptance_type === 'digital_cash') return 'selected_products_only'
  if (record.acceptance_type === 'direct_crypto' && record.entity_type === 'online_service') return 'online_checkout'
  return record.acceptance_scope
}

function looksLikeAddressFragment(value: string | null | undefined): boolean {
  if (!value) return false
  return /\d{3,}|\bRua\b|\bAvenida\b|\bStreet\b|\bRoad\b|\bR\.\b|\bBrasil\b|\bSala\b|\bOff\b/i.test(value)
}

function normalizeAddress(record: RegistryRecordV3): RegistryRecordV3 {
  if (!looksLikeAddressFragment(record.address.city)) return record

  return {
    ...record,
    address: {
      ...record.address,
      address_full: record.address.address_full ?? record.address.city,
      city: null,
    },
    notes: [...record.notes, `Moved city value to address_full because it looked like a full address fragment: ${record.address.city}`],
  }
}

function normalizeEntityType(record: RegistryRecordV3): RegistryRecordV3 {
  if (record.entity_type !== 'online_service') return record
  if (record.geo.lat === null || record.geo.lng === null) return record

  return {
    ...record,
    entity_type: 'physical_merchant',
    notes: [...record.notes, 'Entity type normalized to physical_merchant because geo coordinates are present.'],
  }
}

function inferProcessorLabel(record: RegistryRecordV3): string {
  return (
    record.supports_program_or_network ||
    record.evidence_refs.find((ref) => ref.publisher.trim())?.publisher ||
    record.evidence_refs.find((ref) => ref.label.trim())?.label ||
    'Crypto payment processor'
  )
}

function normalizeProcessorRails(record: RegistryRecordV3): RegistryRecordV3 {
  if (record.acceptance_type !== 'processor_checkout') return record
  if (record.support_rails.some((rail) => rail.rail_type === 'processor')) return record

  const label = inferProcessorLabel(record)
  const rail: SupportRailV3 = {
    rail_id: `processor:${slugify(label) || 'crypto-payment-processor'}`,
    rail_type: 'processor',
    label,
  }

  return {
    ...record,
    support_rails: [...record.support_rails, rail],
    notes: [...record.notes, `Processor rail inferred for processor_checkout record: ${label}`],
  }
}

export function normalizeRegistryRecordScope(record: RegistryRecordV3): RegistryRecordV3 {
  const withScope = {
    ...record,
    acceptance_scope: inferScope(record),
  }

  return normalizeProcessorRails(normalizeEntityType(normalizeAddress(withScope)))
}
