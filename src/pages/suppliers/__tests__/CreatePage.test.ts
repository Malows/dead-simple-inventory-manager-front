import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import CreatePage from '../CreatePage.vue'
import { useSuppliersStore } from '../../../stores/suppliers'

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

vi.mock('../../../components/forms/SupplierForm.vue', () => ({
  default: {
    name: 'SupplierForm',
    props: ['name', 'address', 'phone', 'email', 'web'],
    emits: ['update:name', 'update:address', 'update:phone', 'update:email', 'update:web'],
    template: '<div>SupplierForm</div>'
  }
}))

describe('suppliers/CreatePage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useSuppliersStore>

  const mountComponent = () =>
    mount(CreatePage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createTestingPinia({ createSpy: vi.fn })
    store = useSuppliersStore(pinia)
    vi.mocked(store.createSupplier).mockResolvedValue({ isOk: true } as never)
  })

  it('renders the supplier form and submit button', () => {
    const wrapper = mountComponent()

    expect(wrapper.findComponent({ name: 'SupplierForm' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'QBtn' }).props('label')).toBe('common.create')
  })

  it('submits the entered supplier payload', async () => {
    const wrapper = mountComponent()
    const form = wrapper.findComponent({ name: 'SupplierForm' })

    await form.vm.$emit('update:name', 'ACME')
    await form.vm.$emit('update:address', 'Main St.')
    await form.vm.$emit('update:phone', '123456')
    await form.vm.$emit('update:email', 'acme@example.com')
    await form.vm.$emit('update:web', 'https://acme.example.com')
    await wrapper.vm.$nextTick()

    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(store.createSupplier).toHaveBeenCalledWith({
      name: 'ACME',
      address: 'Main St.',
      phone: '123456',
      email: 'acme@example.com',
      web: 'https://acme.example.com'
    })
    expect(mockGoodNotify).toHaveBeenCalledWith('suppliers.created', { name: 'suppliers index' })
  })

  it('uses the error notifier when creation fails', async () => {
    vi.mocked(store.createSupplier).mockRejectedValue(new Error('boom'))

    const wrapper = mountComponent()
    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('suppliers.error_creating')
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
  })
})
