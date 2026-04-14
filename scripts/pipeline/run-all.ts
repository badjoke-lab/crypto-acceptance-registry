import { spawnSync } from 'node:child_process'

const steps = [
  ['node', ['scripts/export/validate-inbox.ts']],
  ['node', ['scripts/export/from-inbox-json.ts']],
  ['node', ['scripts/classify/run.ts']],
  ['node', ['scripts/review/build-review-queue.ts']],
  ['node', ['scripts/product/build-product-dataset.ts']],
] as const

for (const [command, args] of steps) {
  console.log(`running: ${command} ${args.join(' ')}`)
  const result = spawnSync(command, args, { stdio: 'inherit' })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}
