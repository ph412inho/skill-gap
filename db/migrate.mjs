// Minimal forward-only migration runner. No framework — just applies every
// db/migrations/*.sql in filename order once, tracked in a _migrations table.
//
//   DATABASE_URL=postgres://user:pass@localhost:5432/career npm run db:migrate
//
// Each .sql file already wraps its statements in BEGIN/COMMIT.

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const here = dirname(fileURLToPath(import.meta.url))
const migrationsDir = join(here, 'migrations')
const projectRoot = join(here, '..')

// Tiny .env loader (Node doesn't read .env.local on its own; Next does).
// Loads .env.local then .env; never overrides a var already set in the shell.
for (const name of ['.env.local', '.env']) {
  const path = join(projectRoot, name)
  if (!existsSync(path)) continue
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
    if (!m || line.trimStart().startsWith('#')) continue
    const key = m[1]
    let val = m[2].trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}

const url = process.env.DATABASE_URL
if (!url) {
  console.error('✗ DATABASE_URL is not set. See .env.example.')
  process.exit(1)
}

// Remote hosts (Supabase, Neon, …) require SSL; local docker does not.
const isLocal = url.includes('localhost') || url.includes('127.0.0.1')
const client = new pg.Client({
  connectionString: url,
  ssl: isLocal ? false : { rejectUnauthorized: false },
})

async function main() {
  await client.connect()
  await client.query(
    `CREATE TABLE IF NOT EXISTS _migrations (
       name TEXT PRIMARY KEY,
       applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
     )`,
  )

  const applied = new Set(
    (await client.query('SELECT name FROM _migrations')).rows.map(r => r.name),
  )

  const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()
  let count = 0

  for (const file of files) {
    if (applied.has(file)) continue
    const sql = readFileSync(join(migrationsDir, file), 'utf8')
    process.stdout.write(`→ applying ${file} ... `)
    await client.query(sql)
    await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file])
    console.log('done')
    count++
  }

  console.log(count === 0 ? '✓ already up to date' : `✓ applied ${count} migration(s)`)
}

main()
  .catch(err => {
    console.error('\n✗ migration failed:', err.message)
    process.exitCode = 1
  })
  .finally(() => client.end())
