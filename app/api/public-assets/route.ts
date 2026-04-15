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
  const assets = Object.entries(countBy(records.flatMap((record) => record.accepted_assets)))
    .sort((a, b) => b[1] - a[1])
    .map(([asset, count]) => ({ asset, count }))

  return NextResponse.json({
    total: assets.length,
    assets,
  })
}
