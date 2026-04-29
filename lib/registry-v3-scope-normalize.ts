import type { AcceptanceScopeV3, RegistryRecordV3 } from '../scripts/export/types-v3'

const CATALOG_PROGRAMS = ['bitrefill', 'coincards', 'egifter', 'coinsbee', 'cryptorefills', 'dundle']

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

export function normalizeRegistryRecordScope(record: RegistryRecordV3): RegistryRecordV3 {
  return {
    ...record,
    acceptance_scope: inferScope(record),
  }
}
