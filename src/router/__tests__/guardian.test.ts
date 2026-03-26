import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import guardian, { checkLocalAuth } from '../guardian'
import { RouteLocation } from 'vue-router'

describe('guardian', () => {
  const prefix = 'test'

  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('checkLocalAuth', () => {
    it('should return false if token is missing', () => {
      expect(checkLocalAuth(prefix)).toBe(false)
    })

    it('should return false if token is expired', () => {
      localStorage.setItem(`${prefix}_access_token`, 'token')
      localStorage.setItem(`${prefix}_expiration_at`, new Date(Date.now() - 1000).toISOString())
      expect(checkLocalAuth(prefix)).toBe(false)
    })

    it('should return true if token is valid', () => {
      localStorage.setItem(`${prefix}_access_token`, 'token')
      localStorage.setItem(`${prefix}_expiration_at`, new Date(Date.now() + 10000).toISOString())
      expect(checkLocalAuth(prefix)).toBe(true)
    })
  })

  describe('guardian function', () => {
    it('should call next() if requiresAuth is false', () => {
      const to = { meta: { requiresAuth: false } } as unknown as RouteLocation
      const next = vi.fn()
      guardian(prefix)(to, {} as RouteLocation, next)
      expect(next).toHaveBeenCalledWith()
    })

    it('should redirect to /login if authentication fails', () => {
      const to = { meta: { requiresAuth: true } } as unknown as RouteLocation
      const next = vi.fn()
      guardian(prefix)(to, {} as RouteLocation, next)
      expect(next).toHaveBeenCalledWith({ path: '/login' })
    })

    it('should call next() if authentication succeeds', () => {
      localStorage.setItem(`${prefix}_access_token`, 'token')
      localStorage.setItem(`${prefix}_expiration_at`, new Date(Date.now() + 10000).toISOString())
      const to = { meta: { requiresAuth: true } } as unknown as RouteLocation
      const next = vi.fn()
      guardian(prefix)(to, {} as RouteLocation, next)
      expect(next).toHaveBeenCalledWith()
    })
  })
})
