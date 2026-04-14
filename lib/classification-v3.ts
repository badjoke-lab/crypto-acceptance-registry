import type { ClassifiedCandidateRecord, ConfidenceLevel, NormalizedCandidateRecord } from '../scripts/export/types'

const BRIDGE_TERMS = ['card', 'visa', 'mastercard', 'rakuten cash', 'rakuten pay', 'wallet conversion', 'fiat conversion']
const PROCESSOR_TERMS = ['bitpay', 'opennode', 'binance pay', 'coinbase commerce', 'btcpay']
const DIRECT_TERMS = ['lightning', 'invoice', 'wallet address', 'on-chain', 'qr', 'btc', 'eth', 'usdt', 'xrp']
const URL_RE = /https?:\/\/[^\s"'<>]+/gi

function blob(record: NormalizedCandidateRecord): string {
  return [
    record.website,
    record.verification_status,
    ...record.accepted_assets,
    ...record.accepted_chains,
    ...record.payment_methods,
    ...record.payment_processors,
    ...record.payment_notes,
    ...record.social_links.flatMap((item) => [item.platform, item.url ?? '', item.handle ?? '']),
  ].join(' ').toLowerCase()
}

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term))
}

function extractUrls(values: string[]): string[] {
  const found = values.flatMap((value) => value.match(URL_RE) ?? [])
  return [...new Set(found)]
}

export function classifyCandidateV3(record: NormalizedCandidateRecord): ClassifiedCandidateRecord {
  const text = blob(record)
  const noteUrls = extractUrls(record.payment_notes)
  const evidence_refs = [
    ...(record.website ? [record.website] : []),
    ...record.social_links.map((item) => item.url).filter((value): value is string => Boolean(value)),
    ...noteUrls,
  ]

  const review_reasons: string[] = []
  const hasBridge = includesAny(text, BRIDGE_TERMS)
  const hasProcessor = record.payment_processors.length > 0 || includesAny(text, PROCESSOR_TERMS)
  const hasDirectSignal = includesAny(text, DIRECT_TERMS)
  const hasAssets = record.accepted_assets.length > 0 || record.accepted_chains.length > 0
  const hasEvidence = evidence_refs.length > 0
  const hasVerificationLevel = /owner|community|directory|unverified/.test((record.verification_status || '').toLowerCase())

  let proposed_mode: ClassifiedCandidateRecord['proposed_mode'] = 'unknown'
  let confidence: ConfidenceLevel = 'low'

  if (hasBridge && hasProcessor) {
    proposed_mode = 'unknown'
    confidence = 'low'
    review_reasons.push('bridge_processor_conflict')
  } else if (hasProcessor) {
    proposed_mode = 'processor'
    confidence = hasEvidence ? 'high' : 'medium'
  } else if (hasBridge) {
    proposed_mode = 'bridge'
    confidence = hasEvidence ? 'medium' : 'low'
  } else if (hasAssets || hasDirectSignal) {
    proposed_mode = 'direct'
    confidence = hasEvidence && hasVerificationLevel ? 'high' : 'medium'
  } else {
    proposed_mode = 'unknown'
    confidence = 'low'
    review_reasons.push('insufficient_signal')
  }

  if (!hasEvidence) {
    review_reasons.push('missing_reference')
  }

  return {
    ...record,
    proposed_mode,
    confidence,
    review_reasons,
    evidence_refs,
  }
}
