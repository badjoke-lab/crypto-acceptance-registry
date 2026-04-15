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
  const chains = Object.entries(countBy(records.flatMap((record) => record.accepted_chains)))
    .sort((a, b) => b[1] - a[1])
    .map(([chain, count]) => ({ chain, count }))

  return NextResponse.json({
    total: chains.length,
    chains,
  })
}
