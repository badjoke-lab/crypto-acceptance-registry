import { NextResponse } from 'next/server'
import { getRegistryV3Seeds } from '../../../lib/registry-v3-seeds'

export function GET() {
  const records = getRegistryV3Seeds()
  return NextResponse.json({
    total: records.length,
    records,
  })
}
