import type { LegacyPlaceRecord, NormalizedCandidateRecord } from './types'

function uniqueNonEmpty(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.map((value) => (value ?? '').trim()).filter(Boolean))]
}

export function normalizeLegacyPlace(record: LegacyPlaceRecord): NormalizedCandidateRecord {
  return {
    legacy_id: record.legacy_id,
    display_name: record.name.trim(),
    country: record.country?.trim() || null,
    city: record.city?.trim() || null,
    website: record.website?.trim() || null,
    verification_status: record.verification_status?.trim() || null,
    accepted_assets: uniqueNonEmpty(record.accepted_assets),
    accepted_chains: uniqueNonEmpty(record.accepted_chains),
    payment_methods: uniqueNonEmpty(record.payment_accepts.map((item) => item.method)),
    payment_processors: uniqueNonEmpty(record.payment_accepts.map((item) => item.processor)),
    payment_notes: uniqueNonEmpty([
      ...record.payment_accepts.map((item) => item.note),
      ...record.notes,
    ]),
    social_links: record.socials,
  }
}
