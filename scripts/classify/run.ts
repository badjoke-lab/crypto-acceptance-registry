import { readFileSync, writeFileSync } from 'node:fs'
import { classifyCandidate } from '../../lib/classification'
import type { NormalizedCandidateRecord } from '../export/types'

const raw = readFileSync('data/normalized-candidates.json', 'utf-8')
const records = JSON.parse(raw) as NormalizedCandidateRecord[]

const classified = records.map(classifyCandidate)

writeFileSync(
  'data/classified-candidates.json',
  JSON.stringify(classified, null, 2),
  'utf-8',
)

console.log(`classified candidates: ${classified.length}`)
