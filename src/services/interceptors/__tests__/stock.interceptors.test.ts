import { describe, it, expect } from 'vitest'

import type { Product } from '../../../types/product.interfaces'
import { parseStockChanges } from '../stock.interceptors'

const productA = {
  id: 1,
  uuid: 'p-a',
  stock: 10
} as Product

const productB = {
  id: 2,
  uuid: 'p-b',
  stock: 5
} as Product

describe('stock.interceptors', () => {
  describe('parseStockChanges', () => {
    it('adds quantity for purchase and return', () => {
      const purchaseChanges = parseStockChanges('purchase', [productA], { 'p-a': 3 })
      const returnChanges = parseStockChanges('return', [productB], { 'p-b': 4 })

      expect(purchaseChanges).toEqual([{ id: 1, value: 13 }])
      expect(returnChanges).toEqual([{ id: 2, value: 9 }])
    })

    it('subtracts quantity for sale', () => {
      const changes = parseStockChanges('sale', [productA], { 'p-a': 3 })
      expect(changes).toEqual([{ id: 1, value: 7 }])
    })

    it('uses input quantity directly for adjustment', () => {
      const changes = parseStockChanges('adjustment', [productB], { 'p-b': 3 })
      expect(changes).toEqual([{ id: 2, value: 3 }])
    })

    it('normalizes invalid quantities to zero', () => {
      const changes = parseStockChanges('purchase', [productA], { 'p-a': Number.NaN })
      expect(changes).toEqual([{ id: 1, value: 10 }])
    })
  })
})
