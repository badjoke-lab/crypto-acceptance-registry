import { NextResponse } from 'next/server'
import { getGeneratedCutoverReport } from '../../../lib/generated-cutover-report'

export function GET() {
  return NextResponse.json(getGeneratedCutoverReport())
}
