import { describe, it, expect, vi, beforeEach } from 'vitest'
import Generic from '../Generic'

class TestGeneric extends Generic<{ id: number; name: string }> {
  override _url = 'http://localhost:8000/api/test'
}

function mockFetchResponse (data: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data)
  } as unknown as Response)
}

describe('Generic', () => {
  let service: TestGeneric

  beforeEach(() => {
    service = new TestGeneric()
    vi.restoreAllMocks()
  })

  describe('url', () => {
    it('returns base URL without id', () => {
      expect(service.url()).toBe('http://localhost:8000/api/test')
    })

    it('returns URL with id', () => {
      expect(service.url('abc')).toBe('http://localhost:8000/api/test/abc')
    })
  })

  describe('fetch', () => {
    it('calls GET on base URL', async () => {
      const fetchMock = mockFetchResponse([{ id: 1, name: 'A' }])
      vi.stubGlobal('fetch', fetchMock)

      const result = await service.fetch()
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8000/api/test',
        expect.objectContaining({ headers: expect.any(Object) })
      )
      expect(result.data).toEqual([{ id: 1, name: 'A' }])
    })
  })

  describe('get', () => {
    it('calls GET on URL with id', async () => {
      const fetchMock = mockFetchResponse({ id: 1, name: 'A' })
      vi.stubGlobal('fetch', fetchMock)

      const result = await service.get('abc')
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8000/api/test/abc',
        expect.objectContaining({ headers: expect.any(Object) })
      )
      expect(result.data).toEqual({ id: 1, name: 'A' })
    })
  })

  describe('create', () => {
    it('calls POST with body', async () => {
      const fetchMock = mockFetchResponse({ id: 2, name: 'B' })
      vi.stubGlobal('fetch', fetchMock)

      const result = await service.create({ name: 'B' })
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8000/api/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'B' })
        })
      )
      expect(result.data).toEqual({ id: 2, name: 'B' })
    })
  })

  describe('update', () => {
    it('calls PUT with body', async () => {
      const fetchMock = mockFetchResponse({ id: 1, name: 'Updated' })
      vi.stubGlobal('fetch', fetchMock)

      const result = await service.update('abc', { name: 'Updated' })
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8000/api/test/abc',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'Updated' })
        })
      )
      expect(result.data).toEqual({ id: 1, name: 'Updated' })
    })
  })

  describe('remove', () => {
    it('calls DELETE on URL with id', async () => {
      const fetchMock = mockFetchResponse({ id: 1, name: 'A' })
      vi.stubGlobal('fetch', fetchMock)

      const result = await service.remove('abc')
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8000/api/test/abc',
        expect.objectContaining({ method: 'DELETE' })
      )
      expect(result.isOk).toBe(true)
    })
  })
})
