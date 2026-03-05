import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import ProductForm from '../ProductForm.vue'
import { mockProduct } from '../../__tests__/mocks'

vi.mock('../../../stores/products', () => ({
  useProductsStore: vi.fn(() => ({
    forceGetProducts: vi.fn()
  }))
}))
vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key: string) => key)
  }))
}))

const mountComponent = (props = {}) =>
  mount(ProductForm, {
    props: { ...props },
    global: {
      plugins: [createTestingPinia({
        initialState: {
          categories: { categoriesOptions: [{ label: 'Test Category', value: 1 }] },
          brands: { brandsOptions: [{ label: 'Test Brand', value: 1 }] },
          suppliers: { suppliersOptions: [{ label: 'Test Supplier', value: 1 }] }
        }
      })]
    }
  })

describe('ProductForm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form inputs', () => {
    const wrapper = mountComponent()
    expect(wrapper.findComponent({ name: 'QInput' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'QSelect' }).exists()).toBe(true)
  })

  it('binds v-model correctly for name', async () => {
    const wrapper = mountComponent()
    wrapper.vm.name = 'Test Product'
    expect(wrapper.emitted('update:name')?.[0]).toEqual(['Test Product'])
  })

  it('binds v-model correctly for price', async () => {
    const wrapper = mountComponent()
    wrapper.vm.price = 10.5
    expect(wrapper.emitted('update:price')?.[0]).toEqual([10.5])
  })

  it('binds v-model correctly for stock', async () => {
    const wrapper = mountComponent()
    wrapper.vm.stock = 100
    expect(wrapper.emitted('update:stock')?.[0]).toEqual([100])
  })

  it('binds v-model correctly for categories', async () => {
    const wrapper = mountComponent()
    wrapper.vm.categories = [1, 2]
    expect(wrapper.emitted('update:categories')?.[0]).toEqual([[1, 2]])
  })
})
