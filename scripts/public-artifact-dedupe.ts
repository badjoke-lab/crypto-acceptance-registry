import type { ClassifiedCandidateRecord } from './export/types'

function valueKey(value: string | null | undefined): string {
  return value?.trim().toLowerCase() || 'none'
}

function listKey(values: string[]): string {
  return [...new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean))].sort().join('|') || 'none'
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

function duplicateSignature(record: ClassifiedCandidateRecord): string {
  return [
    valueKey(record.display_name),
    valueKey(record.country),
    valueKey(record.city),
    valueKey(record.website),
    record.proposed_mode,
    listKey(record.evidence_refs),
    listKey(record.payment_processors),
    listKey(record.accepted_assets),
    listKey(record.accepted_chains),
  ].join('::')
}

export function dedupeClassifiedByDuplicateSignature(records: ClassifiedCandidateRecord[]): ClassifiedCandidateRecord[] {
  const bySignature = new Map<string, ClassifiedCandidateRecord>()

  for (const record of records) {
    const signature = duplicateSignature(record)
    const existing = bySignature.get(signature)
    if (!existing || candidateQualityScore(record) > candidateQualityScore(existing)) {
      bySignature.set(signature, record)
    }
  }

  return [...bySignature.values()]
}
