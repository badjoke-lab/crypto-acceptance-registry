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
  const cityKeys = records.map((record) => [record.city, record.country].filter(Boolean).join(', ') || 'Unknown')
  const cities = Object.entries(countBy(cityKeys))
    .sort((a, b) => b[1] - a[1])
    .map(([city, count]) => ({ city, count }))

  return NextResponse.json({
    total: cities.length,
    cities,
  })
}
