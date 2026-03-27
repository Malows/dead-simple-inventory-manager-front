import { describe, it, expect } from 'vitest'
import { mapBrand } from '../brand.interceptors'
import type { RawBrand } from '../../../types/brand.interfaces'

const makeRawBrand = (overrides: Partial<RawBrand> = {}): RawBrand => ({
  id: 1,
  uuid: 'brand-uuid',
  name: 'Test Brand',
  created_at: '2024-01-15T10:00:00.000Z',
  updated_at: '2024-06-20T12:00:00.000Z',
  products: null,
  ...overrides
})

describe('mapBrand', () => {
  it('converts dates and defaults products to empty array', () => {
    const result = mapBrand(makeRawBrand())
    expect(result.created_at).toBeInstanceOf(Date)
    expect(result.updated_at).toBeInstanceOf(Date)
    expect(result.products).toEqual([])
  })

  it('preserves existing products array', () => {
    const products = [
      {
        id: 1,
        uuid: 'p1',
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
    const result = mapBrand(makeRawBrand({ products }))
    expect(result.products).toHaveLength(1)
  })

  it('preserves name and id', () => {
    const result = mapBrand(makeRawBrand())
    expect(result.name).toBe('Test Brand')
    expect(result.id).toBe(1)
    expect(result.uuid).toBe('brand-uuid')
  })
})
