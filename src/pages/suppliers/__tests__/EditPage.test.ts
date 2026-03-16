import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import EditPage from '../EditPage.vue'
import { useSuppliersStore } from '../../../stores/suppliers'
import { mockSupplier } from '../../../__tests__/mocks'

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
      supplierId: 'supplier-uuid-123'
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

vi.mock('../../../components/forms/SupplierForm.vue', () => ({
  default: {
    name: 'SupplierForm',
    props: ['name', 'address', 'phone', 'email', 'web'],
    emits: ['update:name', 'update:address', 'update:phone', 'update:email', 'update:web'],
    template: '<div>SupplierForm</div>'
  }
}))

describe('suppliers/EditPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useSuppliersStore>

  const mountComponent = () =>
    mount(EditPage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.params.supplierId = mockSupplier.uuid
    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        suppliers: {
          suppliers: [mockSupplier]
        }
      }
    })
    store = useSuppliersStore(pinia)
    vi.mocked(store.getSupplier).mockResolvedValue({ isOk: true } as never)
    vi.mocked(store.updateSupplier).mockResolvedValue({ isOk: true } as never)
  })

  it('loads the supplier on mount and fills the form', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const form = wrapper.findComponent({ name: 'SupplierForm' })
    expect(store.getSupplier).toHaveBeenCalledWith(mockSupplier.uuid)
    expect(form.props('name')).toBe(mockSupplier.name)
    expect(form.props('address')).toBe(mockSupplier.address)
    expect(form.props('phone')).toBe(mockSupplier.phone)
    expect(form.props('email')).toBe(mockSupplier.email)
    expect(form.props('web')).toBe(mockSupplier.web)
  })

  it('submits the updated supplier payload', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const form = wrapper.findComponent({ name: 'SupplierForm' })
    await form.vm.$emit('update:name', 'Updated Supplier')
    await form.vm.$emit('update:phone', '555555')
    await wrapper.vm.$nextTick()

    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(store.updateSupplier).toHaveBeenCalledWith({
      ...mockSupplier,
      name: 'Updated Supplier',
      address: mockSupplier.address,
      phone: '555555',
      email: mockSupplier.email,
      web: mockSupplier.web
    })
    expect(mockGoodNotify).toHaveBeenCalledWith('suppliers.updated', {
      name: 'suppliers show',
      params: mockRoute.params
    })
  })

  it('uses the error notifier when updating fails', async () => {
    vi.mocked(store.updateSupplier).mockRejectedValue(new Error('boom'))

    const wrapper = mountComponent()
    await flushPromises()
    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('suppliers.error_updating', {
      name: 'suppliers show',
      params: mockRoute.params
    })
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
  })
})
