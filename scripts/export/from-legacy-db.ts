import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import pg from 'pg'

const { Client } = pg

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  const client = new Client({ connectionString: databaseUrl })
  await client.connect()

  const outDir = path.join(process.cwd(), 'data', 'inbox')
  mkdirSync(outDir, { recursive: true })

  const queries = {
    'places.json': `
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) AS data
      FROM (
        SELECT id, name, country, city, website, about, "paymentNote"
        FROM places
        ORDER BY id
      ) t;
    `,
    'payment_accepts.json': `
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) AS data
      FROM (
        SELECT place_id, asset, chain, method, processor, note
        FROM payment_accepts
        ORDER BY place_id, asset, chain, method
      ) t;
    `,
    'socials.json': `
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) AS data
      FROM (
        SELECT place_id, platform, url, handle
        FROM socials
        ORDER BY place_id, platform
      ) t;
    `,
    'verifications.json': `
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) AS data
      FROM (
        SELECT place_id, status, last_checked, last_verified
        FROM verifications
        ORDER BY place_id
      ) t;
    `,
  } as const

  try {
    for (const [fileName, query] of Object.entries(queries)) {
      const result = await client.query<{ data: unknown }>(query)
      const data = result.rows[0]?.data ?? []
      const outPath = path.join(outDir, fileName)
      writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8')
      console.log(`wrote ${fileName}`)
    }
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
