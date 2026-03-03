import { describe, it, expect } from 'vitest'
import { mapModel } from '../model.interceptors'

describe('mapModel', () => {
  it('converts string dates to Date objects', () => {
    const raw = {
      id: 1,
      uuid: 'abc-123',
      created_at: '2024-01-15T10:00:00.000Z',
      updated_at: '2024-06-20T12:00:00.000Z'
    }
    const result = mapModel(raw)
    expect(result.created_at).toBeInstanceOf(Date)
    expect(result.updated_at).toBeInstanceOf(Date)
  })

  it('handles null dates', () => {
    const raw = {
      id: 1,
      uuid: 'abc-123',
      created_at: null,
      updated_at: null
    }
    const result = mapModel(raw)
    expect(result.created_at).toBeNull()
    expect(result.updated_at).toBeNull()
  })

  it('preserves other fields', () => {
    const raw = {
      id: 42,
      uuid: 'test-uuid',
      created_at: null,
      updated_at: null,
      name: 'extra'
    }
    const result = mapModel(raw)
    expect(result.id).toBe(42)
    expect(result.uuid).toBe('test-uuid')
    expect((result as typeof raw).name).toBe('extra')
  })
})
