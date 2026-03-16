import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import IndexPage from '../IndexPage.vue'
import { useProductsStore } from '../../stores/products'

// Mock components
vi.mock('../../components/listItems/HomeItem.vue', () => ({
  default: {
    name: 'HomeItem',
    template: '<div>HomeItem</div>'
  }
}))
vi.mock('../../components/filterable/FilterableList.vue', () => ({
  default: {
    name: 'FilterableList',
    template: '<div>FilterableList</div>'
  }
}))
vi.mock('../../components/dialogs/ProductStockDialog.vue', () => ({
  default: {
    name: 'ProductStockDialog',
    template: '<div>ProductStockDialog</div>'
  }
}))

// Mock useNotify
vi.mock('../../composition/useNotify', () => ({
  useNotify: () => ({ errorNotify: vi.fn() })
}))

// Mock filters
vi.mock('../../utils/filters', () => ({
  byProduct: vi.fn()
}))

// Mock useQuasar partially
vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useQuasar: vi.fn(() => ({
      loading: { show: vi.fn(), hide: vi.fn() }
    }))
  }
})

describe('IndexPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useProductsStore>

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createTestingPinia({
      initialState: {
        products: { products: [{ id: 1, name: 'Test Product', code: 'TP001' }] }
      }
    })
    store = useProductsStore(pinia)
    vi.spyOn(store, 'getProducts').mockResolvedValue({ isOk: true })
  })

  const mountComponent = () =>
    mount(IndexPage, {
      global: {
        plugins: [pinia]
      }
    })

  it('renders page structure', () => {
    const wrapper = mountComponent()
    expect(wrapper.findComponent({ name: 'FilterableList' }).exists()).toBe(true)
  })

  it('calls getProducts on mount', async () => {
    const wrapper = mountComponent()
    await wrapper.vm.$nextTick()
    expect(store.getProducts).toHaveBeenCalled()
  })

  it('computes codePadding correctly', () => {
    const wrapper = mountComponent()
    expect((wrapper.vm as any).codePadding).toBe(5) // 'TP001'.length
  })
})
