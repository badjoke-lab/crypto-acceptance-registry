import { NextResponse } from 'next/server'
import records from '../../../data/registry-v2-seeds.json'

export function GET() {
  return NextResponse.json({
    total: records.length,
    records,
  })
}
