import { readFileSync, writeFileSync } from 'node:fs'
import { classifyCandidateV3 } from '../../lib/classification-v3'
import type { NormalizedCandidateRecord } from '../export/types'

const raw = readFileSync('data/normalized-candidates-v3.json', 'utf-8')
const records = JSON.parse(raw) as NormalizedCandidateRecord[]

const classified = records.map(classifyCandidateV3)

writeFileSync(
  'data/classified-candidates-v3.json',
  JSON.stringify(classified, null, 2),
  'utf-8',
)

console.log(`classified candidates v3: ${classified.length}`)
