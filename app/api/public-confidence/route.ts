import { NextResponse } from 'next/server'
import { getGeneratedProductMerchants } from '../../../lib/generated-product-data'

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

export function GET() {
  const records = getGeneratedProductMerchants()
  const confidence = Object.entries(countBy(records.map((record) => record.confidence)))
    .sort((a, b) => b[1] - a[1])
    .map(([level, count]) => ({ level, count }))

  return NextResponse.json({
    total: confidence.length,
    confidence,
  })
}
