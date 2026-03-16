import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import EditPage from '../EditPage.vue'
import { useCategoriesStore } from '../../../stores/categories'
import { mockCategory } from './mocks'

const {
  mockGoodNotify,
  mockGoodHandler,
  mockErrorNotify,
  mockErrorHandler,
  mockRoute
} = vi.hoisted(() => ({
  mockGoodNotify: vi.fn(),
  mockGoodHandler: vi.fn(),
  mockErrorNotify: vi.fn(),
  mockErrorHandler: vi.fn(),
  mockRoute: {
    params: {
      categoryId: 'category-uuid-123'
    }
  }
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => mockRoute
  }
})

vi.mock('../../../composition/useNotify', () => ({
  useNotify: () => ({
    goodNotify: mockGoodNotify.mockReturnValue(mockGoodHandler),
    errorNotify: mockErrorNotify.mockReturnValue(mockErrorHandler)
  })
}))

vi.mock('../../../components/forms/NameOnlyForm.vue', () => ({
  default: {
    name: 'NameOnlyForm',
    props: ['name'],
    emits: ['update:name'],
    template: '<div>NameOnlyForm</div>'
  }
}))

describe('categories/EditPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useCategoriesStore>

  const mountComponent = () =>
    mount(EditPage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.params.categoryId = mockCategory.uuid
    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        categories: {
          categories: [mockCategory]
        }
      }
    })
    store = useCategoriesStore(pinia)
    vi.mocked(store.getCategory).mockResolvedValue({ isOk: true } as never)
    vi.mocked(store.updateCategory).mockResolvedValue({ isOk: true } as never)
  })

  it('loads the category on mount and fills the form', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const form = wrapper.findComponent({ name: 'NameOnlyForm' })
    expect(store.getCategory).toHaveBeenCalledWith(mockCategory.uuid)
    expect(form.props('name')).toBe(mockCategory.name)
  })

  it('submits the updated category payload', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const form = wrapper.findComponent({ name: 'NameOnlyForm' })
    await form.vm.$emit('update:name', 'Updated Category')
    await wrapper.vm.$nextTick()

    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(store.updateCategory).toHaveBeenCalledWith({
      ...mockCategory,
      name: 'Updated Category'
    })
    expect(mockGoodNotify).toHaveBeenCalledWith('categories.updated', {
      name: 'categories show',
      params: mockRoute.params
    })
  })

  it('uses the error notifier when updating fails', async () => {
    vi.mocked(store.updateCategory).mockRejectedValue(new Error('boom'))

    const wrapper = mountComponent()
    await flushPromises()
    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('categories.error_updating', {
      name: 'categories show',
      params: mockRoute.params
    })
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
  })
})
