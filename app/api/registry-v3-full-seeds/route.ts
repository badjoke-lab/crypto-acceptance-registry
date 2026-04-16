import { NextResponse } from 'next/server'
import { getRegistryV3FullerSeeds } from '../../../lib/registry-v3-fuller-seeds'

export function GET() {
  const records = getRegistryV3FullerSeeds()
  return NextResponse.json({
    total: records.length,
    records,
  })
}
