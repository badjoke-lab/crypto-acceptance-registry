import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import type { LegacySocialLink, NormalizedCandidateRecord } from './types'

type RawPlace = {
  id?: string
  name?: string
  country?: string | null
  city?: string | null
  website?: string | null
  about?: string | null
  paymentNote?: string | null
  payment_note?: string | null
  accepted?: string[] | string | null
  preferred?: string[] | string | null
}

type RawPaymentAccept = {
  place_id?: string
  asset?: string | null
  chain?: string | null
  method?: string | null
  processor?: string | null
  note?: string | null
  is_preferred?: boolean | null
}

type RawSocial = {
  place_id?: string
  platform?: string
  url?: string | null
  handle?: string | null
}

type RawVerification = {
  place_id?: string
  status?: string | null
  level?: string | null
  last_checked?: string | null
  last_verified?: string | null
  evidence?: unknown
}

function readJsonArray<T>(filePath: string): T[] {
  if (!existsSync(filePath)) return []
  const raw = readFileSync(filePath, 'utf-8')
  const parsed = JSON.parse(raw)
  return Array.isArray(parsed) ? (parsed as T[]) : []
}

function uniqueNonEmpty(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.map((value) => (value ?? '').trim()).filter(Boolean))]
}

function normalizeList(input: string[] | string | null | undefined): string[] {
  if (!input) return []
  if (Array.isArray(input)) return uniqueNonEmpty(input)
  return uniqueNonEmpty(String(input).split(',').map((part) => part.trim()))
}

function extractEvidenceStrings(input: unknown): string[] {
  if (!input) return []
  if (typeof input === 'string') return uniqueNonEmpty([input])
  if (Array.isArray(input)) {
    return uniqueNonEmpty(input.flatMap((item) => extractEvidenceStrings(item)))
  }
  if (typeof input === 'object') {
    return uniqueNonEmpty(Object.values(input as Record<string, unknown>).flatMap((item) => extractEvidenceStrings(item)))
  }
  return []
}

function toSocial(row: RawSocial): LegacySocialLink | null {
  if (!row.platform) return null
  return {
    platform: row.platform,
    url: row.url ?? null,
    handle: row.handle ?? null,
  }
}

const inboxDir = path.join(process.cwd(), 'data', 'inbox')
const outFile = path.join(process.cwd(), 'data', 'normalized-candidates-v3.json')

const places = readJsonArray<RawPlace>(path.join(inboxDir, 'places.json'))
const paymentAccepts = readJsonArray<RawPaymentAccept>(path.join(inboxDir, 'payment_accepts.json'))
const socials = readJsonArray<RawSocial>(path.join(inboxDir, 'socials.json'))
const verifications = readJsonArray<RawVerification>(path.join(inboxDir, 'verifications.json'))

const normalized: NormalizedCandidateRecord[] = places
  .filter((place): place is Required<Pick<RawPlace, 'id' | 'name'>> & RawPlace => Boolean(place.id && place.name))
  .map((place) => {
    const placeId = place.id as string
    const placePaymentAccepts = paymentAccepts.filter((row) => row.place_id === placeId)
    const placeSocials = socials
      .filter((row) => row.place_id === placeId)
      .map(toSocial)
      .filter((row): row is LegacySocialLink => Boolean(row))
    const verification = verifications.find((row) => row.place_id === placeId)

    const acceptedAssets = uniqueNonEmpty([
      ...placePaymentAccepts.map((row) => row.asset),
      ...normalizeList(place.accepted),
      ...normalizeList(place.preferred),
    ])

    const acceptedChains = uniqueNonEmpty(placePaymentAccepts.map((row) => row.chain))
    const paymentMethods = uniqueNonEmpty(placePaymentAccepts.map((row) => row.method))
    const paymentProcessors = uniqueNonEmpty(placePaymentAccepts.map((row) => row.processor))
    const verificationEvidence = extractEvidenceStrings(verification?.evidence)
    const paymentNotes = uniqueNonEmpty([
      ...placePaymentAccepts.map((row) => row.note),
      place.paymentNote,
      place.payment_note,
      place.about,
      ...verificationEvidence,
    ])

    const verificationParts = uniqueNonEmpty([
      verification?.level,
      verification?.status,
    ])

    return {
      legacy_id: placeId,
      display_name: place.name.trim(),
      country: place.country?.trim() || null,
      city: place.city?.trim() || null,
      website: place.website?.trim() || null,
      verification_status: verificationParts.join(':') || null,
      accepted_assets: acceptedAssets,
      accepted_chains: acceptedChains,
      payment_methods: paymentMethods,
      payment_processors: paymentProcessors,
      payment_notes: paymentNotes,
      social_links: placeSocials,
    }
  })

writeFileSync(outFile, JSON.stringify(normalized, null, 2), 'utf-8')
console.log(`normalized candidates v3: ${normalized.length}`)
