import { writeFileSync } from 'node:fs'
import { normalizeLegacyPlace } from './normalize'
import type { LegacyPlaceRecord } from './types'

// Placeholder seed input until legacy CPM export is wired in.
const seed: LegacyPlaceRecord[] = []

const normalized = seed.map(normalizeLegacyPlace)

writeFileSync(
  'data/normalized-candidates.json',
  JSON.stringify(normalized, null, 2),
  'utf-8',
)

console.log(`normalized candidates: ${normalized.length}`)
