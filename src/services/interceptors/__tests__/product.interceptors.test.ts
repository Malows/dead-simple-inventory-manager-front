import { describe, it, expect } from 'vitest'
import { mapProduct } from '../product.interceptors'
import type { RawProduct } from '../../../types/product.interfaces'

const makeRawProduct = (overrides: Partial<RawProduct> = {}): RawProduct => ({
  id: 1,
  uuid: 'prod-uuid',
  name: 'Test Product',
  code: 'TP-001',
  stock: 10,
  min_stock_warning: 5,
  description: 'A test product',
  price: 99.99,
  brand_id: 1,
  supplier_id: 2,
  storage_location_id: 3,
  image_url: null,
  brand: null,
  supplier: null,
  storage_location: null,
  categories: null,
  last_price_update: '2024-03-10T08:00:00.000Z',
  last_stock_update: '2024-04-15T09:00:00.000Z',
  created_at: '2024-01-15T10:00:00.000Z',
  updated_at: '2024-06-20T12:00:00.000Z',
  deleted_at: null,
  ...overrides
})

describe('mapProduct', () => {
  it('converts all date fields', () => {
    const result = mapProduct(makeRawProduct())
    expect(result.created_at).toBeInstanceOf(Date)
    expect(result.updated_at).toBeInstanceOf(Date)
    expect(result.last_price_update).toBeInstanceOf(Date)
    expect(result.last_stock_update).toBeInstanceOf(Date)
    expect(result.deleted_at).toBeNull()
  })

  it('handles null date fields', () => {
    const result = mapProduct(
      makeRawProduct({
        last_price_update: null,
        last_stock_update: null,
        created_at: null,
        updated_at: null
      })
    )
    expect(result.last_price_update).toBeNull()
    expect(result.last_stock_update).toBeNull()
    expect(result.created_at).toBeNull()
    expect(result.updated_at).toBeNull()
  })

  it('defaults categories to empty array', () => {
    const result = mapProduct(makeRawProduct({ categories: null }))
    expect(result.categories).toEqual([])
  })

  it('defaults supplier to null', () => {
    const result = mapProduct(makeRawProduct({ supplier: undefined }))
    expect(result.supplier).toBeNull()
  })

  it('defaults storage location to null', () => {
    const result = mapProduct(makeRawProduct({ storage_location: undefined }))
    expect(result.storage_location).toBeNull()
  })

  it('preserves entity fields', () => {
    const result = mapProduct(makeRawProduct())
    expect(result.name).toBe('Test Product')
    expect(result.code).toBe('TP-001')
    expect(result.stock).toBe(10)
    expect(result.price).toBe(99.99)
  })
})
