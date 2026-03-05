import { describe, it, expect } from 'vitest'
import { mapSupplier } from '../supplier.interceptors'
import type { RawSupplier } from '../../../types/supplier.interfaces'

const makeRawSupplier = (overrides: Partial<RawSupplier> = {}): RawSupplier => ({
  id: 1,
  uuid: 'sup-uuid',
  name: 'Test Supplier',
  email: 'test@example.com',
  phone: '123',
  address: '123 St',
  web: 'https://example.com',
  created_at: '2024-01-15T10:00:00.000Z',
  updated_at: '2024-06-20T12:00:00.000Z',
  products: null,
  ...overrides
})

describe('mapSupplier', () => {
  it('converts dates and defaults products', () => {
    const result = mapSupplier(makeRawSupplier())
    expect(result.created_at).toBeInstanceOf(Date)
    expect(result.updated_at).toBeInstanceOf(Date)
    expect(result.products).toEqual([])
  })

  it('preserves all entity fields', () => {
    const result = mapSupplier(makeRawSupplier())
    expect(result.name).toBe('Test Supplier')
    expect(result.email).toBe('test@example.com')
    expect(result.phone).toBe('123')
    expect(result.address).toBe('123 St')
    expect(result.web).toBe('https://example.com')
  })

  it('handles null optional fields', () => {
    const result = mapSupplier(
      makeRawSupplier({ email: null, phone: null, address: null, web: null })
    )
    expect(result.email).toBeNull()
    expect(result.phone).toBeNull()
  })
})
