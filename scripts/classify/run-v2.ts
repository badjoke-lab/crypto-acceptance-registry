import { readFileSync, writeFileSync } from 'node:fs'
import { classifyCandidateV2 } from '../../lib/classification-v2'
import type { NormalizedCandidateRecord } from '../export/types'

const raw = readFileSync('data/normalized-candidates-v2.json', 'utf-8')
const records = JSON.parse(raw) as NormalizedCandidateRecord[]

const classified = records.map(classifyCandidateV2)

writeFileSync(
  'data/classified-candidates-v2.json',
  JSON.stringify(classified, null, 2),
  'utf-8',
)

console.log(`classified candidates v2: ${classified.length}`)
