import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import StockProductsStep from '../StockProductsStep.vue'
import { useOperationsStore } from '../../../../stores/operations'
import { mockProduct } from '../../../__tests__/mocks'

vi.mock('../../../stores/products', () => ({
  useProductsStore: vi.fn(() => ({
    products: [mockProduct]
  }))
}))

vi.mock('../../../stores/brands', () => ({
  useBrandsStore: vi.fn(() => ({
    brandsOptions: [{ label: 'Test Brand', value: 1 }]
  }))
}))

vi.mock('../../../stores/categories', () => ({
  useCategoriesStore: vi.fn(() => ({
    categoriesOptions: [{ label: 'Test Category', value: 1 }]
  }))
}))

vi.mock('../../../stores/suppliers', () => ({
  useSuppliersStore: vi.fn(() => ({
    suppliersOptions: [{ label: 'Test Supplier', value: 1 }]
  }))
}))

vi.mock('../TransferList.vue', () => ({
  default: {
    name: 'TransferList',
    template: '<div>Mock TransferList</div>'
  }
}))

vi.mock('../StockControls.vue', () => ({
  default: {
    name: 'StockControls',
    template: '<div>Mock StockControls</div>',
    props: ['brand', 'category', 'supplier', 'search', 'brandsOptions', 'suppliersOptions', 'categoriesOptions']
  }
}))

const mountComponent = () => {
  setActivePinia(createPinia())
  return mount(StockProductsStep)
}

describe('StockProductsStep.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders StockControls and TransferList components', () => {
    const wrapper = mountComponent()
    expect(wrapper.findComponent({ name: 'StockControls' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'TransferList' }).exists()).toBe(true)
  })

  it('emits next event when next button is clicked and canContinue is true', async () => {
    const wrapper = mountComponent()
    const operationsStore = useOperationsStore()

    operationsStore.setMovementType('sale')
    operationsStore.setSelectedProducts([mockProduct])
    operationsStore.setQuantity(mockProduct.uuid, 1)

    await wrapper.vm.$nextTick()

    const nextBtn = wrapper.findAllComponents({ name: 'QBtn' }).find(btn => btn.props('label') === 'Next')
    await nextBtn?.trigger('click')

    expect(wrapper.emitted('next')).toBeTruthy()
  })

  it('emits back event when back button is clicked', async () => {
    const wrapper = mountComponent()

    const backBtn = wrapper.findAllComponents({ name: 'QBtn' }).find(btn => btn.props('label') === 'Back')
    await backBtn?.trigger('click')

    expect(wrapper.emitted('back')).toBeTruthy()
  })

  it('disables next button when canContinue is false', () => {
    const wrapper = mountComponent()

    const nextBtn = wrapper.findAllComponents({ name: 'QBtn' }).find(btn => btn.props('label') === 'Next')
    expect(nextBtn?.props('disable')).toBe(true)
  })

  it('enables next button when canContinue is true', async () => {
    const wrapper = mountComponent()
    const operationsStore = useOperationsStore()

    operationsStore.setMovementType('sale')
    operationsStore.setSelectedProducts([mockProduct])
    operationsStore.setQuantity(mockProduct.uuid, 1)

    await wrapper.vm.$nextTick()

    const nextBtn = wrapper.findAllComponents({ name: 'QBtn' }).find(btn => btn.props('label') === 'Next')
    expect(nextBtn?.props('disable')).toBe(false)
  })
})
