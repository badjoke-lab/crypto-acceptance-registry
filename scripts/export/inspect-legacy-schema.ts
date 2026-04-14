import pg from 'pg'

const { Client } = pg

async function getColumns(client: pg.Client, tableName: string): Promise<string[]> {
  const result = await client.query<{ column_name: string }>(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `,
    [tableName],
  )

  return result.rows.map((row) => row.column_name)
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error('DATABASE_URL is required')

  const client = new Client({ connectionString: databaseUrl })
  await client.connect()

  try {
    for (const tableName of ['places', 'payment_accepts', 'socials', 'verifications']) {
      const columns = await getColumns(client, tableName)
      console.log(`${tableName}: ${columns.join(', ')}`)
    }
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
