// Browser-scoped student identity — NO authentication (POC). A stable id in
// localStorage ties a student's baseline and later re-assessment together so the
// before→after can be computed. Same browser = same student. Swap for real auth
// when the pilot needs cross-device identity.

const KEY = 'career_student_id'

export function getStudentId(): string {
  if (typeof window === 'undefined') return 'server'
  let id = window.localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    window.localStorage.setItem(KEY, id)
  }
  return id
}
