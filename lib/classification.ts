import type {
  AcceptanceMode,
  ClassifiedCandidateRecord,
  ConfidenceLevel,
  NormalizedCandidateRecord,
} from '@/scripts/export/types'

const BRIDGE_TERMS = ['card', 'visa', 'mastercard', 'rakuten cash', 'wallet conversion', 'fiat conversion']
const PROCESSOR_TERMS = ['bitpay', 'opennode', 'binance pay', 'coinbase commerce', 'btcpay']
const DIRECT_TERMS = ['lightning', 'invoice', 'wallet address', 'on-chain', 'qr']

function textBlob(record: NormalizedCandidateRecord): string {
  return [
    record.website,
    ...record.accepted_assets,
    ...record.accepted_chains,
    ...record.payment_methods,
    ...record.payment_processors,
    ...record.payment_notes,
    ...record.social_links.flatMap((item) => [item.platform, item.url ?? '', item.handle ?? '']),
  ]
    .join(' ')
    .toLowerCase()
}

function includesAny(haystack: string, needles: string[]): boolean {
  return needles.some((needle) => haystack.includes(needle))
}

export function classifyCandidate(record: NormalizedCandidateRecord): ClassifiedCandidateRecord {
  const blob = textBlob(record)

  let proposed_mode: AcceptanceMode = 'unknown'
  let confidence: ConfidenceLevel = 'low'
  const review_reasons: string[] = []
  const evidence_refs: string[] = []

  const hasBridge = includesAny(blob, BRIDGE_TERMS)
  const hasProcessor = includesAny(blob, PROCESSOR_TERMS) || record.payment_processors.length > 0
  const hasDirect = includesAny(blob, DIRECT_TERMS)

  if (hasBridge && (hasProcessor || hasDirect)) {
    proposed_mode = 'unknown'
    confidence = 'low'
    review_reasons.push('conflicting_indicators')
  } else if (hasProcessor) {
    proposed_mode = 'processor'
    confidence = record.payment_processors.length > 0 ? 'high' : 'medium'
  } else if (hasBridge) {
    proposed_mode = 'bridge'
    confidence = 'medium'
  } else if (hasDirect) {
    proposed_mode = 'direct'
    confidence = 'medium'
  } else {
    proposed_mode = 'unknown'
    confidence = 'low'
    review_reasons.push('insufficient_signal')
  }

  if (!record.website && record.social_links.length === 0) {
    review_reasons.push('missing_primary_reference')
  }

  if (record.website) {
    evidence_refs.push(record.website)
  }

  for (const social of record.social_links) {
    if (social.url) evidence_refs.push(social.url)
  }

  return {
    ...record,
    proposed_mode,
    confidence,
    review_reasons,
    evidence_refs,
  }
}
