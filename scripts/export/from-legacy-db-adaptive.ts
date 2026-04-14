import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import pg from 'pg'

const { Client } = pg

type TableColumns = Record<string, Set<string>>

async function getColumns(client: pg.Client, tableName: string): Promise<Set<string>> {
  const result = await client.query<{ column_name: string }>(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `,
    [tableName],
  )

  return new Set(result.rows.map((row) => row.column_name))
}

function selectExpr(columns: Set<string>, columnName: string, fallbackSql = 'NULL::text'): string {
  return columns.has(columnName) ? columnName : `${fallbackSql} AS "${columnName}"`
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  const client = new Client({ connectionString: databaseUrl })
  await client.connect()

  const outDir = path.join(process.cwd(), 'data', 'inbox')
  mkdirSync(outDir, { recursive: true })

  try {
    const columns: TableColumns = {
      places: await getColumns(client, 'places'),
      payment_accepts: await getColumns(client, 'payment_accepts'),
      socials: await getColumns(client, 'socials'),
      verifications: await getColumns(client, 'verifications'),
    }

    const placesQuery = `
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) AS data
      FROM (
        SELECT
          id,
          name,
          ${selectExpr(columns.places, 'country')},
          ${selectExpr(columns.places, 'city')},
          ${selectExpr(columns.places, 'website')},
          ${selectExpr(columns.places, 'about')},
          ${selectExpr(columns.places, 'paymentNote')}
        FROM places
        ORDER BY id
      ) t;
    `

    const paymentAcceptsQuery = `
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) AS data
      FROM (
        SELECT
          place_id,
          ${selectExpr(columns.payment_accepts, 'asset')},
          ${selectExpr(columns.payment_accepts, 'chain')},
          ${selectExpr(columns.payment_accepts, 'method')},
          ${selectExpr(columns.payment_accepts, 'processor')},
          ${selectExpr(columns.payment_accepts, 'note')}
        FROM payment_accepts
        ORDER BY place_id, asset NULLS LAST, chain NULLS LAST
      ) t;
    `

    const socialsQuery = `
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) AS data
      FROM (
        SELECT
          place_id,
          ${selectExpr(columns.socials, 'platform')},
          ${selectExpr(columns.socials, 'url')},
          ${selectExpr(columns.socials, 'handle')}
        FROM socials
        ORDER BY place_id, platform NULLS LAST
      ) t;
    `

    const verificationsQuery = `
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) AS data
      FROM (
        SELECT
          place_id,
          ${selectExpr(columns.verifications, 'status')},
          ${selectExpr(columns.verifications, 'last_checked')},
          ${selectExpr(columns.verifications, 'last_verified')}
        FROM verifications
        ORDER BY place_id
      ) t;
    `

    const queries = {
      'places.json': placesQuery,
      'payment_accepts.json': paymentAcceptsQuery,
      'socials.json': socialsQuery,
      'verifications.json': verificationsQuery,
    } as const

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
