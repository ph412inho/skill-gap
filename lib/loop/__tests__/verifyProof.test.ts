import { describe, it, expect } from 'vitest'
import { verifyProof, HIGH_THRESHOLD } from '@/lib/loop/verifyProof'

const NOW = '2026-06-30T00:00:00.000Z'

describe('verifyProof (bounded auto-verify)', () => {
  it('auto-verifies a credible artifact host above the threshold', () => {
    const v = verifyProof({ proofType: 'github_repo', source: 'link', url: 'https://github.com/acme/dashboard' }, NOW)
    expect(v.outcome).toBe('auto_verified')
    expect(v.confidence).toBeGreaterThanOrEqual(HIGH_THRESHOLD)
    expect(v.newStatus).toBe('verified_skill')
  })

  it('rejects an unresolvable / malformed link (never flips a skill)', () => {
    const v = verifyProof({ proofType: 'github_repo', source: 'link', url: 'not-a-url' }, NOW)
    expect(v.outcome).toBe('rejected')
    expect(v.reachable).toBe(false)
    expect(v.newStatus).toBeUndefined()
  })

  it('routes a well-formed but unfamiliar host to an advisor', () => {
    const v = verifyProof({ proofType: 'pdf_writeup', source: 'link', url: 'https://some-random-blog.example/post' }, NOW)
    expect(v.outcome).toBe('routed_to_advisor')
    expect(v.confidence).toBeLessThan(HIGH_THRESHOLD)
    expect(v.newStatus).toBeUndefined()
  })

  it('routes uploaded files to an advisor (contents not auto-inspectable in POC)', () => {
    const v = verifyProof({ proofType: 'pdf_writeup', source: 'file', filename: 'report.pdf' }, NOW)
    expect(v.outcome).toBe('routed_to_advisor')
    expect(v.newStatus).toBeUndefined()
  })

  it('treats www and subdomains of known hosts as credible', () => {
    const v = verifyProof({ proofType: 'dataset_notebook', source: 'link', url: 'https://www.kaggle.com/code/x/y' }, NOW)
    expect(v.outcome).toBe('auto_verified')
  })
})
