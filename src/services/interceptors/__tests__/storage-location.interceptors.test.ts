import { describe, it, expect } from 'vitest'

import { mapStorageLocation } from '../storage-location.interceptors'
import type { RawStorageLocation } from '../../../types/storage-location.interfaces'

const makeRawStorageLocation = (overrides: Partial<RawStorageLocation> = {}): RawStorageLocation => ({
  id: 1,
  uuid: 'storage-location-uuid-1',
  name: 'Main Warehouse',
  description: 'Primary location',
  products: null,
  created_at: '2024-01-15T10:00:00.000Z',
  updated_at: '2024-06-20T12:00:00.000Z',
  ...overrides
})

describe('mapStorageLocation', () => {
  it('converts date fields', () => {
    const result = mapStorageLocation(makeRawStorageLocation())

    expect(result.created_at).toBeInstanceOf(Date)
    expect(result.updated_at).toBeInstanceOf(Date)
  })

  it('defaults products to empty array', () => {
    const result = mapStorageLocation(makeRawStorageLocation({ products: null }))

    expect(result.products).toEqual([])
  })
})
