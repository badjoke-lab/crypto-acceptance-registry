import { readFileSync, writeFileSync } from 'node:fs'

type RawVerification = {
  place_id?: string
  level?: string | null
  status?: string | null
  evidence?: unknown
}

type RawSocial = {
  place_id?: string
  platform?: string | null
  url?: string | null
  handle?: string | null
}

const URL_RE = /https?:\/\/[^\s"'<>]+/gi

function readJsonArray<T>(filePath: string): T[] {
  const raw = readFileSync(filePath, 'utf-8')
  const parsed = JSON.parse(raw)
  return Array.isArray(parsed) ? (parsed as T[]) : []
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

function extractUrls(input: unknown): string[] {
  if (!input) return []
  if (typeof input === 'string') return input.match(URL_RE) ?? []
  if (Array.isArray(input)) return input.flatMap((item) => extractUrls(item))
  if (typeof input === 'object') return Object.values(input as Record<string, unknown>).flatMap((item) => extractUrls(item))
  return []
}

function evidenceShape(input: unknown): string {
  if (input == null) return 'null'
  if (Array.isArray(input)) return 'array'
  return typeof input
}

const verifications = readJsonArray<RawVerification>('data/inbox/verifications.json')
const socials = readJsonArray<RawSocial>('data/inbox/socials.json')

const verificationShapeBreakdown = countBy(verifications.map((row) => evidenceShape(row.evidence)))
const verificationUrlCountBreakdown = countBy(
  verifications.map((row) => {
    const n = extractUrls(row.evidence).length
    if (n === 0) return '0'
    if (n === 1) return '1'
    if (n <= 3) return '2-3'
    return '4+'
  }),
)
const verificationLevelBreakdown = countBy(verifications.map((row) => row.level ?? 'null'))
const socialPlatformBreakdown = countBy(socials.map((row) => row.platform ?? 'null'))
const socialUrlPresenceBreakdown = countBy(socials.map((row) => (row.url ? 'with_url' : 'no_url')))
const socialHandlePresenceBreakdown = countBy(socials.map((row) => (row.handle ? 'with_handle' : 'no_handle')))

const evidenceSamples = verifications
  .filter((row) => extractUrls(row.evidence).length === 0 && row.evidence != null)
  .slice(0, 20)
  .map((row) => ({
    place_id: row.place_id,
    level: row.level,
    status: row.status,
    evidence_shape: evidenceShape(row.evidence),
    evidence_preview: typeof row.evidence === 'string'
      ? row.evidence.slice(0, 300)
      : JSON.stringify(row.evidence).slice(0, 300),
  }))

const report = {
  verifications: {
    total: verifications.length,
    verificationShapeBreakdown,
    verificationUrlCountBreakdown,
    verificationLevelBreakdown,
  },
  socials: {
    total: socials.length,
    socialPlatformBreakdown,
    socialUrlPresenceBreakdown,
    socialHandlePresenceBreakdown,
  },
  evidenceSamples,
}

writeFileSync('data/evidence-audit.json', JSON.stringify(report, null, 2), 'utf-8')
console.log(JSON.stringify(report, null, 2))
