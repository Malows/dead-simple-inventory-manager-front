import { describe, it, expect, beforeEach } from 'vitest'
import Service from '../Service'

// Service uses protected methods, so we extend it to expose them
class TestService extends Service {
  getAuthHeader () {
    return this.authHeader()
  }

  getCommonHeader () {
    return this.commonHeader()
  }

  getAuthFileHeader () {
    return this.authFileHeader()
  }

  getCommonFileHeader () {
    return this.commonFileHeader()
  }
}

describe('Service', () => {
  let service: TestService

  beforeEach(() => {
    service = new TestService()
    localStorage.clear()
  })

  it('authHeader includes Authorization and Content-Type', () => {
    localStorage.setItem('test_access_token', 'Bearer my-token')
    const headers = service.getAuthHeader()
    expect(headers['Content-Type']).toBe('application/json')
    expect(headers['X-Requested-With']).toBe('XMLHttpRequest')
    expect(headers.Authorization).toBeDefined()
  })

  it('commonHeader includes Content-Type without Authorization', () => {
    const headers = service.getCommonHeader()
    expect(headers['Content-Type']).toBe('application/json')
    expect(headers['X-Requested-With']).toBe('XMLHttpRequest')
    expect(headers.Authorization).toBeUndefined()
  })

  it('authFileHeader includes Authorization without Content-Type', () => {
    const headers = service.getAuthFileHeader()
    expect(headers['X-Requested-With']).toBe('XMLHttpRequest')
    expect(headers['Content-Type']).toBeUndefined()
  })

  it('commonFileHeader has no Authorization or Content-Type', () => {
    const headers = service.getCommonFileHeader()
    expect(headers['X-Requested-With']).toBe('XMLHttpRequest')
    expect(headers.Authorization).toBeUndefined()
    expect(headers['Content-Type']).toBeUndefined()
  })
})
