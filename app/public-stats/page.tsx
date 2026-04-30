import { getGeneratedProductStats } from '../../lib/generated-product-stats'

const SECTION_ORDER = [
  'recordHealthBreakdown',
  'modeBreakdown',
  'acceptanceTypeBreakdown',
  'acceptanceScopeBreakdown',
  'entityTypeBreakdown',
  'countryBreakdown',
  'cityBreakdown',
  'processorModeProcessorBreakdown',
  'noProcessorReasonBreakdown',
  'processorBreakdown',
  'confidenceBreakdown',
  'sourceOriginBreakdown',
  'verificationMethodBreakdown',
  'coverageRegionBreakdown',
  'scopeBreakdown',
  'supportRailTypeBreakdown',
  'supportRailLabelBreakdown',
  'evidenceKindBreakdown',
  'evidencePublisherBreakdown',
  'websitePresenceBreakdown',
  'geoPresenceBreakdown',
  'addressPresenceBreakdown',
  'evidenceCountBreakdown',
  'notesPresenceBreakdown',
  'duplicateDisplayNameSizeBreakdown',
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
  'duplicateDisplayNameGroups',
]

const SECTION_TITLES: Record<string, string> = {
  recordHealthBreakdown: 'Record Health Breakdown',
  processorModeProcessorBreakdown: 'Processor Breakdown (processor-mode records only)',
  noProcessorReasonBreakdown: 'No Processor Reason Breakdown',
  processorBreakdown: 'Processor Breakdown (legacy / all records)',
  duplicateDisplayNameGroups: 'Duplicate Display Name Groups (raw / not automatically an error)',
  duplicateDisplayNameRiskGroups: 'Duplicate Display Name Risk Groups',
}

const SECTION_DESCRIPTIONS: Record<string, string> = {
  recordHealthBreakdown: 'Primary health-check summary. total_health_issues should be 0 before continuing bulk additions.',
  processorModeProcessorBreakdown: 'Processor counts for records whose proposed mode is processor. Use this for actual processor distribution.',
  noProcessorReasonBreakdown: 'Explains records without a processor. Direct crypto records usually belong here and are not automatically malformed.',
  processorBreakdown: 'Legacy compatibility view across all records. Unknown includes valid direct crypto records without processors; do not treat this alone as an error.',
  duplicateDisplayNameGroups: 'Raw same-name groups kept visible for inspection. Chain locations, country-specific catalog entries, and multi-provider listings can be valid here.',
  duplicateDisplayNameRiskGroups: 'Narrow duplicate candidates after URL/location/program/evidence normalization. This should be 0 or reviewed.',
}

function titleize(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^./, (char) => char.toUpperCase())
}

function getSectionTitle(key: string): string {
  return SECTION_TITLES[key] ?? titleize(key)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function renderValue(value: unknown): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value)
}

function BreakdownList({ value }: { value: Record<string, unknown> }) {
  return (
    <ul>
      {Object.entries(value).map(([key, item]) => (
        <li key={key}>{key}: {renderValue(item)}</li>
      ))}
    </ul>
  )
}

function IssueList({ value }: { value: unknown[] }) {
  return (
    <ol>
      {value.map((item, index) => (
        <li key={index}>
          <code>{renderValue(item)}</code>
        </li>
      ))}
    </ol>
  )
}

function orderedEntries(stats: Record<string, unknown>): Array<[string, unknown]> {
  const seen = new Set<string>(['totalMerchants'])
  const ordered: Array<[string, unknown]> = []

  for (const key of SECTION_ORDER) {
    if (Object.prototype.hasOwnProperty.call(stats, key)) {
      ordered.push([key, stats[key]])
      seen.add(key)
    }
  }

  for (const [key, value] of Object.entries(stats)) {
    if (!seen.has(key)) ordered.push([key, value])
  }

  return ordered
}

export default function PublicStatsPage() {
  const stats = getGeneratedProductStats()
  const entries = orderedEntries(stats)

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <h1>Public Stats</h1>
      <p>Total merchants: {stats.totalMerchants}</p>
      <p>
        This page intentionally renders raw registry statistics and health-check outputs. It is used to detect malformed
        records, field drift, invalid country/city values, duplicate names, and inconsistent payment fields.
      </p>
      <p>
        The raw legacy processor breakdown is kept visible, but processor-mode records and no-processor reasons are split
        into separate sections so direct crypto records are not mistaken for malformed processor records.
      </p>

      {entries.map(([key, value]) => (
        <section key={key} style={{ marginTop: 28 }}>
          <h2>{getSectionTitle(key)}</h2>
          {SECTION_DESCRIPTIONS[key] ? <p>{SECTION_DESCRIPTIONS[key]}</p> : null}
          {Array.isArray(value) ? (
            value.length > 0 ? <IssueList value={value} /> : <p>None</p>
          ) : isPlainObject(value) ? (
            <BreakdownList value={value} />
          ) : (
            <p>{renderValue(value)}</p>
          )}
        </section>
      ))}
    </main>
  )
}
