import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { normalizeLegacyPlace } from './normalize'
import type { LegacyPaymentAccept, LegacyPlaceRecord, LegacySocialLink, LegacyVerification } from './types'

type RawPlace = {
  id?: string
  name?: string
  country?: string | null
  city?: string | null
  website?: string | null
  about?: string | null
  paymentNote?: string | null
}

type RawPaymentAccept = {
  place_id?: string
  asset?: string | null
  chain?: string | null
  method?: string | null
  processor?: string | null
  note?: string | null
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
  last_checked?: string | null
  last_verified?: string | null
}

function readJsonArray<T>(filePath: string): T[] {
  if (!existsSync(filePath)) return []
  const raw = readFileSync(filePath, 'utf-8')
  const parsed = JSON.parse(raw)
  return Array.isArray(parsed) ? (parsed as T[]) : []
}

function toLegacySocialLink(row: RawSocial): LegacySocialLink | null {
  if (!row.platform) return null
  return {
    platform: row.platform,
    url: row.url ?? null,
    handle: row.handle ?? null,
  }
}

function toLegacyVerification(row: RawVerification): LegacyVerification {
  return {
    status: row.status ?? null,
    last_checked: row.last_checked ?? null,
    last_verified: row.last_verified ?? null,
  }
}

function toLegacyPaymentAccept(row: RawPaymentAccept): LegacyPaymentAccept {
  return {
    asset: row.asset ?? null,
    chain: row.chain ?? null,
    method: row.method ?? null,
    processor: row.processor ?? null,
    note: row.note ?? null,
  }
}

function buildLegacyPlaceRecords(
  places: RawPlace[],
  paymentAccepts: RawPaymentAccept[],
  socials: RawSocial[],
  verifications: RawVerification[],
): LegacyPlaceRecord[] {
  return places
    .filter((place): place is Required<Pick<RawPlace, 'id' | 'name'>> & RawPlace => Boolean(place.id && place.name))
    .map((place) => {
      const placeId = place.id as string
      const placePaymentAccepts = paymentAccepts
        .filter((row) => row.place_id === placeId)
        .map(toLegacyPaymentAccept)

      const placeSocials = socials
        .filter((row) => row.place_id === placeId)
        .map(toLegacySocialLink)
        .filter((row): row is LegacySocialLink => Boolean(row))

      const verification = verifications.find((row) => row.place_id === placeId)
      const legacyVerification = verification ? toLegacyVerification(verification) : null

      const acceptedAssets = [...new Set(placePaymentAccepts.map((row) => row.asset).filter(Boolean) as string[])]
      const acceptedChains = [...new Set(placePaymentAccepts.map((row) => row.chain).filter(Boolean) as string[])]

      const notes = [place.about, place.paymentNote].filter(Boolean) as string[]

      return {
        legacy_id: placeId,
        name: place.name as string,
        country: place.country ?? null,
        city: place.city ?? null,
        website: place.website ?? null,
        verification_status: legacyVerification?.status ?? null,
        accepted_assets: acceptedAssets,
        accepted_chains: acceptedChains,
        payment_accepts: placePaymentAccepts,
        socials: placeSocials,
        notes,
      }
    })
}

const inboxDir = path.join(process.cwd(), 'data', 'inbox')
const outFile = path.join(process.cwd(), 'data', 'normalized-candidates.json')

const places = readJsonArray<RawPlace>(path.join(inboxDir, 'places.json'))
const paymentAccepts = readJsonArray<RawPaymentAccept>(path.join(inboxDir, 'payment_accepts.json'))
const socials = readJsonArray<RawSocial>(path.join(inboxDir, 'socials.json'))
const verifications = readJsonArray<RawVerification>(path.join(inboxDir, 'verifications.json'))

const legacyRecords = buildLegacyPlaceRecords(places, paymentAccepts, socials, verifications)
const normalized = legacyRecords.map(normalizeLegacyPlace)

writeFileSync(outFile, JSON.stringify(normalized, null, 2), 'utf-8')
console.log(`normalized candidates: ${normalized.length}`)
