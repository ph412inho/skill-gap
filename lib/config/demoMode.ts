// Single source of truth for DEMO_MODE.
// "mock" = scripted agents, fully offline (pitch default).
// "live" = real Claude API calls via lib/orchestrator/llm/.
export type DemoMode = 'mock' | 'live'

export function getDemoMode(): DemoMode {
  const raw = process.env.DEMO_MODE ?? 'mock'
  return raw === 'live' ? 'live' : 'mock'
}
