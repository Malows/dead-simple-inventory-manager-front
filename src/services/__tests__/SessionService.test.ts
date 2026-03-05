import { describe, it, expect, vi, beforeEach } from 'vitest'
import SessionService from '../SessionService'

function mockFetchResponse (data: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data)
  } as unknown as Response)
}

describe('SessionService', () => {
  let service: SessionService

  beforeEach(() => {
    service = new SessionService({
      clientSecret: 'secret',
      clientID: 'client-id',
      url: 'http://localhost:8000',
      oauthURI: 'oauth/token',
      profileURI: 'api/profile'
    })
    vi.restoreAllMocks()
  })

  describe('login', () => {
    it('calls POST to login URL with credentials', async () => {
      const fetchMock = mockFetchResponse({
        access_token: 'token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'refresh'
      })
      vi.stubGlobal('fetch', fetchMock)

      await service.login({ username: 'user', password: 'pass' })

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8000/oauth/token',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"username":"user"')
        })
      )
    })

    it('includes grant_type and scope in body', async () => {
      const fetchMock = mockFetchResponse({})
      vi.stubGlobal('fetch', fetchMock)

      await service.login({ username: 'u', password: 'p' })
      const body = JSON.parse(fetchMock.mock.calls[0][1].body)
      expect(body.grant_type).toBe('password')
      expect(body.scope).toBe('*')
      expect(body.client_secret).toBe('secret')
      expect(body.client_id).toBe('client-id')
    })
  })

  describe('fetchUserData', () => {
    it('calls GET to user URL with auth header', async () => {
      const fetchMock = mockFetchResponse({ id: 1, name: 'User' })
      vi.stubGlobal('fetch', fetchMock)

      await service.fetchUserData()

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8000/api/profile',
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: expect.any(String) })
        })
      )
    })
  })
})
