import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useOperationsStore } from '../operations'
import { mockProducts } from '../../components/__tests__/mocks'

describe('operations store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with initial state', () => {
    const store = useOperationsStore()

    expect(store.step).toBe(1)
    expect(store.movementType).toBeNull()
    expect(store.selectedProducts).toEqual([])
    expect(store.quantities).toEqual({})
    expect(store.canConfirm).toBe(false)
  })

  it('sets adjustment quantities from current stock', () => {
    const store = useOperationsStore()

    store.setMovementType('adjustment')
    store.setSelectedProducts([mockProducts[0], mockProducts[1]])

    expect(store.quantities[mockProducts[0].uuid]).toBe(mockProducts[0].stock)
    expect(store.quantities[mockProducts[1].uuid]).toBe(mockProducts[1].stock)
  })

  it('resets quantities to zero when switching to sale', () => {
    const store = useOperationsStore()

    store.setMovementType('adjustment')
    store.setSelectedProducts([mockProducts[0]])
    store.setMovementType('sale')

    expect(store.quantities[mockProducts[0].uuid]).toBe(0)
  })

  it('builds stock changes according to movement strategy', () => {
    const store = useOperationsStore()
    const product = mockProducts[0]

    store.setSelectedProducts([product])

    store.setMovementType('sale')
    store.setQuantity(product.uuid, 3)
    expect(store.stockChanges).toEqual([{ id: product.id, value: product.stock - 3 }])

    store.setMovementType('purchase')
    store.setQuantity(product.uuid, 3)
    expect(store.stockChanges).toEqual([{ id: product.id, value: product.stock + 3 }])

    store.setMovementType('adjustment')
    store.setQuantity(product.uuid, 3)
    expect(store.stockChanges).toEqual([{ id: product.id, value: 3 }])
  })

  it('enforces movement rules in canConfirm', () => {
    const store = useOperationsStore()
    const product = mockProducts[1]

    store.setSelectedProducts([product])

    store.setMovementType('sale')
    store.setQuantity(product.uuid, 0)
    expect(store.canConfirm).toBe(false)

    store.setQuantity(product.uuid, product.stock + 1)
    expect(store.canConfirm).toBe(false)

    store.setQuantity(product.uuid, product.stock)
    expect(store.canConfirm).toBe(true)

    store.setMovementType('adjustment')
    store.setQuantity(product.uuid, 0)
    expect(store.canConfirm).toBe(true)
  })

  it('resets all operation state', () => {
    const store = useOperationsStore()

    store.setMovementType('purchase')
    store.setSelectedProducts([mockProducts[0]])
    store.setQuantity(mockProducts[0].uuid, 3)
    store.goToStep(3)

    store.resetAll()

    expect(store.step).toBe(1)
    expect(store.movementType).toBeNull()
    expect(store.selectedProducts).toEqual([])
    expect(store.quantities).toEqual({})
  })
})
