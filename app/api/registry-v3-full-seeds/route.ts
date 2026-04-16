import { NextResponse } from 'next/server'
import { getRegistryV3FullSeeds } from '../../../lib/registry-v3-full-seeds'

export function GET() {
  const records = getRegistryV3FullSeeds()
  return NextResponse.json({
    total: records.length,
    records,
  })
}
