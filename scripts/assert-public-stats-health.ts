import fs from 'node:fs'
import path from 'node:path'

const STATS_PATH = path.join(process.cwd(), 'data/product-stats.json')

const REQUIRED_ZERO_ARRAY_KEYS = [
  'invalidCountryValues',
  'invalidCityValues',
  'btcMapEntriesWithCountryOrCity',
  'btcMapEntriesWithoutPlaceIdNote',
  'recordsWithEmptyDisplayName',
  'recordsWithUnnamedName',
  'recordsWithoutEvidence',
  'recordsWithoutSupportRails',
  'recordsWithUnknownAcceptanceType',
  'recordsWithUnknownAcceptanceScope',
  'recordsWithOnlineServiceButGeo',
  'recordsWithPhysicalMerchantButNoGeo',
  'recordsWithProcessorModeButNoProcessorRail',
  'recordsWithDirectCryptoButProcessorOnlyRail',
  'duplicateRegistryIds',
  'duplicateDisplayNameRiskGroups',
] as const

function readStats(): Record<string, unknown> {
  if (!fs.existsSync(STATS_PATH)) {
    throw new Error(`Missing stats file: ${STATS_PATH}`)
  }

  return JSON.parse(fs.readFileSync(STATS_PATH, 'utf8')) as Record<string, unknown>
}

function getNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function getArrayLength(stats: Record<string, unknown>, key: string): number | null {
  const value = stats[key]
  return Array.isArray(value) ? value.length : null
}

function main() {
  const stats = readStats()
  const failures: string[] = []

  const totalMerchants = getNumber(stats.totalMerchants)
  if (totalMerchants === null || totalMerchants <= 0) {
    failures.push(`totalMerchants must be a positive number, got ${String(stats.totalMerchants)}`)
  }

  const health = stats.recordHealthBreakdown
  if (!health || typeof health !== 'object' || Array.isArray(health)) {
    failures.push('recordHealthBreakdown is missing or invalid')
  } else {
    const totalHealthIssues = getNumber((health as Record<string, unknown>).total_health_issues)
    if (totalHealthIssues !== 0) {
      failures.push(`recordHealthBreakdown.total_health_issues must be 0, got ${String(totalHealthIssues)}`)
    }
  }

  for (const key of REQUIRED_ZERO_ARRAY_KEYS) {
    const length = getArrayLength(stats, key)
    if (length === null) {
      failures.push(`${key} must be present as an array`)
    } else if (length !== 0) {
      failures.push(`${key} must be empty, got ${length}`)
    }
  }

  if (failures.length > 0) {
    console.error('Public stats health gate failed:')
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }

  console.log('Public stats health gate passed.')
  console.log(`totalMerchants: ${totalMerchants}`)
  console.log('recordHealthBreakdown.total_health_issues: 0')
}

main()
