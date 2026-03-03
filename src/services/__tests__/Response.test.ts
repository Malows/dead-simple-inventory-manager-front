import { describe, it, expect } from 'vitest'
import HttpResponse, { handle } from '../Response'

describe('HttpResponse', () => {
  it('creates an instance with properties', () => {
    const res = new HttpResponse({
      isOk: true,
      code: 200,
      message: 'OK',
      data: { id: 1 }
    })
    expect(res.isOk).toBe(true)
    expect(res.code).toBe(200)
    expect(res.data).toEqual({ id: 1 })
  })
})

describe('handle', () => {
  it('handles a successful response', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 1, name: 'Test' })
    } as unknown as Response

    const result = await handle<{ id: number }>(Promise.resolve(mockResponse))
    expect(result.isOk).toBe(true)
    expect(result.code).toBe(200)
    expect(result.data).toEqual({ id: 1, name: 'Test' })
    expect(result.error).toBeNull()
  })

  it('handles a non-ok response', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Not found' })
    } as unknown as Response

    const result = await handle(Promise.resolve(mockResponse))
    expect(result.isOk).toBe(false)
    expect(result.code).toBe(404)
  })

  it('handles a network error', async () => {
    const result = await handle(Promise.reject(new Error('Network error')))
    expect(result.isOk).toBe(false)
    expect(result.code).toBe(-1)
    expect(result.error).toBeTruthy()
    expect(result.data).toBeNull()
  })
})
