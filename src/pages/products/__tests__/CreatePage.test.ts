import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import CreatePage from '../CreatePage.vue'
import { useProductsStore } from '../../../stores/products'

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

vi.mock('../../../components/forms/ProductForm.vue', () => ({
  default: {
    name: 'ProductForm',
    props: ['name', 'code', 'description', 'price', 'stock', 'stockWarning', 'brand', 'supplier', 'categories'],
    emits: ['update:name', 'update:code', 'update:description', 'update:price', 'update:stock', 'update:stockWarning', 'update:brand', 'update:supplier', 'update:categories'],
    template: '<div>ProductForm</div>'
  }
}))

describe('products/CreatePage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useProductsStore>

  const mountComponent = () =>
    mount(CreatePage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createTestingPinia({ createSpy: vi.fn })
    store = useProductsStore(pinia)
    vi.mocked(store.createProduct).mockResolvedValue({ isOk: true } as never)
  })

  it('renders the product form and submit button', () => {
    const wrapper = mountComponent()

    expect(wrapper.findComponent({ name: 'ProductForm' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'QBtn' }).props('label')).toBe('common.create')
  })

  it('submits the entered product payload', async () => {
    const wrapper = mountComponent()
    const form = wrapper.findComponent({ name: 'ProductForm' })

    await form.vm.$emit('update:name', 'Keyboard')
    await form.vm.$emit('update:code', 'PRD-900')
    await form.vm.$emit('update:description', 'Mechanical keyboard')
    await form.vm.$emit('update:price', 129.99)
    await form.vm.$emit('update:stock', 14)
    await form.vm.$emit('update:stockWarning', 3)
    await form.vm.$emit('update:brand', 2)
    await form.vm.$emit('update:supplier', 4)
    await form.vm.$emit('update:categories', [10, 20])
    await wrapper.vm.$nextTick()

    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(store.createProduct).toHaveBeenCalledWith({
      name: 'Keyboard',
      code: 'PRD-900',
      price: 129.99,
      description: 'Mechanical keyboard',
      stock: 14,
      min_stock_warning: 3,
      brand_id: 2,
      supplier_id: 4,
      categories: [10, 20]
    })
    expect(mockGoodNotify).toHaveBeenCalledWith('products.created', { name: 'products index' })
  })

  it('uses the error notifier when creation fails', async () => {
    vi.mocked(store.createProduct).mockRejectedValue(new Error('boom'))

    const wrapper = mountComponent()
    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('products.error_creating')
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
  })
})
