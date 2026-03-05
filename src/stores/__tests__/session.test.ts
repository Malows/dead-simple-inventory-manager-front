import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const { mockLogin, mockFetchUserData } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
  mockFetchUserData: vi.fn()
}))

vi.mock('../../services/SessionService', () => {
  return {
    default: class MockSessionService {
      login = mockLogin
      fetchUserData = mockFetchUserData
    }
  }
})

vi.mock('../../services/interceptors/session.interceptors', () => ({
  mapSession: vi.fn(() => ({
    accessToken: 'tok-mapped',
    refreshToken: 'ref-mapped',
    loginAt: new Date('2024-06-01T00:00:00Z'),
    expirationAt: new Date('2099-12-31T00:00:00Z'),
    refreshExpirationAt: new Date('2099-12-31T00:00:00Z')
  })),
  setStorage: vi.fn(),
  getStorage: vi.fn(),
  removeStorage: vi.fn()
}))

vi.mock('date-fns', () => ({
  isPast: vi.fn(() => false)
}))

import { useSessionStore } from '../session'
import {
  mapSession,
  setStorage,
  getStorage,
  removeStorage
} from '../../services/interceptors/session.interceptors'
import { isPast } from 'date-fns'

function okResponse<T> (data: T) {
  return { isOk: true, code: 200, data, error: null, message: '' }
}

function failResponse () {
  return { isOk: false, code: 401, data: null, error: 'Unauthorized', message: '' }
}

describe('session store', () => {
  let store: ReturnType<typeof useSessionStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useSessionStore()
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('sets tokens and fetches user on success', async () => {
      const rawSession = { access_token: 'abc', refresh_token: 'xyz' }
      const userData = { uuid: 'u1', name: 'Jane' }

      mockLogin.mockResolvedValue(okResponse(rawSession))
      mockFetchUserData.mockResolvedValue(okResponse(userData))

      const result = await store.login({ username: 'jane', password: 'pw' })

      expect(result.isOk).toBe(true)
      expect(store.accessToken).toBe('tok-mapped')
      expect(store.refreshToken).toBe('ref-mapped')
      expect(mapSession).toHaveBeenCalledWith(rawSession)
      expect(setStorage).toHaveBeenCalled()
      expect(store.user).toEqual(userData)
    })

    it('does not set tokens on failure', async () => {
      mockLogin.mockResolvedValue(failResponse())

      await store.login({ username: 'x', password: 'x' })

      expect(store.accessToken).toBe('')
      expect(setStorage).not.toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    it('clears all session state and storage', async () => {
      const rawSession = { access_token: 'abc', refresh_token: 'xyz' }
      mockLogin.mockResolvedValue(okResponse(rawSession))
      mockFetchUserData.mockResolvedValue(okResponse({ uuid: 'u1', name: 'Jane' }))
      await store.login({ username: 'jane', password: 'pw' })

      store.logout()

      expect(store.accessToken).toBe('')
      expect(store.refreshToken).toBe('')
      expect(store.user).toBeNull()
      expect(removeStorage).toHaveBeenCalled()
    })
  })

  describe('checkSession', () => {
    it('returns null when no storage', async () => {
      vi.mocked(getStorage).mockReturnValue(null)
      const result = await store.checkSession()
      expect(result).toBeNull()
    })

    it('returns null when values are invalid', async () => {
      vi.mocked(getStorage).mockReturnValue({
        loginAt: null,
        expirationAt: null,
        accessToken: ''
      } as never)
      const result = await store.checkSession()
      expect(result).toBeNull()
    })

    it('returns null when session is expired', async () => {
      vi.mocked(getStorage).mockReturnValue({
        loginAt: new Date('2024-01-01'),
        expirationAt: new Date('2024-01-02'),
        accessToken: 'tok'
      } as never)
      vi.mocked(isPast).mockReturnValue(true)

      const result = await store.checkSession()
      expect(result).toBeNull()
    })

    it('fetches user data when session is valid', async () => {
      vi.mocked(getStorage).mockReturnValue({
        loginAt: new Date('2024-01-01'),
        expirationAt: new Date('2099-12-31'),
        accessToken: 'tok'
      } as never)
      vi.mocked(isPast).mockReturnValue(false)
      mockFetchUserData.mockResolvedValue(okResponse({ uuid: 'u1', name: 'Jane' }))

      const result = await store.checkSession()
      expect(result).toBeDefined()
      expect(store.user).toEqual({ uuid: 'u1', name: 'Jane' })
    })
  })

  describe('fetchUserData', () => {
    it('sets user when data is returned', async () => {
      mockFetchUserData.mockResolvedValue(okResponse({ uuid: 'u1', name: 'John' }))
      await store.fetchUserData()
      expect(store.user).toEqual({ uuid: 'u1', name: 'John' })
    })

    it('does not set user when data is null', async () => {
      mockFetchUserData.mockResolvedValue(failResponse())
      await store.fetchUserData()
      expect(store.user).toBeNull()
    })
  })
})
