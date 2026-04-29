import type { ClassifiedCandidateRecord } from './export/types'
import type { RegistryRecordV3 } from './export/types-v3'

export type PublicStatsHealthIssue = {
  id: string
  name: string
  value?: string | null
  reason: string
}

export type ExtendedProductStats = {
  totalMerchants: number
  modeBreakdown: Record<string, number>
  confidenceBreakdown: Record<string, number>
  countryBreakdown: Record<string, number>
  processorBreakdown: Record<string, number>
  scopeBreakdown: Record<string, number>
  entityTypeBreakdown: Record<string, number>
  acceptanceTypeBreakdown: Record<string, number>
  acceptanceScopeBreakdown: Record<string, number>
  sourceOriginBreakdown: Record<string, number>
  verificationMethodBreakdown: Record<string, number>
  coverageRegionBreakdown: Record<string, number>
  cityBreakdown: Record<string, number>
  processorModeProcessorBreakdown: Record<string, number>
  noProcessorReasonBreakdown: Record<string, number>
  supportRailTypeBreakdown: Record<string, number>
  supportRailLabelBreakdown: Record<string, number>
  evidenceKindBreakdown: Record<string, number>
  evidencePublisherBreakdown: Record<string, number>
  websitePresenceBreakdown: Record<string, number>
  geoPresenceBreakdown: Record<string, number>
  addressPresenceBreakdown: Record<string, number>
  evidenceCountBreakdown: Record<string, number>
  notesPresenceBreakdown: Record<string, number>
  duplicateDisplayNameSizeBreakdown: Record<string, number>
  recordHealthBreakdown: Record<string, number>
  invalidCountryValues: PublicStatsHealthIssue[]
  invalidCityValues: PublicStatsHealthIssue[]
  btcMapEntriesWithCountryOrCity: PublicStatsHealthIssue[]
  btcMapEntriesWithoutPlaceIdNote: PublicStatsHealthIssue[]
  recordsWithEmptyDisplayName: PublicStatsHealthIssue[]
  recordsWithUnnamedName: PublicStatsHealthIssue[]
  recordsWithoutEvidence: PublicStatsHealthIssue[]
  recordsWithoutSupportRails: PublicStatsHealthIssue[]
  recordsWithUnknownAcceptanceType: PublicStatsHealthIssue[]
  recordsWithUnknownAcceptanceScope: PublicStatsHealthIssue[]
  recordsWithOnlineServiceButGeo: PublicStatsHealthIssue[]
  recordsWithPhysicalMerchantButNoGeo: PublicStatsHealthIssue[]
  recordsWithProcessorModeButNoProcessorRail: PublicStatsHealthIssue[]
  recordsWithDirectCryptoButProcessorOnlyRail: PublicStatsHealthIssue[]
  duplicateRegistryIds: PublicStatsHealthIssue[]
  duplicateDisplayNameGroups: PublicStatsHealthIssue[]
  duplicateDisplayNameRiskGroups: PublicStatsHealthIssue[]
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

function valueOrUnknown(value: string | null | undefined): string {
  return value?.trim() || 'Unknown'
}

function countBucket(value: number): string {
  if (value === 0) return '0'
  if (value === 1) return '1'
  if (value <= 3) return '2-3'
  if (value <= 10) return '4-10'
  return '11+'
}

function isIsoLikeCountry(value: string | null | undefined): boolean {
  if (!value) return true
  return value === 'Global' || /^[A-Z]{2}$/.test(value)
}

function looksLikeAddressFragment(value: string | null | undefined): boolean {
  if (!value) return false
  return /\d{3,}|\bRua\b|\bAvenida\b|\bStreet\b|\bRoad\b|\bR\.\b|\bBrasil\b|\bSala\b|\bOff\b/i.test(value)
}

function isBtcMapRecord(record: RegistryRecordV3): boolean {
  const program = record.supports_program_or_network?.toLowerCase() ?? ''
  return (
    record.registry_id.includes(':btcmap-place-') ||
    program.includes('btc map') ||
    record.notes.some((note) => note.includes('BTC Map place id:') || note.includes('OSM: https://www.openstreetmap.org/')) ||
    record.evidence_refs.some((ref) => ref.url.includes('api.btcmap.org'))
  )
}

function issue(record: RegistryRecordV3, reason: string, value?: string | null): PublicStatsHealthIssue {
  return { id: record.registry_id, name: record.display_name, value, reason }
}

function normalizedEvidenceUrlKey(record: RegistryRecordV3): string {
  return record.evidence_refs.map((ref) => ref.url.trim().toLowerCase()).sort().join('|') || 'no_evidence_url'
}

function normalizedLocationKey(record: RegistryRecordV3): string {
  if (isBtcMapRecord(record)) {
    const lat = record.geo.lat === null ? 'no_lat' : record.geo.lat.toFixed(5)
    const lng = record.geo.lng === null ? 'no_lng' : record.geo.lng.toFixed(5)
    return [record.address.address_full ?? 'no_address', `${lat},${lng}`].join('::')
  }

  return [
    record.address.country ?? 'no_country',
    record.address.city ?? 'no_city',
    record.coverage_region ?? 'no_coverage_region',
  ].join('::')
}

function duplicateRiskKey(record: RegistryRecordV3): string {
  return [
    record.display_name.trim().toLowerCase(),
    record.website?.trim().toLowerCase() || 'no_website',
    normalizedLocationKey(record),
    record.acceptance_type,
    record.supports_program_or_network ?? 'no_program',
    normalizedEvidenceUrlKey(record),
  ].join('::')
}

export function buildExtendedProductStats(
  ready: ClassifiedCandidateRecord[],
  readySourceRecords: RegistryRecordV3[],
): ExtendedProductStats {
  const sourceById = new Map(readySourceRecords.map((record) => [record.registry_id, record]))
  const readySources = ready.map((record) => sourceById.get(record.legacy_id)).filter((record): record is RegistryRecordV3 => Boolean(record))
  const duplicateIds = new Map<string, RegistryRecordV3[]>()
  const duplicateNames = new Map<string, RegistryRecordV3[]>()
  const duplicateRiskGroups = new Map<string, RegistryRecordV3[]>()

  for (const record of readySources) {
    duplicateIds.set(record.registry_id, [...(duplicateIds.get(record.registry_id) ?? []), record])
    duplicateNames.set(record.display_name.toLowerCase(), [...(duplicateNames.get(record.display_name.toLowerCase()) ?? []), record])
    duplicateRiskGroups.set(duplicateRiskKey(record), [...(duplicateRiskGroups.get(duplicateRiskKey(record)) ?? []), record])
  }

  const processorModeRecords = ready.filter((record) => record.proposed_mode === 'processor')
  const noProcessorReasons = ready.flatMap((record) => {
    if (record.payment_processors.length > 0) return []
    if (record.proposed_mode === 'direct') return ['direct_crypto_no_processor_expected']
    if (record.proposed_mode === 'bridge') return ['bridge_no_processor']
    if (record.proposed_mode === 'processor') return ['processor_mode_missing_processor']
    return ['unknown_mode_no_processor']
  })

  const invalidCountryValues = readySources
    .filter((record) => !isIsoLikeCountry(record.address.country))
    .map((record) => issue(record, 'country is not null, Global, or ISO-3166 alpha-2-like value', record.address.country))
  const invalidCityValues = readySources
    .filter((record) => looksLikeAddressFragment(record.address.city))
    .map((record) => issue(record, 'city looks like a full address fragment', record.address.city))
  const btcMapEntriesWithCountryOrCity = readySources
    .filter((record) => isBtcMapRecord(record) && (record.address.country || record.address.city))
    .map((record) => issue(record, 'BTC Map record should not keep inferred country/city before geocoding', `${record.address.country ?? ''} / ${record.address.city ?? ''}`))
  const btcMapEntriesWithoutPlaceIdNote = readySources
    .filter((record) => isBtcMapRecord(record) && !record.notes.some((note) => note.startsWith('BTC Map place id: ')))
    .map((record) => issue(record, 'BTC Map record is missing BTC Map place id note'))
  const recordsWithEmptyDisplayName = readySources
    .filter((record) => !record.display_name.trim())
    .map((record) => issue(record, 'display_name is empty'))
  const recordsWithUnnamedName = readySources
    .filter((record) => record.display_name.trim().toLowerCase() === 'unnamed')
    .map((record) => issue(record, 'display_name is Unnamed'))
  const recordsWithoutEvidence = readySources
    .filter((record) => record.evidence_refs.length === 0)
    .map((record) => issue(record, 'missing evidence_refs'))
  const recordsWithoutSupportRails = readySources
    .filter((record) => record.support_rails.length === 0)
    .map((record) => issue(record, 'missing support_rails'))
  const recordsWithUnknownAcceptanceType = readySources
    .filter((record) => record.acceptance_type === 'unknown')
    .map((record) => issue(record, 'acceptance_type is unknown'))
  const recordsWithUnknownAcceptanceScope = readySources
    .filter((record) => record.acceptance_scope === 'unknown')
    .map((record) => issue(record, 'acceptance_scope is unknown'))
  const recordsWithOnlineServiceButGeo = readySources
    .filter((record) => record.entity_type === 'online_service' && (record.geo.lat !== null || record.geo.lng !== null))
    .map((record) => issue(record, 'online_service has geo values'))
  const recordsWithPhysicalMerchantButNoGeo = readySources
    .filter((record) => record.entity_type === 'physical_merchant' && (record.geo.lat === null || record.geo.lng === null))
    .map((record) => issue(record, 'physical_merchant is missing geo values'))
  const recordsWithProcessorModeButNoProcessorRail = readySources
    .filter((record) => record.acceptance_type === 'processor_checkout' && !record.support_rails.some((rail) => rail.rail_type === 'processor'))
    .map((record) => issue(record, 'processor_checkout record has no processor rail'))
  const recordsWithDirectCryptoButProcessorOnlyRail = readySources
    .filter((record) => record.acceptance_type === 'direct_crypto' && record.support_rails.length > 0 && record.support_rails.every((rail) => rail.rail_type === 'processor'))
    .map((record) => issue(record, 'direct_crypto record only has processor rails'))
  const duplicateRegistryIds = [...duplicateIds.entries()]
    .filter(([, records]) => records.length > 1)
    .flatMap(([, records]) => records.map((record) => issue(record, 'duplicate registry_id')))
  const duplicateDisplayNameGroups = [...duplicateNames.entries()]
    .filter(([, records]) => records.length > 1)
    .flatMap(([, records]) => records.map((record) => issue(record, 'raw duplicate display_name group', record.display_name)))
  const duplicateDisplayNameRiskGroups = [...duplicateRiskGroups.entries()]
    .filter(([, records]) => records.length > 1)
    .flatMap(([, records]) => records.map((record) => issue(record, 'possible duplicate display_name with same website/location/program/evidence URL', record.display_name)))
  const duplicateDisplayNameSizeBreakdown = countBy(
    [...duplicateNames.values()].filter((records) => records.length > 1).map((records) => countBucket(records.length)),
  )

  const healthIssueCount = [
    invalidCountryValues,
    invalidCityValues,
    btcMapEntriesWithCountryOrCity,
    btcMapEntriesWithoutPlaceIdNote,
    recordsWithEmptyDisplayName,
    recordsWithUnnamedName,
    recordsWithoutEvidence,
    recordsWithoutSupportRails,
    recordsWithUnknownAcceptanceType,
    recordsWithUnknownAcceptanceScope,
    recordsWithOnlineServiceButGeo,
    recordsWithPhysicalMerchantButNoGeo,
    recordsWithProcessorModeButNoProcessorRail,
    recordsWithDirectCryptoButProcessorOnlyRail,
    duplicateRegistryIds,
    duplicateDisplayNameRiskGroups,
  ].reduce((sum, items) => sum + items.length, 0)

  return {
    totalMerchants: ready.length,
    modeBreakdown: countBy(ready.map((record) => record.proposed_mode)),
    confidenceBreakdown: countBy(ready.map((record) => record.confidence)),
    countryBreakdown: countBy(ready.map((record) => record.country || 'Unknown')),
    processorBreakdown: countBy(ready.flatMap((record) => (record.payment_processors.length > 0 ? record.payment_processors : ['Unknown']))),
    scopeBreakdown: countBy(readySources.map((record) => record.scope)),
    entityTypeBreakdown: countBy(readySources.map((record) => record.entity_type)),
    acceptanceTypeBreakdown: countBy(readySources.map((record) => record.acceptance_type)),
    acceptanceScopeBreakdown: countBy(readySources.map((record) => record.acceptance_scope)),
    sourceOriginBreakdown: countBy(readySources.map((record) => record.source_origin)),
    verificationMethodBreakdown: countBy(readySources.map((record) => record.verification_method)),
    coverageRegionBreakdown: countBy(readySources.map((record) => valueOrUnknown(record.coverage_region))),
    cityBreakdown: countBy(readySources.map((record) => valueOrUnknown(record.address.city))),
    processorModeProcessorBreakdown: countBy(processorModeRecords.flatMap((record) => (record.payment_processors.length > 0 ? record.payment_processors : ['Unknown processor in processor mode']))),
    noProcessorReasonBreakdown: countBy(noProcessorReasons),
    supportRailTypeBreakdown: countBy(readySources.flatMap((record) => record.support_rails.map((rail) => rail.rail_type))),
    supportRailLabelBreakdown: countBy(readySources.flatMap((record) => record.support_rails.map((rail) => rail.label))),
    evidenceKindBreakdown: countBy(readySources.flatMap((record) => record.evidence_refs.map((ref) => ref.kind))),
    evidencePublisherBreakdown: countBy(readySources.flatMap((record) => record.evidence_refs.map((ref) => ref.publisher))),
    websitePresenceBreakdown: countBy(readySources.map((record) => (record.website ? 'with_website' : 'without_website'))),
    geoPresenceBreakdown: countBy(readySources.map((record) => (record.geo.lat !== null && record.geo.lng !== null ? 'with_geo' : 'without_geo'))),
    addressPresenceBreakdown: countBy(readySources.map((record) => (record.address.address_full ? 'with_address_full' : 'without_address_full'))),
    evidenceCountBreakdown: countBy(readySources.map((record) => countBucket(record.evidence_refs.length))),
    notesPresenceBreakdown: countBy(readySources.map((record) => (record.notes.length > 0 ? 'with_notes' : 'without_notes'))),
    duplicateDisplayNameSizeBreakdown,
    recordHealthBreakdown: { total_health_issues: healthIssueCount, records_scanned: readySources.length },
    invalidCountryValues,
    invalidCityValues,
    btcMapEntriesWithCountryOrCity,
    btcMapEntriesWithoutPlaceIdNote,
    recordsWithEmptyDisplayName,
    recordsWithUnnamedName,
    recordsWithoutEvidence,
    recordsWithoutSupportRails,
    recordsWithUnknownAcceptanceType,
    recordsWithUnknownAcceptanceScope,
    recordsWithOnlineServiceButGeo,
    recordsWithPhysicalMerchantButNoGeo,
    recordsWithProcessorModeButNoProcessorRail,
    recordsWithDirectCryptoButProcessorOnlyRail,
    duplicateRegistryIds,
    duplicateDisplayNameGroups,
    duplicateDisplayNameRiskGroups,
  }
}
