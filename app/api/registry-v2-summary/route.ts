import { NextResponse } from 'next/server'
import records from '../../../data/registry-v2-seeds.json'

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

export function GET() {
  const acceptanceTypeBreakdown = countBy(records.map((record) => record.acceptance_type))
  const countryBreakdown = countBy(records.map((record) => record.country || 'Unknown'))
  const programBreakdown = countBy(records.map((record) => record.supports_program_or_network || 'Unknown'))
  const sourceOriginBreakdown = countBy(records.map((record) => record.source_origin))

  return NextResponse.json({
    total: records.length,
    acceptanceTypeBreakdown,
    countryBreakdown,
    programBreakdown,
    sourceOriginBreakdown,
  })
}
