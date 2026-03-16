import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import IndexPage from '../IndexPage.vue'
import { useProductsStore } from '../../../stores/products'
import { byProduct } from '../../../utils/filters'
import { mockProduct } from './mocks'

const {
  mockLoadingShow,
  mockLoadingHide,
  mockErrorNotify,
  mockErrorHandler
} = vi.hoisted(() => ({
  mockLoadingShow: vi.fn(),
  mockLoadingHide: vi.fn(),
  mockErrorNotify: vi.fn(),
  mockErrorHandler: vi.fn()
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

vi.mock('../../../composition/useNotify', () => ({
  useNotify: () => ({
    errorNotify: mockErrorNotify.mockReturnValue(mockErrorHandler)
  })
}))

vi.mock('../../../utils/filters', () => ({
  byProduct: vi.fn()
}))

vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal<typeof import('quasar')>()
  return {
    ...actual,
    useQuasar: vi.fn(() => ({
      loading: {
        show: mockLoadingShow,
        hide: mockLoadingHide
      }
    }))
  }
})

vi.mock('../../../components/pages/PageWithAdd.vue', () => ({
  default: {
    name: 'PageWithAdd',
    props: ['title', 'to'],
    template: '<section><header>{{ title }}</header><slot /></section>'
  }
}))

vi.mock('../../../components/filterable/FilterableList.vue', () => ({
  default: {
    name: 'FilterableList',
    props: ['items', 'filterFn', 'itemsPerPage'],
    template: '<div><slot v-if="items?.length" :item="items[0]" /></div>'
  }
}))

vi.mock('../../../components/listItems/ProductItem.vue', () => ({
  default: {
    name: 'ProductItem',
    props: ['product', 'codePadding'],
    template: '<article>{{ product?.name }}</article>'
  }
}))

describe('products/IndexPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useProductsStore>

  const mountComponent = () =>
    mount(IndexPage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        products: {
          products: [mockProduct]
        }
      }
    })
    store = useProductsStore(pinia)
    vi.mocked(store.getProducts).mockResolvedValue({ isOk: true } as never)
  })

  it('renders the product list inside the page wrapper', () => {
    const wrapper = mountComponent()

    expect(wrapper.findComponent({ name: 'PageWithAdd' }).props('title')).toBe('products.Products')
    expect(wrapper.findComponent({ name: 'FilterableList' }).props('items')).toEqual([mockProduct])
    expect(wrapper.findComponent({ name: 'FilterableList' }).props('filterFn')).toBe(byProduct)
    expect(wrapper.findComponent({ name: 'ProductItem' }).props('product')).toEqual(mockProduct)
    expect(wrapper.findComponent({ name: 'ProductItem' }).props('codePadding')).toBe(mockProduct.code.length)
  })

  it('fetches products on mount and hides the loader afterwards', async () => {
    mountComponent()
    await flushPromises()

    expect(mockLoadingShow).toHaveBeenCalledTimes(1)
    expect(store.getProducts).toHaveBeenCalledTimes(1)
    expect(mockLoadingHide).toHaveBeenCalledTimes(1)
  })

  it('uses the error notifier when the fetch fails', async () => {
    vi.mocked(store.getProducts).mockRejectedValue(new Error('boom'))

    mountComponent()
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('products.error_fetching')
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
    expect(mockLoadingHide).toHaveBeenCalledTimes(1)
  })
})
