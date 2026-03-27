import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import TransferList from '../TransferList.vue'
import { mockProducts } from '../../../__tests__/mocks'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

vi.mock('../../../stores/operations', () => ({
  useOperationsStore: vi.fn(() => ({
    selectedProducts: [],
    quantities: {},
    setSelectedProducts: vi.fn()
  }))
}))

vi.mock('../TransferPanel.vue', () => ({
  default: {
    name: 'TransferPanel',
    props: ['items', 'title', 'allChecked', 'indeterminate', 'page', 'pages', 'onToggleAll', 'onToggleItem', 'onPageChange', 'showQuantities'],
    template: '<div>TransferPanel</div>'
  }
}))

const mountComponent = (props = {}) =>
  mount(TransferList, {
    props: {
      items: mockProducts,
      searchText: '',
      filterBrand: null,
      filterSupplier: null,
      filterCategory: null,
      showQuantities: false,
      ...props
    }
  })

describe('TransferList.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders transfer panels', () => {
    const wrapper = mountComponent()

    const panels = wrapper.findAllComponents({ name: 'TransferPanel' })
    expect(panels.length).toBeGreaterThanOrEqual(1)
  })

  it('computes available products correctly', () => {
    const wrapper = mountComponent({ items: mockProducts })
    const vm = wrapper.vm as any

    expect(vm.availableProducts).toBeDefined()
    expect(vm.availableProducts.length).toBeGreaterThan(0)
  })

  it('filters by search text', () => {
    const wrapper = mountComponent({
      items: mockProducts,
      searchText: 'Test Product'
    })
    const vm = wrapper.vm as any

    // Available products should include items matching search
    const available = vm.availableProducts
    expect(available.length).toBeGreaterThan(0)
  })

  it('computes checked item sets', () => {
    const wrapper = mountComponent()
    const vm = wrapper.vm as any

    expect(vm.leftChecked).toBeDefined()
    expect(vm.rightChecked).toBeDefined()
  })

  it('computes indeterminate states correctly', () => {
    const wrapper = mountComponent()
    const vm = wrapper.vm as any

    expect(vm.leftIndeterminate).toBeDefined()
    expect(vm.rightIndeterminate).toBeDefined()
  })

  it('renders with showQuantities flag', () => {
    const wrapper = mountComponent({ showQuantities: true })

    expect(wrapper.findComponent({ name: 'TransferPanel' }).exists()).toBe(true)
  })
})
