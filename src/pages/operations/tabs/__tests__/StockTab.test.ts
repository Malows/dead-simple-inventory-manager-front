import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import { useOperationsStore } from '../../../../stores/operations'
import { mockProduct } from '../../../__tests__/mocks'
import StockTab from '../StockTab.vue'

const { mockAdjustStock, mockExecute } = vi.hoisted(() => ({
  mockAdjustStock: vi.fn(),
  mockExecute: vi.fn()
}))

vi.mock('../../../../composition/components/useBulkSubmit', () => ({
  useBulkSubmit: () => ({ execute: mockExecute })
}))

vi.mock('../../../../services/BulkOperationService', () => ({
  bulkOperationService: {
    adjustStock: mockAdjustStock
  }
}))

vi.mock('../../steps/StockMovementStep.vue', () => ({
  default: {
    name: 'StockMovementStep',
    template: '<div>Mock StockMovementStep</div>',
    data: () => ({
      movementOptions: [{ label: 'Sale', value: 'sale' }]
    })
  }
}))

vi.mock('../../steps/StockProductsStep.vue', () => ({
  default: {
    name: 'StockProductsStep',
    template: '<div>Mock StockProductsStep</div>'
  }
}))

vi.mock('../../steps/StockReviewStep.vue', () => ({
  default: {
    name: 'StockReviewStep',
    template: '<div>Mock StockReviewStep</div>'
  }
}))

const mountComponent = () => {
  setActivePinia(createPinia())

  return mount(StockTab)
}

describe('StockTab.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockExecute.mockImplementation((action) => action())
    mockAdjustStock.mockResolvedValue({
      isOk: true,
      code: 200,
      data: { affected_resources: 1, message: 'OK' },
      error: null,
      message: ''
    })
  })

  it('starts with step 1', () => {
    mountComponent()
    const operationsStore = useOperationsStore()
    expect(operationsStore.step).toBe(1)
  })

  it('advances to step 2 on next from StockMovementStep', async () => {
    const wrapper = mountComponent()

    const movementStep = wrapper.findComponent({ name: 'StockMovementStep' })
    await movementStep.vm.$emit('next')

    const operationsStore = useOperationsStore()
    expect(operationsStore.step).toBe(2)
  })

  it('advances to step 3 on next from StockProductsStep', async () => {
    const wrapper = mountComponent()
    const operationsStore = useOperationsStore()
    operationsStore.goToStep(2)

    await wrapper.vm.$nextTick()
    const productsStep = wrapper.findComponent({ name: 'StockProductsStep' })
    await productsStep.vm.$emit('next')

    expect(operationsStore.step).toBe(3)
  })

  it('goes back to step 1 on back from StockProductsStep', async () => {
    const wrapper = mountComponent()
    const operationsStore = useOperationsStore()
    operationsStore.goToStep(2)

    await wrapper.vm.$nextTick()
    const productsStep = wrapper.findComponent({ name: 'StockProductsStep' })
    await productsStep.vm.$emit('back')

    expect(operationsStore.step).toBe(1)
  })

  it('goes back to step 2 on back from StockReviewStep', async () => {
    const wrapper = mountComponent()
    const operationsStore = useOperationsStore()
    operationsStore.goToStep(3)

    await wrapper.vm.$nextTick()
    const reviewStep = wrapper.findComponent({ name: 'StockReviewStep' })
    await reviewStep.vm.$emit('back')

    expect(operationsStore.step).toBe(2)
  })

  it('submits transformed payload for sale movement', async () => {
    const wrapper = mountComponent()
    const operationsStore = useOperationsStore()

    operationsStore.setMovementType('sale')
    operationsStore.setSelectedProducts([mockProduct])
    operationsStore.setQuantity(mockProduct.uuid, 3)
    operationsStore.goToStep(3)

    await wrapper.vm.$nextTick()
    const reviewStep = wrapper.findComponent({ name: 'StockReviewStep' })
    await reviewStep.vm.$emit('confirm')

    expect(mockExecute).toHaveBeenCalledWith(
      expect.any(Function),
      'operations.stock_updated',
      'operations.error_stock',
      expect.any(Function)
    )

    expect(mockAdjustStock).toHaveBeenCalledWith({
      type: 'sale',
      changes: [{ id: mockProduct.id, value: mockProduct.stock - 3 }]
    })
  })

  it('resets state on successful submit', async () => {
    mockExecute.mockImplementation(async (action, _success, _error, onSuccess) => {
      await action()
      onSuccess()
    })

    const wrapper = mountComponent()
    const operationsStore = useOperationsStore()

    operationsStore.setMovementType('purchase')
    operationsStore.setSelectedProducts([mockProduct])
    operationsStore.setQuantity(mockProduct.uuid, 5)
    operationsStore.goToStep(3)

    await wrapper.vm.$nextTick()
    const reviewStep = wrapper.findComponent({ name: 'StockReviewStep' })
    await reviewStep.vm.$emit('confirm')
    await wrapper.vm.$nextTick()

    expect(operationsStore.step).toBe(1)
    expect(operationsStore.movementType).toBeNull()
    expect(operationsStore.selectedProducts).toEqual([])
    expect(operationsStore.quantities).toEqual({})
  })

  it('does not submit if canConfirm is false', async () => {
    const wrapper = mountComponent()
    const operationsStore = useOperationsStore()

    operationsStore.goToStep(3)

    await wrapper.vm.$nextTick()
    const reviewStep = wrapper.findComponent({ name: 'StockReviewStep' })
    await reviewStep.vm.$emit('confirm')

    expect(mockExecute).not.toHaveBeenCalled()
    expect(mockAdjustStock).not.toHaveBeenCalled()
  })
})
