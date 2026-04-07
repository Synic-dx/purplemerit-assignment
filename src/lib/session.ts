import { nanoid } from 'nanoid'

const SESSION_KEY = 'stylesync_session_id'

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server'
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = nanoid()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}
