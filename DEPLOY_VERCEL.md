# Deploying to Vercel

The build itself needs no special config (`next build`, default Next.js preset).
The only thing to get right is **environment variables** — because Vercel runs on
stateless serverless functions, the app must use Postgres (not the in-memory store).

## Why Postgres is required on Vercel

Each Vercel request can run on a different serverless instance, so the in-memory
`MemoryStore` (fine for local/dev) does **not** share state across requests:
`POST /api/analyze` would save a run on one instance and the streaming `GET` would
look for it on another → "Run not found". Setting `DATABASE_URL` makes the app use
`PostgresStore`, which persists runs/assessments in the DB across invocations.

## 1. Set environment variables (Vercel → Project → Settings → Environment Variables)

Add these for **Production** (and Preview, if you use it):

| Key | Value |
|-----|-------|
| `DEMO_MODE` | `mock` |
| `STORE` | `postgres` |
| `DATABASE_URL` | your Supabase connection string (see below) |
| `ANTHROPIC_API_KEY` | only if `DEMO_MODE=live` |

`.env.local` is gitignored and is **not** uploaded — env vars must be set in the
Vercel dashboard.

### DATABASE_URL for serverless

Use a **pooled** Supabase URL (it's built for many short-lived connections):

```
postgres://postgres.<ref>:<password>@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

The session pooler (`:5432`) is fine for a POC. If you hit connection-limit errors
under load, switch this value to the **Transaction pooler** (`:6543`). SSL is handled
automatically for non-local hosts.

## 2. Run the migration once against that database

Already done for the current Supabase project. If you point at a fresh DB:

```bash
DATABASE_URL=...session-pooler-5432... npm run db:migrate
```

(Use the session pooler `:5432` for migrations — they run DDL in transactions.)

## 3. Deploy

Import the repo in Vercel (or push the branch). Build command `next build`, install
`npm install` — both defaults. No `vercel.json` needed.

## Notes

- **Function timeout:** the agent pipeline streams up to ~21s. The stream route sets
  `maxDuration = 60`. On the Hobby plan the cap is 60s (enough); if a stream ever times
  out, the dashboard's **"ข้ามไปดูผล" (skip)** button returns the result instantly.
- **Secrets:** rotate the DB password (Supabase → Settings → Database) if it was ever
  shared in plaintext, then update `DATABASE_URL` in Vercel and `.env.local`.
