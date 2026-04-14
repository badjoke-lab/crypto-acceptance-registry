import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const inboxDir = path.join(process.cwd(), 'data', 'inbox')
const requiredFiles = ['places.json', 'payment_accepts.json', 'socials.json', 'verifications.json']

function readJsonArrayLength(filePath: string): number {
  if (!existsSync(filePath)) return 0
  const raw = readFileSync(filePath, 'utf-8')
  const parsed = JSON.parse(raw)
  return Array.isArray(parsed) ? parsed.length : 0
}

for (const name of requiredFiles) {
  const filePath = path.join(inboxDir, name)
  const exists = existsSync(filePath)
  const length = readJsonArrayLength(filePath)
  console.log(`${name}: exists=${exists} rows=${length}`)
}
