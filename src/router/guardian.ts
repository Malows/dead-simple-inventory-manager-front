import { RouteLocation, NavigationGuardWithThis } from 'vue-router'
import { isBefore } from 'date-fns'

export default function<T> (prefix: string): NavigationGuardWithThis<T> {
  return (to: RouteLocation, _: RouteLocation, next) => {
    if (!to.meta.requiresAuth) return next()

    if (!checkLocalAuth(prefix)) return next({ path: '/login' })

    return next()
  }
}

export const checkLocalAuth = (prefix: string) => {
  const authToken = localStorage.getItem(`${prefix}_access_token`)
  if (!authToken) {
    localStorage.clear()
    return false
  }

  const expireSession = new Date((localStorage.getItem(`${prefix}_expiration_at`) ?? ''))
  if (!expireSession) return false

  return isBefore(Date.now(), expireSession)
}
