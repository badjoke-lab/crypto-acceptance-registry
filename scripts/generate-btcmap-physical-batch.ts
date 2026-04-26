import fs from 'node:fs'
import path from 'node:path'

type BtcMapPlace = {
  id: number | string
  name?: string | null
  lat?: number | null
  lon?: number | null
  address?: string | null
  website?: string | null
  verified_at?: string | null
  osm_id?: string | null
  osm_url?: string | null
  payment_provider?: string | null
}

type CompactBatch = {
  format: 'compact-registry-v2-seed-batch-v1'
  verified_at: string
  defaults: {
    scope: 'merchant'
    acceptance_type: 'direct_crypto'
    supports_program_or_network: 'BTC Map / OpenStreetMap'
    confidence: 'low' | 'medium'
    evidence_kind: 'official_store_locator'
    evidence_publisher: 'BTC Map / OpenStreetMap contributors'
    source_origin: 'community_seed'
    support_rails: Array<{ rail_id: string; rail_type: 'asset' | 'chain'; label: string }>
    notes: string[]
  }
  sources: Record<string, { label: string; url: string; publisher: string; kind: 'official_store_locator' }>
  entries: Array<{
    id: string
    name: string
    source: string
    website?: string | null
    country?: string | null
    city?: string | null
    explicit_support: string
    notes: string[]
  }>
}

const BATCH_NO = Number(process.argv[2] ?? '40')
const TARGET_COUNT = Number(process.argv[3] ?? '100')
const OUT_PATH = path.join(process.cwd(), `data/registry-v2-seeds-batch-${BATCH_NO}.json`)

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function parseAddress(address: string | null | undefined): { country: string | null; city: string | null } {
  if (!address) return { country: null, city: null }
  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  if (parts.length < 2) return { country: null, city: parts[0] ?? null }
  return {
    city: parts.length >= 3 ? parts[parts.length - 3] : parts[0] ?? null,
    country: parts[parts.length - 1] ?? null,
  }
}

function cleanWebsite(website: string | null | undefined): string | null {
  if (!website) return null
  if (!/^https?:\/\//i.test(website)) return null
  return website
}

function toEntry(place: BtcMapPlace) {
  const name = place.name?.trim()
  if (!name) return null
  const placeId = String(place.id).trim()
  if (!placeId) return null
  const { country, city } = parseAddress(place.address)
  const osmUrl = place.osm_url || (place.osm_id ? `https://www.openstreetmap.org/${place.osm_id.replace(':', '/')}` : null)
  const verified = place.verified_at ? `BTC Map verified_at: ${place.verified_at}` : 'BTC Map place entry has no verified_at value in selected fields.'
  const provider = place.payment_provider ? `payment_provider: ${place.payment_provider}` : null
  const latLon = typeof place.lat === 'number' && typeof place.lon === 'number' ? `lat/lon: ${place.lat}, ${place.lon}` : null

  return {
    id: `merchant:${slugify(name)}:btcmap-place-${slugify(placeId)}`,
    name,
    source: 'btcmap-v4-places',
    website: cleanWebsite(place.website),
    country,
    city,
    explicit_support: `${name} is listed in BTC Map as a physical place that accepts Bitcoin.`,
    notes: [verified, osmUrl ? `OSM: ${osmUrl}` : null, provider, latLon].filter((item): item is string => Boolean(item)),
  }
}

async function main() {
  const fields = [
    'id',
    'name',
    'lat',
    'lon',
    'address',
    'website',
    'verified_at',
    'osm_id',
    'osm_url',
    'payment_provider',
  ].join(',')
  const url = `https://api.btcmap.org/v4/places?fields=${encodeURIComponent(fields)}&limit=${TARGET_COUNT}`
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'crypto-acceptance-registry seed generator',
    },
  })

  if (!response.ok) {
    throw new Error(`BTC Map API request failed: ${response.status} ${response.statusText}`)
  }

  const places = (await response.json()) as BtcMapPlace[]
  const entries = places.map(toEntry).filter((entry): entry is NonNullable<ReturnType<typeof toEntry>> => Boolean(entry))

  if (entries.length !== TARGET_COUNT) {
    throw new Error(`Expected ${TARGET_COUNT} usable entries, got ${entries.length}. Refine fields/source before committing.`)
  }

  const batch: CompactBatch = {
    format: 'compact-registry-v2-seed-batch-v1',
    verified_at: new Date().toISOString().slice(0, 10),
    defaults: {
      scope: 'merchant',
      acceptance_type: 'direct_crypto',
      supports_program_or_network: 'BTC Map / OpenStreetMap',
      confidence: 'low',
      evidence_kind: 'official_store_locator',
      evidence_publisher: 'BTC Map / OpenStreetMap contributors',
      source_origin: 'community_seed',
      support_rails: [
        { rail_id: 'asset:bitcoin', rail_type: 'asset', label: 'Bitcoin' },
        { rail_id: 'chain:lightning', rail_type: 'chain', label: 'Lightning Network' },
      ],
      notes: [
        'BTC Map is powered by OpenStreetMap/community-maintained location data.',
        'Physical/local merchant seed; verify merchant-side evidence before raising confidence.',
      ],
    },
    sources: {
      'btcmap-v4-places': {
        label: 'BTC Map REST API v4 places',
        url,
        publisher: 'BTC Map / OpenStreetMap contributors',
        kind: 'official_store_locator',
      },
    },
    entries,
  }

  fs.writeFileSync(OUT_PATH, `${JSON.stringify(batch)}\n`, 'utf8')
  console.log(`Wrote ${OUT_PATH}`)
  console.log(`entries: ${entries.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
