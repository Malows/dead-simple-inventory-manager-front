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

  it('resets quantities when movementType is null in setMovementType', () => {
    const store = useOperationsStore()
    store.setSelectedProducts([mockProducts[0]])
    store.setMovementType('sale')
    store.setQuantity(mockProducts[0].uuid, 5)
    expect(store.quantities[mockProducts[0].uuid]).toBe(5)

    store.setMovementType(null)
    expect(store.movementType).toBeNull()
    expect(store.quantities).toEqual({})
  })

  it('resets quantities when movementType is null in syncQuantitiesForSelection', () => {
    const store = useOperationsStore()
    // By default movementType is null
    store.setSelectedProducts([mockProducts[0]])
    expect(store.quantities).toEqual({})
  })

  it('keeps existing quantity when syncing for selection', () => {
    const store = useOperationsStore()
    store.setMovementType('sale')
    store.setSelectedProducts([mockProducts[0]])
    store.setQuantity(mockProducts[0].uuid, 5)

    // Re-select products including the same one
    store.setSelectedProducts([mockProducts[0], mockProducts[1]])
    expect(store.quantities[mockProducts[0].uuid]).toBe(5)
    expect(store.quantities[mockProducts[1].uuid]).toBe(0)
  })

  it('canContinue is false if movementType is null', () => {
    const store = useOperationsStore()
    store.setSelectedProducts([mockProducts[0]])
    expect(store.movementType).toBeNull()
    expect(store.canContinue).toBe(false)
  })

  it('canContinue is false if no products selected', () => {
    const store = useOperationsStore()
    store.setMovementType('sale')
    expect(store.selectedProducts).toHaveLength(0)
    expect(store.canContinue).toBe(false)
  })

  it('stockChanges is empty if movementType is null', () => {
    const store = useOperationsStore()
    store.setSelectedProducts([mockProducts[0]])
    expect(store.stockChanges).toEqual([])
  })

  it('setQuantity handles invalid values', () => {
    const store = useOperationsStore()
    store.setQuantity('uuid', NaN)
    expect(store.quantities['uuid']).toBe(0)

    store.setQuantity('uuid', -10)
    expect(store.quantities['uuid']).toBe(0)
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
