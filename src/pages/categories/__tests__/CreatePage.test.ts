import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import CreatePage from '../CreatePage.vue'
import { useCategoriesStore } from '../../../stores/categories'

const {
  mockGoodNotify,
  mockGoodHandler,
  mockErrorNotify,
  mockErrorHandler
} = vi.hoisted(() => ({
  mockGoodNotify: vi.fn(),
  mockGoodHandler: vi.fn(),
  mockErrorNotify: vi.fn(),
  mockErrorHandler: vi.fn()
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

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

describe('categories/CreatePage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useCategoriesStore>

  const mountComponent = () =>
    mount(CreatePage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createTestingPinia({ createSpy: vi.fn })
    store = useCategoriesStore(pinia)
    vi.mocked(store.createCategory).mockResolvedValue({ isOk: true } as never)
  })

  it('renders the name form and submit button', () => {
    const wrapper = mountComponent()

    expect(wrapper.findComponent({ name: 'NameOnlyForm' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'QBtn' }).props('label')).toBe('common.create')
  })

  it('does not submit when name is empty', async () => {
    const wrapper = mountComponent()

    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(store.createCategory).not.toHaveBeenCalled()
    expect(mockGoodNotify).not.toHaveBeenCalled()
  })

  it('submits the entered category name', async () => {
    const wrapper = mountComponent()
    const form = wrapper.findComponent({ name: 'NameOnlyForm' })

    await form.vm.$emit('update:name', 'Electronics')
    await wrapper.vm.$nextTick()

    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(store.createCategory).toHaveBeenCalledWith({ name: 'Electronics' })
    expect(mockGoodNotify).toHaveBeenCalledWith('categories.created', { name: 'categories index' })
  })

  it('uses the error notifier when creation fails', async () => {
    vi.mocked(store.createCategory).mockRejectedValue(new Error('boom'))

    const wrapper = mountComponent()
    const form = wrapper.findComponent({ name: 'NameOnlyForm' })
    await form.vm.$emit('update:name', 'Electronics')
    await wrapper.vm.$nextTick()

    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('categories.error_creating')
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
  })
})
