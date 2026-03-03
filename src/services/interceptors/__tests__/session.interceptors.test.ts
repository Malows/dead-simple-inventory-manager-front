import { describe, it, expect, beforeEach } from 'vitest'
import {
  mapSession,
  mapPlainSession,
  setStorage,
  getStorage,
  removeStorage
} from '../session.interceptors'
import type { RawSession, Session } from '../../../types/session.interfaces'

const makeRawSession = (): RawSession => ({
  token_type: 'Bearer',
  expires_in: 3600,
  access_token: 'access-token-123',
  refresh_token: 'refresh-token-456'
})

describe('mapSession', () => {
  it('creates a Session from RawSession', () => {
    const result = mapSession(makeRawSession())
    expect(result.accessToken).toBe('Bearer access-token-123')
    expect(result.refreshToken).toBe('Bearer refresh-token-456')
    expect(result.loginAt).toBeInstanceOf(Date)
    expect(result.expirationAt).toBeInstanceOf(Date)
    expect(result.refreshExpirationAt).toBeInstanceOf(Date)
  })

  it('expirationAt is after loginAt', () => {
    const result = mapSession(makeRawSession())
    expect(result.expirationAt.getTime()).toBeGreaterThan(result.loginAt.getTime())
  })

  it('refreshExpirationAt is after expirationAt', () => {
    const result = mapSession(makeRawSession())
    expect(result.refreshExpirationAt.getTime()).toBeGreaterThan(result.expirationAt.getTime())
  })
})

describe('mapPlainSession', () => {
  it('converts Date fields to ISO strings', () => {
    const session = mapSession(makeRawSession())
    const plain = mapPlainSession(session)
    expect(typeof plain.loginAt).toBe('string')
    expect(typeof plain.expirationAt).toBe('string')
    expect(typeof plain.refreshExpirationAt).toBe('string')
    expect(plain.accessToken).toBe(session.accessToken)
  })
})

describe('setStorage / getStorage / removeStorage', () => {
  const prefix = 'test'

  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and retrieves session', () => {
    const session = mapSession(makeRawSession())
    setStorage(prefix, session)
    const retrieved = getStorage(prefix)
    expect(retrieved).not.toBeNull()
    expect(retrieved!.accessToken).toBe(session.accessToken)
    expect(retrieved!.refreshToken).toBe(session.refreshToken)
    expect(retrieved!.loginAt).toBeInstanceOf(Date)
  })

  it('returns null when no session stored', () => {
    expect(getStorage(prefix)).toBeNull()
  })

  it('removes session from storage', () => {
    const session = mapSession(makeRawSession())
    setStorage(prefix, session)
    removeStorage(prefix)
    expect(getStorage(prefix)).toBeNull()
  })

  it('returns null when partial data is stored', () => {
    localStorage.setItem(`${prefix}_access_token`, 'token')
    // missing other keys
    expect(getStorage(prefix)).toBeNull()
  })
})
