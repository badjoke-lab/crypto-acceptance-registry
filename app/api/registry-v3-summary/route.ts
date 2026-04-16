import { NextResponse } from 'next/server'
import { getRegistryV3Seeds } from '../../../lib/registry-v3-seeds'

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

export function GET() {
  const records = getRegistryV3Seeds()
  return NextResponse.json({
    total: records.length,
    acceptanceTypeBreakdown: countBy(records.map((r) => r.acceptance_type)),
    acceptanceScopeBreakdown: countBy(records.map((r) => r.acceptance_scope)),
    entityTypeBreakdown: countBy(records.map((r) => r.entity_type)),
    countryBreakdown: countBy(records.map((r) => r.address.country || 'Unknown')),
    sourceOriginBreakdown: countBy(records.map((r) => r.source_origin)),
  })
}
