import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import CreatePage from '../CreatePage.vue'
import { useBrandsStore } from '../../../stores/brands'

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

describe('brands/CreatePage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useBrandsStore>

  const mountComponent = () =>
    mount(CreatePage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createTestingPinia({ createSpy: vi.fn })
    store = useBrandsStore(pinia)
    vi.mocked(store.createBrand).mockResolvedValue({ isOk: true } as never)
  })

  it('renders the name form and submit button', () => {
    const wrapper = mountComponent()

    expect(wrapper.findComponent({ name: 'NameOnlyForm' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'QBtn' }).props('label')).toBe('common.create')
  })

  it('submits the entered brand name', async () => {
    const wrapper = mountComponent()
    const form = wrapper.findComponent({ name: 'NameOnlyForm' })

    await form.vm.$emit('update:name', 'ACME')
    await wrapper.vm.$nextTick()

    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(store.createBrand).toHaveBeenCalledWith({ name: 'ACME' })
    expect(mockGoodNotify).toHaveBeenCalledWith('brands.created', { name: 'brands index' })
  })

  it('uses the error notifier when creation fails', async () => {
    vi.mocked(store.createBrand).mockRejectedValue(new Error('boom'))

    const wrapper = mountComponent()
    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('brands.error_creating')
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
  })
})
