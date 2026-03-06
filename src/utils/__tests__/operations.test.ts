import { describe, it, expect } from 'vitest'

import { getQuantityInitialValue, isQuantityValid, getQuantityMax } from '../operations'

describe('operations utils', () => {
  describe('isQuantityValid', () => {
    it('returns false for non-finite or negative quantities', () => {
      expect(isQuantityValid('purchase', -1, 10)).toBe(false)
      expect(isQuantityValid('sale', Number.NaN, 10)).toBe(false)
    })

    it('returns true for valid quantities and non-sale movements', () => {
      expect(isQuantityValid('purchase', 5, 10)).toBe(true)
      expect(isQuantityValid('adjustment', 5, 10)).toBe(true)
    })

    it('returns true if sale quantity is less than or equal to stock', () => {
      expect(isQuantityValid('sale', 5, 10)).toBe(true)
      expect(isQuantityValid('sale', 10, 10)).toBe(true)
    })

    it('returns false if sale quantity is greater than stock', () => {
      expect(isQuantityValid('sale', 11, 10)).toBe(false)
    })
  })

  describe('quantity constraints', () => {
    it('returns quantity initial values by movement', () => {
      expect(getQuantityInitialValue('purchase', 5)).toBe(0)
      expect(getQuantityInitialValue('return', 5)).toBe(0)
      expect(getQuantityInitialValue('sale', 5)).toBe(0)
      expect(getQuantityInitialValue('adjustment', 5)).toBe(5)
    })

    it('returns max only for sale', () => {
      expect(getQuantityMax('sale', 8)).toBe(8)
      expect(getQuantityMax('purchase', 8)).toBeUndefined()
      expect(getQuantityMax('return', 8)).toBeUndefined()
      expect(getQuantityMax('adjustment', 8)).toBeUndefined()
    })

    it('validates quantity boundaries by movement', () => {
      expect(isQuantityValid('sale', 3, 5)).toBe(true)
      expect(isQuantityValid('sale', 6, 5)).toBe(false)
      expect(isQuantityValid('purchase', 999, 5)).toBe(true)
      expect(isQuantityValid('adjustment', 0, 5)).toBe(true)
      expect(isQuantityValid('return', -1, 5)).toBe(false)
    })
  })
})
