import fs from 'node:fs'
import path from 'node:path'

type BtcMapPlace = {
  id: number | string
  name?: string | null
  lat?: number | null
  lon?: number | null
  address?: string | null
  website?: string | null
  updated_at?: string | null
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
const PAGE_LIMIT = Number(process.argv[4] ?? '250')
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

function cleanWebsite(website: string | null | undefined): string | null {
  if (!website) return null
  if (!/^https?:\/\//i.test(website)) return null
  return website
}

function getExistingBtcMapPlaceIds(): Set<string> {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) return new Set()

  const used = new Set<string>()
  for (const filename of fs.readdirSync(dataDir)) {
    if (!/^registry-v2-seeds-batch-\d+\.json$/.test(filename)) continue
    const filepath = path.join(dataDir, filename)
    try {
      const parsed = JSON.parse(fs.readFileSync(filepath, 'utf8')) as { entries?: Array<{ id?: string; notes?: string[] }> }
      for (const entry of parsed.entries ?? []) {
        const idMatch = entry.id?.match(/:btcmap-place-([a-z0-9-]+)$/)
        if (idMatch?.[1]) used.add(idMatch[1])
        for (const note of entry.notes ?? []) {
          const noteMatch = note.match(/BTC Map place id: ([^\s]+)/)
          if (noteMatch?.[1]) used.add(slugify(noteMatch[1]))
        }
      }
    } catch {
      // Non-compact or malformed files are ignored here; the public build remains the authoritative validator.
    }
  }
  return used
}

function toEntry(place: BtcMapPlace) {
  const name = place.name?.trim()
  if (!name) return null
  const placeId = String(place.id).trim()
  if (!placeId) return null
  const osmUrl = place.osm_url || (place.osm_id ? `https://www.openstreetmap.org/${place.osm_id.replace(':', '/')}` : null)
  const verified = place.verified_at ? `BTC Map verified_at: ${place.verified_at}` : 'BTC Map place entry has no verified_at value in selected fields.'
  const updated = place.updated_at ? `BTC Map updated_at: ${place.updated_at}` : null
  const address = place.address ? `BTC Map address: ${place.address}` : null
  const provider = place.payment_provider ? `payment_provider: ${place.payment_provider}` : null
  const latLon = typeof place.lat === 'number' && typeof place.lon === 'number' ? `lat/lon: ${place.lat}, ${place.lon}` : null

  return {
    id: `merchant:${slugify(name)}:btcmap-place-${slugify(placeId)}`,
    name,
    source: 'btcmap-v4-places',
    website: cleanWebsite(place.website),
    country: null,
    city: null,
    explicit_support: `${name} is listed in BTC Map as a physical place that accepts Bitcoin.`,
    notes: [`BTC Map place id: ${placeId}`, verified, updated, address, osmUrl ? `OSM: ${osmUrl}` : null, provider, latLon].filter(
      (item): item is string => Boolean(item),
    ),
  }
}

async function fetchPlaces(updatedSince: string, fields: string): Promise<{ url: string; places: BtcMapPlace[] }> {
  const url = `https://api.btcmap.org/v4/places?fields=${encodeURIComponent(fields)}&updated_since=${encodeURIComponent(
    updatedSince,
  )}&limit=${PAGE_LIMIT}`
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'crypto-acceptance-registry seed generator',
    },
  })

  if (!response.ok) {
    throw new Error(`BTC Map API request failed: ${response.status} ${response.statusText}`)
  }

  return { url, places: (await response.json()) as BtcMapPlace[] }
}

async function main() {
  const fields = [
    'id',
    'name',
    'lat',
    'lon',
    'address',
    'website',
    'updated_at',
    'verified_at',
    'osm_id',
    'osm_url',
    'payment_provider',
  ].join(',')

  const usedPlaceIds = getExistingBtcMapPlaceIds()
  const entries: CompactBatch['entries'] = []
  const seenInRun = new Set<string>()
  let updatedSince = '1970-01-01T00:00:00Z'
  let sourceUrl = ''

  for (let page = 0; page < 80 && entries.length < TARGET_COUNT; page++) {
    const { url, places } = await fetchPlaces(updatedSince, fields)
    sourceUrl ||= url
    if (!places.length) break

    for (const place of places) {
      const placeId = slugify(String(place.id))
      if (usedPlaceIds.has(placeId) || seenInRun.has(placeId)) continue
      const entry = toEntry(place)
      if (!entry) continue
      entries.push(entry)
      seenInRun.add(placeId)
      if (entries.length === TARGET_COUNT) break
    }

    const updatedValues = places
      .map((place) => place.updated_at)
      .filter((value): value is string => Boolean(value))
      .sort()
    const nextUpdatedSince = updatedValues.at(-1)
    if (!nextUpdatedSince || nextUpdatedSince === updatedSince) break
    updatedSince = nextUpdatedSince
  }

  if (entries.length !== TARGET_COUNT) {
    throw new Error(`Expected ${TARGET_COUNT} usable entries, got ${entries.length}. Refine source window before committing.`)
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
        url: sourceUrl || 'https://api.btcmap.org/v4/places',
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
