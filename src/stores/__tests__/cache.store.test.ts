import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCacheStore } from '../cache.store'

describe('cache.store', () => {
  let cache: ReturnType<typeof useCacheStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    cache = useCacheStore()
  })

  describe('flushBrands', () => {
    it('clears all when no uuid provided', () => {
      cache.brands.add('all')
      cache.brands.add('uuid-1')
      cache.flushBrands()
      expect(cache.brands.size).toBe(0)
    })

    it('removes specific uuid', () => {
      cache.brands.add('uuid-1')
      cache.brands.add('uuid-2')
      cache.flushBrands('uuid-1')
      expect(cache.brands.has('uuid-1')).toBe(false)
      expect(cache.brands.has('uuid-2')).toBe(true)
    })
  })

  describe('flushCategories', () => {
    it('clears all when no uuid', () => {
      cache.categories.add('all')
      cache.flushCategories()
      expect(cache.categories.size).toBe(0)
    })

    it('removes specific uuid', () => {
      cache.categories.add('uuid-1')
      cache.flushCategories('uuid-1')
      expect(cache.categories.has('uuid-1')).toBe(false)
    })
  })

  describe('flushProducts', () => {
    it('clears all when no uuid', () => {
      cache.products.add('all')
      cache.flushProducts()
      expect(cache.products.size).toBe(0)
    })

    it('removes specific uuid', () => {
      cache.products.add('uuid-1')
      cache.flushProducts('uuid-1')
      expect(cache.products.has('uuid-1')).toBe(false)
    })
  })

  describe('flushSuppliers', () => {
    it('clears all when no uuid', () => {
      cache.suppliers.add('all')
      cache.flushSuppliers()
      expect(cache.suppliers.size).toBe(0)
    })

    it('removes specific uuid', () => {
      cache.suppliers.add('uuid-1')
      cache.flushSuppliers('uuid-1')
      expect(cache.suppliers.has('uuid-1')).toBe(false)
    })
  })

  describe('computed getAll*', () => {
    it('getAllBrands is true when brands has "all"', () => {
      expect(cache.getAllBrands).toBe(false)
      cache.brands.add('all')
      expect(cache.getAllBrands).toBe(true)
    })

    it('getAllCategories is true when categories has "all"', () => {
      expect(cache.getAllCategories).toBe(false)
      cache.categories.add('all')
      expect(cache.getAllCategories).toBe(true)
    })

    it('getAllProducts is true when products has "all"', () => {
      expect(cache.getAllProducts).toBe(false)
      cache.products.add('all')
      expect(cache.getAllProducts).toBe(true)
    })

    it('getAllSuppliers is true when suppliers has "all"', () => {
      expect(cache.getAllSuppliers).toBe(false)
      cache.suppliers.add('all')
      expect(cache.getAllSuppliers).toBe(true)
    })
  })
})
