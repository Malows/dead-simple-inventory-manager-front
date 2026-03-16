import { describe, it, expect } from 'vitest'
import { mapCategory } from '../category.interceptors'
import type { RawCategory } from '../../../types/category.interfaces'

const makeRawCategory = (overrides: Partial<RawCategory> = {}): RawCategory => ({
  id: 1,
  uuid: 'cat-uuid',
  name: 'Test Category',
  created_at: '2024-01-15T10:00:00.000Z',
  updated_at: null,
  products: null,
  ...overrides
})

describe('mapCategory', () => {
  it('converts dates and defaults products', () => {
    const result = mapCategory(makeRawCategory())
    expect(result.created_at).toBeInstanceOf(Date)
    expect(result.updated_at).toBeNull()
    expect(result.products).toEqual([])
  })

  it('preserves products when provided', () => {
    const result = mapCategory(
      makeRawCategory({
        products: [
          {
            id: 1,
            uuid: 'p',
            name: 'P',
            code: 'C',
            stock: 0,
            min_stock_warning: 0,
            description: null,
            price: null,
            brand_id: null,
            supplier_id: null,
            storage_location_id: null,
            image_url: null
          }
        ]
      })
    )
    expect(result.products).toHaveLength(1)
  })

  it('preserves entity fields', () => {
    const result = mapCategory(makeRawCategory())
    expect(result.name).toBe('Test Category')
    expect(result.uuid).toBe('cat-uuid')
  })
})
