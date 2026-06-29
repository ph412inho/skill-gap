// Browser-scoped advisor identity — NO authentication (POC), mirrors studentId.
// Real pilots replace this with RBAC-backed advisor accounts.

const KEY = 'career_advisor_id'

export function getAdvisorId(): string {
  if (typeof window === 'undefined') return 'advisor-demo'
  let id = window.localStorage.getItem(KEY)
  if (!id) {
    id = 'advisor-' + crypto.randomUUID().slice(0, 8)
    window.localStorage.setItem(KEY, id)
  }
  return id
}
