import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import { useOperationsStore } from '../../../../stores/operations'
import type { StockMovementType } from '../../../../types/operations.interfaces'
import { mockProducts } from '../../../__tests__/mocks'

import StockReviewStep from '../StockReviewStep.vue'

const mockMovement = {
  value: 'purchase' as StockMovementType,
  label: 'Purchase',
  description: 'Purchase description',
  action: 'Increase stock',
  icon: 'add',
  color: 'positive'
}

const mountComponent = (props = {}) =>
  mount(StockReviewStep, {
    props: {
      movement: mockMovement,
      canConfirm: true,
      ...props
    }
  })

describe('StockReviewStep.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const operationsStore = useOperationsStore()
    operationsStore.setMovementType('purchase')
    operationsStore.setSelectedProducts(mockProducts.slice(0, 2))
    operationsStore.setQuantity(mockProducts[0].uuid, 5)
    operationsStore.setQuantity(mockProducts[1].uuid, 10)
  })

  it('renders movement info when movement exists', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Purchase')
    expect(wrapper.text()).toContain('Increase stock')
    expect(wrapper.findComponent({ name: 'QChip' }).exists()).toBe(true)
  })

  it('renders product list with quantities from store', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain(mockProducts[0].name)
    expect(wrapper.text()).toContain('Quantity: 5')
    expect(wrapper.text()).toContain(mockProducts[1].name)
    expect(wrapper.text()).toContain('Quantity: 10')
  })

  it('shows total products count', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('2 products')
  })

  it('enables confirm button when canConfirm is true', () => {
    const wrapper = mountComponent({ canConfirm: true })
    const btns = wrapper.findAllComponents({ name: 'QBtn' })
    const confirmBtn = btns.find(btn => btn.props('label') === 'Confirm and execute')
    expect(confirmBtn?.props('disable')).toBe(false)
  })

  it('disables confirm button when canConfirm is false', () => {
    const wrapper = mountComponent({ canConfirm: false })
    const btns = wrapper.findAllComponents({ name: 'QBtn' })
    const confirmBtn = btns.find(btn => btn.props('label') === 'Confirm and execute')
    expect(confirmBtn?.props('disable')).toBe(true)
  })

  it('emits confirm when confirm button is clicked', async () => {
    const wrapper = mountComponent()
    const btns = wrapper.findAllComponents({ name: 'QBtn' })
    const confirmBtn = btns.find(btn => btn.props('label') === 'Confirm and execute')
    await confirmBtn?.trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('emits back when back button is clicked', async () => {
    const wrapper = mountComponent()
    const btns = wrapper.findAllComponents({ name: 'QBtn' })
    const backBtn = btns.find(btn => btn.props('label') === 'Back')
    await backBtn?.trigger('click')
    expect(wrapper.emitted('back')).toBeTruthy()
  })

  it('shows empty message when no products', () => {
    const operationsStore = useOperationsStore()
    operationsStore.setSelectedProducts([])
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('No products selected')
  })
})
