// The storage seam factory — the only switch between MemoryStore and PostgresStore.
// Mirrors getOrchestrator(). The instance is pinned to `global` so a Postgres
// connection pool is created once and reused across hot reloads / requests.

import type { Store } from './types'
import { MemoryStore } from './memoryStore'
import { PostgresStore } from './postgresStore'

export type { Store } from './types'

const g = global as typeof global & { __store?: Store }

// Use Postgres when explicitly selected, or whenever a DATABASE_URL is present.
// Otherwise fall back to the offline MemoryStore (pitch / dev / mock default).
function usePostgres(): boolean {
  if (process.env.STORE === 'postgres') return true
  if (process.env.STORE === 'memory') return false
  return !!process.env.DATABASE_URL
}

function selectStore(): Store {
  return usePostgres() ? new PostgresStore() : new MemoryStore()
}

export function getStore(): Store {
  return g.__store ?? (g.__store = selectStore())
}
