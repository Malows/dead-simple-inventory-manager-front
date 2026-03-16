import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import IndexPage from '../IndexPage.vue'
import { useProductsStore } from '../../../stores/products'
import { useBrandsStore } from '../../../stores/brands'
import { useCategoriesStore } from '../../../stores/categories'
import { useSuppliersStore } from '../../../stores/suppliers'

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

vi.mock('../tabs/StockTab.vue', () => ({
  default: {
    name: 'StockTab',
    template: '<div>StockTab</div>'
  }
}))

vi.mock('../tabs/PriceTab.vue', () => ({
  default: {
    name: 'PriceTab',
    template: '<div>PriceTab</div>'
  }
}))

describe('operations/IndexPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let productsStore: ReturnType<typeof useProductsStore>
  let brandsStore: ReturnType<typeof useBrandsStore>
  let categoriesStore: ReturnType<typeof useCategoriesStore>
  let suppliersStore: ReturnType<typeof useSuppliersStore>

  const mountComponent = () =>
    mount(IndexPage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createTestingPinia({ createSpy: vi.fn })
    productsStore = useProductsStore(pinia)
    brandsStore = useBrandsStore(pinia)
    categoriesStore = useCategoriesStore(pinia)
    suppliersStore = useSuppliersStore(pinia)

    vi.mocked(productsStore.getProducts).mockResolvedValue({ isOk: true } as never)
    vi.mocked(brandsStore.getBrands).mockResolvedValue({ isOk: true } as never)
    vi.mocked(categoriesStore.getCategories).mockResolvedValue({ isOk: true } as never)
    vi.mocked(suppliersStore.getSuppliers).mockResolvedValue({ isOk: true } as never)
  })

  it('renders the operations tabs and panels', () => {
    const wrapper = mountComponent()

    expect(wrapper.text()).toContain('operations.Operations')
    expect(wrapper.findComponent({ name: 'StockTab' }).exists()).toBe(true)
    expect(wrapper.text()).toContain('operations.stock')
    expect(wrapper.text()).toContain('operations.prices_by_group')
  })

  it('loads all required entities on mount and hides loader afterwards', async () => {
    mountComponent()
    await flushPromises()

    expect(mockLoadingShow).toHaveBeenCalledTimes(1)
    expect(productsStore.getProducts).toHaveBeenCalledTimes(1)
    expect(brandsStore.getBrands).toHaveBeenCalledTimes(1)
    expect(categoriesStore.getCategories).toHaveBeenCalledTimes(1)
    expect(suppliersStore.getSuppliers).toHaveBeenCalledTimes(1)
    expect(mockLoadingHide).toHaveBeenCalledTimes(1)
  })

  it('uses the error notifier when one of the initial loads fails', async () => {
    vi.mocked(categoriesStore.getCategories).mockRejectedValue(new Error('boom'))

    mountComponent()
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('operations.error_stock')
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
    expect(mockLoadingHide).toHaveBeenCalledTimes(1)
  })
})
