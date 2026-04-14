import { readFileSync, writeFileSync } from 'node:fs'
import type { ClassifiedCandidateRecord } from '../export/types'

const classifiedRaw = readFileSync('data/classified-candidates.json', 'utf-8')
const classified = JSON.parse(classifiedRaw) as ClassifiedCandidateRecord[]

const reviewRaw = readFileSync('data/review-queue.json', 'utf-8')
const reviewQueue = JSON.parse(reviewRaw) as ClassifiedCandidateRecord[]

const reviewIds = new Set(reviewQueue.map((record) => record.legacy_id))

const ready = classified.filter((record) => !reviewIds.has(record.legacy_id))
const pending = classified.filter((record) => reviewIds.has(record.legacy_id))

writeFileSync('data/ready-merchants.json', JSON.stringify(ready, null, 2), 'utf-8')
writeFileSync('data/pending-merchants.json', JSON.stringify(pending, null, 2), 'utf-8')

console.log(`ready merchants: ${ready.length}`)
console.log(`pending merchants: ${pending.length}`)
