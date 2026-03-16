import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import IndexPage from '../IndexPage.vue'
import { useBrandsStore } from '../../../stores/brands'
import { mockBrand } from './mocks'

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
    props: ['items', 'itemsPerPage'],
    template: '<div><slot v-if="items?.length" :item="items[0]" /></div>'
  }
}))

vi.mock('../../../components/listItems/BrandItem.vue', () => ({
  default: {
    name: 'BrandItem',
    props: ['brand'],
    template: '<article>{{ brand?.name }}</article>'
  }
}))

describe('brands/IndexPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useBrandsStore>

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
        brands: {
          brands: [mockBrand]
        }
      }
    })
    store = useBrandsStore(pinia)
    vi.mocked(store.getBrands).mockResolvedValue({ isOk: true } as never)
  })

  it('renders the brand list inside the page wrapper', () => {
    const wrapper = mountComponent()

    expect(wrapper.findComponent({ name: 'PageWithAdd' }).props('title')).toBe('brands.Brands')
    expect(wrapper.findComponent({ name: 'FilterableList' }).props('items')).toEqual([mockBrand])
    expect(wrapper.findComponent({ name: 'BrandItem' }).props('brand')).toEqual(mockBrand)
  })

  it('fetches brands on mount and hides the loader afterwards', async () => {
    mountComponent()
    await flushPromises()

    expect(mockLoadingShow).toHaveBeenCalledTimes(1)
    expect(store.getBrands).toHaveBeenCalledTimes(1)
    expect(mockLoadingHide).toHaveBeenCalledTimes(1)
  })

  it('uses the error notifier when the fetch fails', async () => {
    vi.mocked(store.getBrands).mockRejectedValue(new Error('boom'))

    mountComponent()
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('brands.error_fetching')
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
    expect(mockLoadingHide).toHaveBeenCalledTimes(1)
  })
})
