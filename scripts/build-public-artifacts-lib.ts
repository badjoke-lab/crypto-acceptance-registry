import fs from 'node:fs'
import path from 'node:path'
import type {
  ClassifiedCandidateRecord,
  ConfidenceLevel,
  LegacySocialLink,
  NormalizedCandidateRecord,
} from './export/types'
import type { RegistryRecordV3, SocialProfileV3 } from './export/types-v3'
import { getRegistryV3FullerSeeds } from '../lib/registry-v3-fuller-seeds'
import { dedupeClassifiedByDuplicateSignature } from './public-artifact-dedupe'
import { buildExtendedProductStats, type ExtendedProductStats } from './public-stats-health'

type ProductStats = ExtendedProductStats

type CutoverReport = {
  generatedAt: string
  merchants: {
    total: number
    withEvidence: number
    withWebsite: number
    highConfidence: number
    mediumConfidence: number
    lowConfidence: number
  }
  stats: ProductStats
  reviewQueue: {
    total: number
  }
}

type PublicArtifacts = {
  ready: ClassifiedCandidateRecord[]
  pending: ClassifiedCandidateRecord[]
  stats: ProductStats
  cutoverReport: CutoverReport
}

function getTypedFullerSeeds(): RegistryRecordV3[] {
  return getRegistryV3FullerSeeds() as RegistryRecordV3[]
}

function uniqueSorted(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)))].sort(
    (a, b) => a.localeCompare(b),
  )
}

function mapMode(record: RegistryRecordV3): ClassifiedCandidateRecord['proposed_mode'] {
  if (record.acceptance_type === 'direct_crypto') return 'direct'
  if (record.acceptance_type === 'processor_checkout') return 'processor'
  if (record.acceptance_type === 'crypto_card') return 'bridge'
  if (record.acceptance_type === 'digital_cash') return 'bridge'

  if (record.acceptance_type === 'mixed') {
    if (record.support_rails.some((rail) => rail.rail_type === 'processor')) return 'processor'
    if (
      record.support_rails.some(
        (rail) => rail.rail_type === 'card_program' || rail.rail_type === 'digital_cash_program',
      )
    ) {
      return 'bridge'
    }
  }

  return 'unknown'
}

function toLegacySocialLink(profile: SocialProfileV3): LegacySocialLink {
  return {
    platform: profile.platform,
    url: profile.url,
    handle: profile.handle ?? null,
  }
}

function toNormalizedCandidate(record: RegistryRecordV3): NormalizedCandidateRecord {
  const acceptedAssets = uniqueSorted(
    record.support_rails.filter((rail) => rail.rail_type === 'asset').map((rail) => rail.label),
  )
  const acceptedChains = uniqueSorted(
    record.support_rails.filter((rail) => rail.rail_type === 'chain').map((rail) => rail.label),
  )
  const paymentProcessors = uniqueSorted(
    record.support_rails.filter((rail) => rail.rail_type === 'processor').map((rail) => rail.label),
  )
  const paymentMethods = uniqueSorted([
    record.acceptance_type,
    record.acceptance_scope,
    ...record.support_rails
      .filter((rail) => rail.rail_type !== 'asset' && rail.rail_type !== 'chain')
      .map((rail) => rail.label),
  ])
  const paymentNotes = uniqueSorted([record.supports_program_or_network, record.explicit_support, ...record.notes])
  const verificationStatus = record.evidence_refs.length > 0 ? 'ready' : 'pending_external_reference_review'

  return {
    legacy_id: record.registry_id,
    display_name: record.display_name,
    country: record.address.country,
    city: record.address.city,
    website: record.website,
    verification_status: verificationStatus,
    accepted_assets: acceptedAssets,
    accepted_chains: acceptedChains,
    payment_methods: paymentMethods,
    payment_processors: paymentProcessors,
    payment_notes: paymentNotes,
    social_links: record.social_profiles.map(toLegacySocialLink),
  }
}

function buildReviewReasons(record: ClassifiedCandidateRecord): string[] {
  const reasons: string[] = []

  if (record.evidence_refs.length === 0) reasons.push('missing_external_reference')
  if (record.proposed_mode === 'unknown') reasons.push('unknown_mode')
  if (!record.verification_status) reasons.push('missing_verification_status')
  if (!record.payment_methods.length && !record.payment_processors.length) reasons.push('missing_payment_context')

  return reasons
}

function classifyCandidate(normalized: NormalizedCandidateRecord, source: RegistryRecordV3): ClassifiedCandidateRecord {
  const proposedMode = mapMode(source)
  const evidenceRefs = uniqueSorted(source.evidence_refs.map((ref) => ref.url))
  const base: ClassifiedCandidateRecord = {
    ...normalized,
    proposed_mode: proposedMode,
    confidence: source.confidence as ConfidenceLevel,
    review_reasons: [],
    evidence_refs: evidenceRefs,
  }

  return {
    ...base,
    review_reasons: buildReviewReasons(base),
  }
}

function isReady(record: ClassifiedCandidateRecord): boolean {
  return record.evidence_refs.length > 0 && record.proposed_mode !== 'unknown'
}

function sortNormalized(records: NormalizedCandidateRecord[]): NormalizedCandidateRecord[] {
  return [...records].sort((a, b) => {
    const nameCompare = a.display_name.localeCompare(b.display_name)
    if (nameCompare !== 0) return nameCompare
    return a.legacy_id.localeCompare(b.legacy_id)
  })
}

function sortClassified(records: ClassifiedCandidateRecord[]): ClassifiedCandidateRecord[] {
  return [...records].sort((a, b) => {
    const nameCompare = a.display_name.localeCompare(b.display_name)
    if (nameCompare !== 0) return nameCompare
    return a.legacy_id.localeCompare(b.legacy_id)
  })
}

function confidenceScore(record: ClassifiedCandidateRecord): number {
  if (record.confidence === 'high') return 3
  if (record.confidence === 'medium') return 2
  return 1
}

function candidateQualityScore(record: ClassifiedCandidateRecord): number {
  return [
    confidenceScore(record) * 1000,
    record.evidence_refs.length * 100,
    record.website ? 50 : 0,
    record.payment_processors.length * 10,
    record.accepted_assets.length + record.accepted_chains.length + record.payment_methods.length,
    -record.review_reasons.length,
  ].reduce((sum, value) => sum + value, 0)
}

function dedupeClassifiedByRegistryId(records: ClassifiedCandidateRecord[]): ClassifiedCandidateRecord[] {
  const byId = new Map<string, ClassifiedCandidateRecord>()

  for (const record of records) {
    const existing = byId.get(record.legacy_id)
    if (!existing || candidateQualityScore(record) > candidateQualityScore(existing)) {
      byId.set(record.legacy_id, record)
    }
  }

  return sortClassified([...byId.values()])
}

function dedupeForPublicArtifacts(records: ClassifiedCandidateRecord[]): ClassifiedCandidateRecord[] {
  return sortClassified(dedupeClassifiedByDuplicateSignature(dedupeClassifiedByRegistryId(records)))
}

export function buildNormalizedCandidates(): NormalizedCandidateRecord[] {
  return sortNormalized(getTypedFullerSeeds().map(toNormalizedCandidate))
}

export function buildClassifiedCandidates(): ClassifiedCandidateRecord[] {
  return sortClassified(
    getTypedFullerSeeds().map((source) => classifyCandidate(toNormalizedCandidate(source), source)),
  )
}

export function buildPublicArtifacts(): PublicArtifacts {
  const sourceSeedRecords = getTypedFullerSeeds()
  const sourceById = new Map(sourceSeedRecords.map((record) => [record.registry_id, record]))
  const sourceRecords = dedupeForPublicArtifacts(
    sortClassified(sourceSeedRecords.map((source) => classifyCandidate(toNormalizedCandidate(source), source))),
  )
  const ready: ClassifiedCandidateRecord[] = []
  const pending: ClassifiedCandidateRecord[] = []

  for (const record of sourceRecords) {
    if (isReady(record)) {
      ready.push(record)
    } else {
      pending.push(record)
    }
  }

  const sortedReady = sortClassified(ready)
  const sortedPending = sortClassified(pending)
  const sortedReadySourceRecords = sortedReady
    .map((record) => sourceById.get(record.legacy_id))
    .filter((record): record is RegistryRecordV3 => Boolean(record))
  const stats = buildExtendedProductStats(sortedReady, sortedReadySourceRecords)

  const cutoverReport: CutoverReport = {
    generatedAt: new Date().toISOString(),
    merchants: {
      total: sortedReady.length,
      withEvidence: sortedReady.filter((record) => record.evidence_refs.length > 0).length,
      withWebsite: sortedReady.filter((record) => Boolean(record.website)).length,
      highConfidence: sortedReady.filter((record) => record.confidence === 'high').length,
      mediumConfidence: sortedReady.filter((record) => record.confidence === 'medium').length,
      lowConfidence: sortedReady.filter((record) => record.confidence === 'low').length,
    },
    stats,
    reviewQueue: {
      total: sortedPending.length,
    },
  }

  return {
    ready: sortedReady,
    pending: sortedPending,
    stats,
    cutoverReport,
  }
}

function writeJson(relativePath: string, data: unknown): void {
  const filepath = path.join(process.cwd(), relativePath)
  fs.writeFileSync(filepath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${relativePath}`)
}

export function writeNormalizedCandidates(): void {
  writeJson('data/normalized-candidates.json', buildNormalizedCandidates())
}

export function writeClassifiedCandidates(): void {
  writeJson('data/classified-candidates.json', buildClassifiedCandidates())
}

export function writeProductMerchants(): void {
  const { ready } = buildPublicArtifacts()
  writeJson('data/product-merchants.json', ready)
}

export function writeReviewQueue(): void {
  const { pending } = buildPublicArtifacts()
  writeJson('data/review-queue.json', pending)
}

export function writeProductStats(): void {
  const { stats } = buildPublicArtifacts()
  writeJson('data/product-stats.json', stats)
}

export function writeCutoverReport(): void {
  const { cutoverReport } = buildPublicArtifacts()
  writeJson('data/cutover-report.json', cutoverReport)
}

export function writeAllPublicArtifacts(): void {
  writeJson('data/normalized-candidates.json', buildNormalizedCandidates())
  writeJson('data/classified-candidates.json', buildClassifiedCandidates())
  const artifacts = buildPublicArtifacts()
  writeJson('data/product-merchants.json', artifacts.ready)
  writeJson('data/review-queue.json', artifacts.pending)
  writeJson('data/product-stats.json', artifacts.stats)
  writeJson('data/cutover-report.json', artifacts.cutoverReport)
}
