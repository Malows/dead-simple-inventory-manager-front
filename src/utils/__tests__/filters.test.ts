import { describe, it, expect } from 'vitest'
import { byName, byProduct, byProductAdvanced } from '../filters'
import type { Product } from '../../types/product.interfaces'

describe('byName', () => {
  it('matches items containing the search string (case insensitive)', () => {
    const filter = byName('hello')
    expect(filter({ name: 'Hello World' })).toBe(true)
  })

  it('does not match items without the search string', () => {
    const filter = byName('xyz')
    expect(filter({ name: 'Hello World' })).toBe(false)
  })

  it('matches partial strings', () => {
    const filter = byName('wor')
    expect(filter({ name: 'Hello World' })).toBe(true)
  })

  it('is case insensitive', () => {
    const filter = byName('HELLO')
    expect(filter({ name: 'hello world' })).toBe(true)
  })
})

describe('byProduct', () => {
  const product = { name: 'Widget', code: 'WDG-001' } as Product

  it('matches by name', () => {
    expect(byProduct('widget')(product)).toBe(true)
  })

  it('matches by code', () => {
    expect(byProduct('WDG')(product)).toBe(true)
  })

  it('is case insensitive', () => {
    expect(byProduct('WIDGET')(product)).toBe(true)
  })

  it('returns false for no match', () => {
    expect(byProduct('xyz')(product)).toBe(false)
  })
})

describe('byProductAdvanced', () => {
  const makeProduct = (overrides: Partial<Product> = {}): Product => ({
    id: 1,
    uuid: 'uuid-1',
    name: 'Test Product',
    code: 'TP-001',
    stock: 10,
    min_stock_warning: 5,
    description: null,
    price: 100,
    brand_id: 1,
    supplier_id: 2,
    storage_location_id: null,
    image_url: null,
    brand: null,
    supplier: null,
    storage_location: null,
    categories: [{ id: 3, uuid: 'cat-1', name: 'Cat A' }] as Product['categories'],
    last_price_update: null,
    last_stock_update: null,
    created_at: null,
    updated_at: null,
    deleted_at: null,
    ...overrides
  })

  it('passes when no filters are applied', () => {
    const filter = byProductAdvanced('', null, null, null)
    expect(filter(makeProduct())).toBe(true)
  })

  it('filters by text (name)', () => {
    const filter = byProductAdvanced('Test', null, null, null)
    expect(filter(makeProduct())).toBe(true)
    expect(filter(makeProduct({ name: 'Other' }))).toBe(false)
  })

  it('filters by brand id', () => {
    const filter = byProductAdvanced('', 1, null, null)
    expect(filter(makeProduct())).toBe(true)
    expect(filter(makeProduct({ brand_id: 99 }))).toBe(false)
  })

  it('filters by supplier id', () => {
    const filter = byProductAdvanced('', null, 2, null)
    expect(filter(makeProduct())).toBe(true)
    expect(filter(makeProduct({ supplier_id: 99 }))).toBe(false)
  })

  it('filters by category id', () => {
    const filter = byProductAdvanced('', null, null, 3)
    expect(filter(makeProduct())).toBe(true)
    expect(filter(makeProduct({ categories: [] as Product['categories'] }))).toBe(false)
  })

  it('combines all filters', () => {
    const filter = byProductAdvanced('Test', 1, 2, 3)
    expect(filter(makeProduct())).toBe(true)
    expect(filter(makeProduct({ brand_id: 99 }))).toBe(false)
  })
})
