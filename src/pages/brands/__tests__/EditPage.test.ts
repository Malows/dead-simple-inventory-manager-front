import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import EditPage from '../EditPage.vue'
import { useBrandsStore } from '../../../stores/brands'
import { mockBrand } from './mocks'

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
      brandId: 'brand-uuid-123'
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

describe('brands/EditPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useBrandsStore>

  const mountComponent = () =>
    mount(EditPage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.params.brandId = mockBrand.uuid
    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        brands: {
          brands: [mockBrand]
        }
      }
    })
    store = useBrandsStore(pinia)
    vi.mocked(store.getBrand).mockResolvedValue({ isOk: true } as never)
    vi.mocked(store.updateBrand).mockResolvedValue({ isOk: true } as never)
  })

  it('loads the brand on mount and fills the form', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const form = wrapper.findComponent({ name: 'NameOnlyForm' })
    expect(store.getBrand).toHaveBeenCalledWith(mockBrand.uuid)
    expect(form.props('name')).toBe(mockBrand.name)
  })

  it('submits the updated brand payload', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const form = wrapper.findComponent({ name: 'NameOnlyForm' })
    await form.vm.$emit('update:name', 'Updated Brand')
    await wrapper.vm.$nextTick()

    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(store.updateBrand).toHaveBeenCalledWith({
      ...mockBrand,
      name: 'Updated Brand'
    })
    expect(mockGoodNotify).toHaveBeenCalledWith('brands.updated', {
      name: 'brands show',
      params: mockRoute.params
    })
  })

  it('uses the error notifier when updating fails', async () => {
    vi.mocked(store.updateBrand).mockRejectedValue(new Error('boom'))

    const wrapper = mountComponent()
    await flushPromises()
    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('brands.error_updating', {
      name: 'brands show',
      params: mockRoute.params
    })
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
  })
})
