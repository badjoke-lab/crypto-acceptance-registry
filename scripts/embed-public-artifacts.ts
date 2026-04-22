import fs from 'node:fs'

const jobs: Array<[string, string, string]> = [
  ['data/product-merchants.json', 'lib/generated-product-merchants-data.ts', 'generatedProductMerchantsData'],
  ['data/review-queue.json', 'lib/generated-review-queue-data.ts', 'generatedReviewQueueData'],
  ['data/product-stats.json', 'lib/generated-product-stats-data.ts', 'generatedProductStatsData'],
  ['data/cutover-report.json', 'lib/generated-cutover-report-data.ts', 'generatedCutoverReportData'],
]

for (const [src, out, name] of jobs) {
  const data = JSON.parse(fs.readFileSync(src, 'utf8'))
  fs.writeFileSync(
    out,
    `export const ${name} = ${JSON.stringify(data, null, 2)}\n`,
    'utf8'
  )
  console.log(`Wrote ${out}`)
}
