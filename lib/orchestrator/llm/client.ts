import Anthropic from '@anthropic-ai/sdk'

// Singleton — one client per process
let _client: Anthropic | null = null

export function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return _client
}

export const MODEL = (process.env.MODEL_ID ?? 'claude-opus-4-8') as string
