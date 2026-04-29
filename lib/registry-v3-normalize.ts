import type { RegistryRecordV3 } from '../scripts/export/types-v3'
import { normalizeRegistryRecordScope } from './registry-v3-scope-normalize'

function isBtcMapRecord(record: RegistryRecordV3): boolean {
  const program = record.supports_program_or_network?.toLowerCase() ?? ''
  return (
    record.registry_id.includes(':btcmap-place-') ||
    program.includes('btc map') ||
    record.notes.some((note) => note.includes('BTC Map place id:') || note.includes('OSM: https://www.openstreetmap.org/')) ||
    record.evidence_refs.some(
      (ref) => ref.url.includes('api.btcmap.org') || ref.publisher.toLowerCase().includes('btc map'),
    )
  )
}

function extractBtcMapPlaceId(registryId: string): string | null {
  return registryId.match(/:btcmap-place-([a-z0-9-]+)$/)?.[1] ?? null
}

function extractLatLon(notes: string[]): { lat: number | null; lng: number | null } {
  for (const note of notes) {
    const match = note.match(/^lat\/lon:\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i)
    if (match) return { lat: Number(match[1]), lng: Number(match[2]) }
  }
  return { lat: null, lng: null }
}

function extractAddressFull(notes: string[]): string | null {
  const prefixes = [
    'BTC Map address: ',
    'BTC Map legacy parsed city/address fragment: ',
    'BTC Map legacy parsed country/address fragment: ',
  ]
  for (const prefix of prefixes) {
    const note = notes.find((item) => item.startsWith(prefix))
    const value = note?.slice(prefix.length).trim()
    if (value) return value
  }
  return null
}

function hasUnusableBtcMapName(record: RegistryRecordV3): boolean {
  const name = record.display_name.trim().toLowerCase()
  return !name || name === 'unnamed'
}

export function normalizeRegistryRecordV3(record: RegistryRecordV3): RegistryRecordV3 {
  if (!isBtcMapRecord(record)) return normalizeRegistryRecordScope(record)

  const notesToAppend: string[] = []
  const placeId = extractBtcMapPlaceId(record.registry_id)
  if (placeId && !record.notes.some((note) => note.startsWith('BTC Map place id: '))) {
    notesToAppend.push(`BTC Map place id: ${placeId}`)
  }
  if (record.address.country) {
    notesToAppend.push(`BTC Map legacy parsed country/address fragment: ${record.address.country}`)
  }
  if (record.address.city) {
    notesToAppend.push(`BTC Map legacy parsed city/address fragment: ${record.address.city}`)
  }
  if (hasUnusableBtcMapName(record)) {
    notesToAppend.push('BTC Map record held for review because the source name is empty or Unnamed.')
  }

  const notes = [...record.notes, ...notesToAppend]
  const extractedGeo = extractLatLon(notes)
  const extractedAddress = extractAddressFull(notes)
  const holdForNameReview = hasUnusableBtcMapName(record)

  return {
    ...record,
    entity_type: 'physical_merchant',
    acceptance_type: holdForNameReview ? 'unknown' : record.acceptance_type,
    acceptance_scope: holdForNameReview ? 'unknown' : 'in_store',
    verification_target: 'BTC Map / OpenStreetMap physical merchant listing',
    coverage_region: 'BTC Map / OSM unmapped',
    address: {
      ...record.address,
      address_full: record.address.address_full ?? extractedAddress,
      city: null,
      country: null,
    },
    geo: {
      lat: record.geo.lat ?? extractedGeo.lat,
      lng: record.geo.lng ?? extractedGeo.lng,
    },
    notes,
  }
}
