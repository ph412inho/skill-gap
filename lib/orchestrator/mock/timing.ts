// Seeded LCG (Linear Congruential Generator) so mock timings are deterministic
// per scenario — reproducible across pitch runs, not random.
// Parameters: Numerical Recipes LCG (a=1664525, c=1013904223, m=2^32)
class SeededRng {
  private state: number

  constructor(seed: number) {
    this.state = seed >>> 0
  }

  next(): number {
    this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0
    return this.state / 0x100000000
  }

  intBetween(lo: number, hi: number): number {
    return lo + Math.floor(this.next() * (hi - lo + 1))
  }
}

// Deterministic delay function — does NOT use Date.now() or Math.random()
export function makeTiming(seed: number) {
  const rng = new SeededRng(seed)
  return {
    agentDwell: () => rng.intBetween(600, 1400),    // ms between agent_started and agent_done
    captionDelay: () => rng.intBetween(150, 400),   // ms between caption emissions
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
