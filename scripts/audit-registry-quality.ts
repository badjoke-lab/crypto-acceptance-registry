import fs from 'node:fs'
import path from 'node:path'
import { getRegistryV3FullerSeeds } from '../lib/registry-v3-fuller-seeds'
import type { RegistryRecordV3 } from './export/types-v3'

type QualityReason =
  | 'confidence_low'
  | 'source_origin_community_seed'
  | 'missing_website'
  | 'missing_city'
  | 'missing_country'
  | 'missing_address_full'
  | 'missing_geo'
  | 'missing_evidence'
  | 'single_evidence_ref'
  | 'btcmap_or_osm_only_evidence'
  | 'no_merchant_official_evidence'
  | 'unknown_acceptance_scope'
  | 'generic_or_atm_like_name'
  | 'duplicate_display_name_candidate'
  | 'duplicate_website_domain_candidate'
  | 'duplicate_btcmap_place_id_candidate'
  | 'duplicate_osm_url_candidate'
  | 'nearby_same_name_candidate'

type DuplicateKind =
  | 'display_name'
  | 'website_domain'
  | 'btcmap_place_id'
  | 'osm_url'
  | 'nearby_same_name'

type DuplicateCandidate = {
  kind: DuplicateKind
  key: string
  count: number
  records: Array<{
    registry_id: string
    display_name: string
    website: string | null
    city: string | null
    country: string | null
    geo: { lat: number | null; lng: number | null }
  }>
}

type ThinRecord = {
  registry_id: string
  display_name: string
  website: string | null
  city: string | null
  country: string | null
  confidence: string
  source_origin: string
  acceptance_type: string
  acceptance_scope: string
  evidence_count: number
  thin_score: number
  thin_reasons: QualityReason[]
  extracted_refs: {
    btcmap_place_id: string | null
    osm_url: string | null
    lat_lon_from_notes: string | null
    website_domain: string | null
  }
  safe_auto_actions: string[]
  requires_manual_or_ai_review: string[]
}

type EnrichmentQueueItem = {
  registry_id: string
  display_name: string
  priority: 1 | 2 | 3 | 4
  task_type: 'find_merchant_official_evidence' | 'complete_geo_or_address' | 'dedupe_review' | 'low_priority_manual_review'
  reason: string
  candidate_urls: string[]
  current_confidence: string
  do_not_auto_upgrade_confidence: true
  thin_score: number
  thin_reasons: QualityReason[]
}

type Summary = {
  generated_at: string
  total_records: number
  by_confidence: Record<string, number>
  by_source_origin: Record<string, number>
  by_acceptance_type: Record<string, number>
  by_acceptance_scope: Record<string, number>
  missing: Record<string, number>
  thin_records_count: number
  duplicate_candidates_count: number
  top_thin_reasons: Record<string, number>
  notes: string[]
}

const OUT_DIR = path.join(process.cwd(), 'data', 'quality')

function increment(map: Record<string, number>, key: string | null | undefined): void {
  const normalized = key?.trim() || 'Unknown'
  map[normalized] = (map[normalized] ?? 0) + 1
}

function writeJson(relativePath: string, data: unknown): void {
  const filepath = path.join(process.cwd(), relativePath)
  fs.mkdirSync(path.dirname(filepath), { recursive: true })
  fs.writeFileSync(filepath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${relativePath}`)
}

function csvEscape(value: unknown): string {
  const text = Array.isArray(value) ? value.join('|') : String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}

function writeCsv(relativePath: string, rows: ThinRecord[]): void {
  const filepath = path.join(process.cwd(), relativePath)
  fs.mkdirSync(path.dirname(filepath), { recursive: true })
  const headers = [
    'registry_id',
    'display_name',
    'thin_score',
    'thin_reasons',
    'confidence',
    'source_origin',
    'website',
    'website_domain',
    'city',
    'country',
    'acceptance_type',
    'acceptance_scope',
    'evidence_count',
    'btcmap_place_id',
    'osm_url',
  ]
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(
      [
        row.registry_id,
        row.display_name,
        row.thin_score,
        row.thin_reasons,
        row.confidence,
        row.source_origin,
        row.website,
        row.extracted_refs.website_domain,
        row.city,
        row.country,
        row.acceptance_type,
        row.acceptance_scope,
        row.evidence_count,
        row.extracted_refs.btcmap_place_id,
        row.extracted_refs.osm_url,
      ]
        .map(csvEscape)
        .join(','),
    )
  }
  fs.writeFileSync(filepath, `${lines.join('\n')}\n`, 'utf8')
  console.log(`Wrote ${relativePath}`)
}

function normalizeDomain(website: string | null): string | null {
  if (!website) return null
  try {
    const hostname = new URL(website).hostname.toLowerCase().replace(/^www\./, '')
    return hostname || null
  } catch {
    return null
  }
}

function extractBtcMapPlaceId(record: RegistryRecordV3): string | null {
  const idMatch = record.registry_id.match(/btcmap-place-([^:]+)$/)
  if (idMatch?.[1]) return idMatch[1]
  for (const note of record.notes) {
    const noteMatch = note.match(/BTC Map place id:\s*([^\s]+)/i)
    if (noteMatch?.[1]) return noteMatch[1]
  }
  return null
}

function extractOsmUrl(record: RegistryRecordV3): string | null {
  for (const ref of record.evidence_refs) {
    if (ref.url.includes('openstreetmap.org')) return ref.url
  }
  for (const note of record.notes) {
    const noteMatch = note.match(/OSM:\s*(https?:\/\/\S+)/i)
    if (noteMatch?.[1]) return noteMatch[1]
  }
  return null
}

function extractLatLonFromNotes(record: RegistryRecordV3): string | null {
  for (const note of record.notes) {
    const noteMatch = note.match(/lat\/lon:\s*([-0-9.]+),\s*([-0-9.]+)/i)
    if (noteMatch?.[1] && noteMatch?.[2]) return `${noteMatch[1]},${noteMatch[2]}`
  }
  return null
}

function isMerchantOfficialEvidence(record: RegistryRecordV3): boolean {
  return record.evidence_refs.some((ref) =>
    ['official_payment_page', 'official_help_center', 'official_checkout', 'official_terms'].includes(ref.kind),
  )
}

function isBtcMapOrOsmOnlyEvidence(record: RegistryRecordV3): boolean {
  if (record.evidence_refs.length === 0) return false
  return record.evidence_refs.every((ref) => {
    const text = `${ref.publisher} ${ref.url} ${ref.label}`.toLowerCase()
    return text.includes('btc map') || text.includes('openstreetmap') || text.includes('osm')
  })
}

function isGenericOrAtmLikeName(name: string): boolean {
  const normalized = name.trim().toLowerCase()
  if (!normalized) return true
  return /^(bitcoin atm|atm|btm|cajero bitcoin|crypto atm)$/i.test(normalized) || normalized.includes('bitcoin atm')
}

function addGroup(map: Map<string, RegistryRecordV3[]>, key: string | null, record: RegistryRecordV3): void {
  if (!key) return
  const existing = map.get(key) ?? []
  existing.push(record)
  map.set(key, existing)
}

function geoBucket(record: RegistryRecordV3): string | null {
  if (typeof record.geo.lat !== 'number' || typeof record.geo.lng !== 'number') return null
  return `${record.display_name.trim().toLowerCase()}@${record.geo.lat.toFixed(3)},${record.geo.lng.toFixed(3)}`
}

function buildDuplicateCandidates(records: RegistryRecordV3[]): { candidates: DuplicateCandidate[]; flagsById: Map<string, Set<QualityReason>> } {
  const groups: Array<{ kind: DuplicateKind; map: Map<string, RegistryRecordV3[]> }> = [
    { kind: 'display_name', map: new Map() },
    { kind: 'website_domain', map: new Map() },
    { kind: 'btcmap_place_id', map: new Map() },
    { kind: 'osm_url', map: new Map() },
    { kind: 'nearby_same_name', map: new Map() },
  ]

  for (const record of records) {
    addGroup(groups[0].map, record.display_name.trim().toLowerCase(), record)
    addGroup(groups[1].map, normalizeDomain(record.website), record)
    addGroup(groups[2].map, extractBtcMapPlaceId(record), record)
    addGroup(groups[3].map, extractOsmUrl(record), record)
    addGroup(groups[4].map, geoBucket(record), record)
  }

  const reasonByKind: Record<DuplicateKind, QualityReason> = {
    display_name: 'duplicate_display_name_candidate',
    website_domain: 'duplicate_website_domain_candidate',
    btcmap_place_id: 'duplicate_btcmap_place_id_candidate',
    osm_url: 'duplicate_osm_url_candidate',
    nearby_same_name: 'nearby_same_name_candidate',
  }

  const candidates: DuplicateCandidate[] = []
  const flagsById = new Map<string, Set<QualityReason>>()

  for (const { kind, map } of groups) {
    for (const [key, grouped] of map) {
      if (grouped.length < 2) continue
      if (kind === 'display_name' && key.length < 4) continue
      candidates.push({
        kind,
        key,
        count: grouped.length,
        records: grouped.map((record) => ({
          registry_id: record.registry_id,
          display_name: record.display_name,
          website: record.website,
          city: record.address.city,
          country: record.address.country,
          geo: record.geo,
        })),
      })
      const reason = reasonByKind[kind]
      for (const record of grouped) {
        const flags = flagsById.get(record.registry_id) ?? new Set<QualityReason>()
        flags.add(reason)
        flagsById.set(record.registry_id, flags)
      }
    }
  }

  candidates.sort((a, b) => b.count - a.count || a.kind.localeCompare(b.kind) || a.key.localeCompare(b.key))
  return { candidates, flagsById }
}

function scoreRecord(record: RegistryRecordV3, duplicateFlags: Set<QualityReason>): ThinRecord {
  const reasons = new Set<QualityReason>()
  const merchantOfficialEvidence = isMerchantOfficialEvidence(record)
  const btcmapOrOsmOnly = isBtcMapOrOsmOnlyEvidence(record)

  if (record.confidence === 'low') reasons.add('confidence_low')
  if (record.source_origin === 'community_seed') reasons.add('source_origin_community_seed')
  if (!record.website) reasons.add('missing_website')
  if (!record.address.city) reasons.add('missing_city')
  if (!record.address.country) reasons.add('missing_country')
  if (!record.address.address_full) reasons.add('missing_address_full')
  if (typeof record.geo.lat !== 'number' || typeof record.geo.lng !== 'number') reasons.add('missing_geo')
  if (record.evidence_refs.length === 0) reasons.add('missing_evidence')
  if (record.evidence_refs.length === 1) reasons.add('single_evidence_ref')
  if (btcmapOrOsmOnly) reasons.add('btcmap_or_osm_only_evidence')
  if (!merchantOfficialEvidence) reasons.add('no_merchant_official_evidence')
  if (record.acceptance_scope === 'unknown') reasons.add('unknown_acceptance_scope')
  if (isGenericOrAtmLikeName(record.display_name)) reasons.add('generic_or_atm_like_name')
  for (const flag of duplicateFlags) reasons.add(flag)

  const weights: Record<QualityReason, number> = {
    confidence_low: 15,
    source_origin_community_seed: 12,
    missing_website: 12,
    missing_city: 10,
    missing_country: 12,
    missing_address_full: 8,
    missing_geo: 10,
    missing_evidence: 25,
    single_evidence_ref: 6,
    btcmap_or_osm_only_evidence: 14,
    no_merchant_official_evidence: 18,
    unknown_acceptance_scope: 5,
    generic_or_atm_like_name: 12,
    duplicate_display_name_candidate: 8,
    duplicate_website_domain_candidate: 8,
    duplicate_btcmap_place_id_candidate: 20,
    duplicate_osm_url_candidate: 20,
    nearby_same_name_candidate: 14,
  }

  const thinReasons = [...reasons].sort((a, b) => a.localeCompare(b))
  const thinScore = Math.min(100, thinReasons.reduce((sum, reason) => sum + weights[reason], 0))
  const extractedRefs = {
    btcmap_place_id: extractBtcMapPlaceId(record),
    osm_url: extractOsmUrl(record),
    lat_lon_from_notes: extractLatLonFromNotes(record),
    website_domain: normalizeDomain(record.website),
  }

  const safeAutoActions: string[] = []
  if (extractedRefs.btcmap_place_id) safeAutoActions.push('extract_btcmap_place_id_from_notes_or_registry_id')
  if (extractedRefs.osm_url) safeAutoActions.push('extract_osm_url_from_notes_or_evidence')
  if (extractedRefs.lat_lon_from_notes) safeAutoActions.push('extract_lat_lon_from_notes')
  if (extractedRefs.website_domain) safeAutoActions.push('derive_website_domain_for_duplicate_review')

  const reviewActions = ['merchant_official_crypto_payment_confirmation']
  if (thinReasons.some((reason) => reason.startsWith('duplicate_') || reason === 'nearby_same_name_candidate')) {
    reviewActions.push('dedupe_review')
  }
  if (record.confidence === 'low') reviewActions.push('confidence_upgrade_only_after_official_evidence')
  if (!record.address.city || !record.address.country) reviewActions.push('geo_or_address_completion_without_guessing')

  return {
    registry_id: record.registry_id,
    display_name: record.display_name,
    website: record.website,
    city: record.address.city,
    country: record.address.country,
    confidence: record.confidence,
    source_origin: record.source_origin,
    acceptance_type: record.acceptance_type,
    acceptance_scope: record.acceptance_scope,
    evidence_count: record.evidence_refs.length,
    thin_score: thinScore,
    thin_reasons: thinReasons,
    extracted_refs: extractedRefs,
    safe_auto_actions: safeAutoActions,
    requires_manual_or_ai_review: [...new Set(reviewActions)],
  }
}

function toQueueItem(record: ThinRecord): EnrichmentQueueItem {
  const hasWebsite = Boolean(record.website)
  const hasDuplicateRisk = record.thin_reasons.some(
    (reason) => reason.startsWith('duplicate_') || reason === 'nearby_same_name_candidate',
  )
  const hasGeoGap = record.thin_reasons.includes('missing_city') || record.thin_reasons.includes('missing_country')

  if (hasDuplicateRisk) {
    return {
      registry_id: record.registry_id,
      display_name: record.display_name,
      priority: 1,
      task_type: 'dedupe_review',
      reason: 'Possible duplicate record detected. Review before adding more enrichment.',
      candidate_urls: [record.website].filter((url): url is string => Boolean(url)),
      current_confidence: record.confidence,
      do_not_auto_upgrade_confidence: true,
      thin_score: record.thin_score,
      thin_reasons: record.thin_reasons,
    }
  }

  if (hasWebsite) {
    return {
      registry_id: record.registry_id,
      display_name: record.display_name,
      priority: 1,
      task_type: 'find_merchant_official_evidence',
      reason: 'Record has a website candidate but lacks merchant-side official crypto payment evidence.',
      candidate_urls: [record.website].filter((url): url is string => Boolean(url)),
      current_confidence: record.confidence,
      do_not_auto_upgrade_confidence: true,
      thin_score: record.thin_score,
      thin_reasons: record.thin_reasons,
    }
  }

  if (hasGeoGap && (record.extracted_refs.osm_url || record.extracted_refs.lat_lon_from_notes)) {
    return {
      registry_id: record.registry_id,
      display_name: record.display_name,
      priority: 2,
      task_type: 'complete_geo_or_address',
      reason: 'Record has OSM or coordinate references but missing city/country. Do not infer from free-form address without a reliable source.',
      candidate_urls: [record.extracted_refs.osm_url].filter((url): url is string => Boolean(url)),
      current_confidence: record.confidence,
      do_not_auto_upgrade_confidence: true,
      thin_score: record.thin_score,
      thin_reasons: record.thin_reasons,
    }
  }

  return {
    registry_id: record.registry_id,
    display_name: record.display_name,
    priority: record.thin_score >= 60 ? 3 : 4,
    task_type: 'low_priority_manual_review',
    reason: 'Thin record without enough safe automatic enrichment signals.',
    candidate_urls: [record.website, record.extracted_refs.osm_url].filter((url): url is string => Boolean(url)),
    current_confidence: record.confidence,
    do_not_auto_upgrade_confidence: true,
    thin_score: record.thin_score,
    thin_reasons: record.thin_reasons,
  }
}

function validateOutputs(summary: Summary, thinRecords: ThinRecord[], queue: EnrichmentQueueItem[], duplicates: DuplicateCandidate[]): void {
  if (!Number.isInteger(summary.total_records) || summary.total_records <= 0) throw new Error('summary.total_records is invalid')
  for (const record of thinRecords) {
    if (!record.registry_id || !record.display_name) throw new Error(`Malformed thin record: ${JSON.stringify(record)}`)
    if (record.thin_score < 0 || record.thin_score > 100) throw new Error(`Invalid thin_score for ${record.registry_id}`)
  }
  for (const item of queue) {
    if (!item.registry_id || !item.task_type || item.do_not_auto_upgrade_confidence !== true) {
      throw new Error(`Malformed enrichment queue item: ${JSON.stringify(item)}`)
    }
  }
  for (const duplicate of duplicates) {
    if (duplicate.count !== duplicate.records.length) throw new Error(`Malformed duplicate candidate: ${duplicate.kind}:${duplicate.key}`)
  }
}

function main(): void {
  const records = getRegistryV3FullerSeeds() as RegistryRecordV3[]
  const { candidates: duplicateCandidates, flagsById } = buildDuplicateCandidates(records)

  const byConfidence: Record<string, number> = {}
  const bySourceOrigin: Record<string, number> = {}
  const byAcceptanceType: Record<string, number> = {}
  const byAcceptanceScope: Record<string, number> = {}
  const missing: Record<string, number> = {
    website: 0,
    city: 0,
    country: 0,
    address_full: 0,
    geo: 0,
    evidence: 0,
    merchant_official_evidence: 0,
  }
  const topThinReasons: Record<string, number> = {}

  const qualityRows = records.map((record) => scoreRecord(record, flagsById.get(record.registry_id) ?? new Set()))

  for (const record of records) {
    increment(byConfidence, record.confidence)
    increment(bySourceOrigin, record.source_origin)
    increment(byAcceptanceType, record.acceptance_type)
    increment(byAcceptanceScope, record.acceptance_scope)
    if (!record.website) missing.website += 1
    if (!record.address.city) missing.city += 1
    if (!record.address.country) missing.country += 1
    if (!record.address.address_full) missing.address_full += 1
    if (typeof record.geo.lat !== 'number' || typeof record.geo.lng !== 'number') missing.geo += 1
    if (record.evidence_refs.length === 0) missing.evidence += 1
    if (!isMerchantOfficialEvidence(record)) missing.merchant_official_evidence += 1
  }

  const thinRecords = qualityRows
    .filter((record) => record.thin_score > 0)
    .sort((a, b) => b.thin_score - a.thin_score || a.display_name.localeCompare(b.display_name) || a.registry_id.localeCompare(b.registry_id))

  for (const record of thinRecords) {
    for (const reason of record.thin_reasons) increment(topThinReasons, reason)
  }

  const enrichmentQueue = thinRecords
    .filter((record) => record.thin_score >= 30)
    .map(toQueueItem)
    .sort((a, b) => a.priority - b.priority || b.thin_score - a.thin_score || a.display_name.localeCompare(b.display_name))

  const summary: Summary = {
    generated_at: new Date().toISOString(),
    total_records: records.length,
    by_confidence: byConfidence,
    by_source_origin: bySourceOrigin,
    by_acceptance_type: byAcceptanceType,
    by_acceptance_scope: byAcceptanceScope,
    missing,
    thin_records_count: thinRecords.length,
    duplicate_candidates_count: duplicateCandidates.length,
    top_thin_reasons: Object.fromEntries(Object.entries(topThinReasons).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
    notes: [
      'This audit is non-destructive and does not modify seed records or public artifacts.',
      'Do not raise confidence from low to medium/high without merchant-side official payment evidence.',
      'Do not infer city/country from free-form address notes without a reliable geocoding or source-backed process.',
    ],
  }

  validateOutputs(summary, thinRecords, enrichmentQueue, duplicateCandidates)

  fs.mkdirSync(OUT_DIR, { recursive: true })
  writeJson('data/quality/record-quality-summary.json', summary)
  writeJson('data/quality/thin-records.json', thinRecords)
  writeCsv('data/quality/thin-records.csv', thinRecords)
  writeJson('data/quality/enrichment-queue.json', {
    generated_at: summary.generated_at,
    queue_policy: {
      non_destructive: true,
      do_not_auto_upgrade_confidence: true,
      confidence_upgrade_requires: 'merchant-side official payment/FAQ/checkout/support evidence',
    },
    items: enrichmentQueue,
  })
  writeJson('data/quality/duplicate-candidates.json', duplicateCandidates)

  console.log(`records scanned: ${records.length}`)
  console.log(`thin records: ${thinRecords.length}`)
  console.log(`enrichment queue: ${enrichmentQueue.length}`)
  console.log(`duplicate candidates: ${duplicateCandidates.length}`)
}

main()
