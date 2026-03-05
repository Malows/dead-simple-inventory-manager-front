import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

import StockTab from '../StockTab.vue'
import { mockProduct } from '../../../__tests__/mocks'

let mockExecute: ReturnType<typeof vi.fn>
let mockAdjustStock: ReturnType<typeof vi.fn>

vi.mock('../../../composition/components/useBulkSubmit', () => ({
  useBulkSubmit: () => ({ execute: mockExecute })
}))
vi.mock('../../../services/BulkOperationService', () => ({
  bulkOperationService: {
    adjustStock: mockAdjustStock
  }
}))
vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key: string) => key)
  }))
}))

vi.mock('./steps/StockMovementStep.vue', () => ({
  default: {
    name: 'StockMovementStep',
    template: '<div>Mock StockMovementStep</div>',
    data: () => ({
      movementOptions: [{ label: 'Add Stock', value: 'add' }]
    })
  }
}))
vi.mock('./steps/StockProductsStep.vue', () => ({
  default: {
    name: 'StockProductsStep',
    template: '<div>Mock StockProductsStep</div>'
  }
}))
vi.mock('./steps/StockReviewStep.vue', () => ({
  default: {
    name: 'StockReviewStep',
    template: '<div>Mock StockReviewStep</div>'
  }
}))

describe('StockTab.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockExecute = vi.fn()
    mockAdjustStock = vi.fn()
  })

  it('starts with step 1', () => {
    const wrapper = mount(StockTab)
    expect(wrapper.vm.step).toBe(1)
  })

  it('advances to step 2 on next from StockMovementStep', async () => {
    const wrapper = mount(StockTab)
    const movementStep = wrapper.findComponent({ name: 'StockMovementStep' })
    await movementStep.vm.$emit('next')
    expect(wrapper.vm.step).toBe(2)
  })

  it('advances to step 3 on next from StockProductsStep', async () => {
    const wrapper = mount(StockTab, {
      data: () => ({ step: 2 })
    })
    const productsStep = wrapper.findComponent({ name: 'StockProductsStep' })
    await productsStep.vm.$emit('next')
    expect(wrapper.vm.step).toBe(3)
  })

  it('goes back to step 1 on back from StockProductsStep', async () => {
    const wrapper = mount(StockTab, {
      data: () => ({ step: 2 })
    })
    const productsStep = wrapper.findComponent({ name: 'StockProductsStep' })
    await productsStep.vm.$emit('back')
    expect(wrapper.vm.step).toBe(1)
  })

  it('goes back to step 2 on back from StockReviewStep', async () => {
    const wrapper = mount(StockTab, {
      data: () => ({ step: 3 })
    })
    const reviewStep = wrapper.findComponent({ name: 'StockReviewStep' })
    await reviewStep.vm.$emit('back')
    expect(wrapper.vm.step).toBe(2)
  })

  it('submits when confirm is emitted from StockReviewStep', async () => {
    const wrapper = mount(StockTab, {
      data: () => ({
        step: 3,
        movementType: 'add',
        selectedProducts: [mockProduct],
        quantities: { [mockProduct.uuid]: 5 }
      })
    })
    const reviewStep = wrapper.findComponent({ name: 'StockReviewStep' })
    await reviewStep.vm.$emit('confirm')
    expect(mockExecute).toHaveBeenCalledWith(
      expect.any(Function),
      'operations.stock_updated',
      'operations.error_stock',
      expect.any(Function)
    )
  })

  it('resets state on successful submit', async () => {
    mockExecute.mockImplementation(async (action, success, error, onSuccess) => {
      onSuccess()
    })
    const wrapper = mount(StockTab, {
      data: () => ({
        step: 3,
        movementType: 'add',
        selectedProducts: [mockProduct],
        quantities: { [mockProduct.uuid]: 5 }
      })
    })
    const reviewStep = wrapper.findComponent({ name: 'StockReviewStep' })
    await reviewStep.vm.$emit('confirm')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.step).toBe(1)
    expect(wrapper.vm.movementType).toBe(null)
    expect(wrapper.vm.selectedProducts).toEqual([])
    expect(wrapper.vm.quantities).toEqual({})
  })

  it('does not submit if canConfirm is false', async () => {
    const wrapper = mount(StockTab, {
      data: () => ({
        step: 3,
        movementType: null
      })
    })
    const reviewStep = wrapper.findComponent({ name: 'StockReviewStep' })
    await reviewStep.vm.$emit('confirm')
    expect(mockExecute).not.toHaveBeenCalled()
  })
})
