import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import IndexPage from '../IndexPage.vue'
import { useCategoriesStore } from '../../../stores/categories'
import { mockCategory } from './mocks'

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

vi.mock('../../../components/listItems/CategoryItem.vue', () => ({
  default: {
    name: 'CategoryItem',
    props: ['category'],
    template: '<article>{{ category?.name }}</article>'
  }
}))

describe('categories/IndexPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useCategoriesStore>

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
        categories: {
          categories: [mockCategory]
        }
      }
    })
    store = useCategoriesStore(pinia)
    vi.mocked(store.getCategories).mockResolvedValue({ isOk: true } as never)
  })

  it('renders the category list inside the page wrapper', () => {
    const wrapper = mountComponent()

    expect(wrapper.findComponent({ name: 'PageWithAdd' }).props('title')).toBe('categories.Categories')
    expect(wrapper.findComponent({ name: 'FilterableList' }).props('items')).toEqual([mockCategory])
    expect(wrapper.findComponent({ name: 'CategoryItem' }).props('category')).toEqual(mockCategory)
  })

  it('fetches categories on mount and hides the loader afterwards', async () => {
    mountComponent()
    await flushPromises()

    expect(mockLoadingShow).toHaveBeenCalledTimes(1)
    expect(store.getCategories).toHaveBeenCalledTimes(1)
    expect(mockLoadingHide).toHaveBeenCalledTimes(1)
  })

  it('uses the error notifier when the fetch fails', async () => {
    vi.mocked(store.getCategories).mockRejectedValue(new Error('boom'))

    mountComponent()
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('categories.error_fetching')
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
    expect(mockLoadingHide).toHaveBeenCalledTimes(1)
  })
})
