import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import EditPage from '../EditPage.vue'
import { useProductsStore } from '../../../stores/products'
import { mockProduct } from './mocks'

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
      productId: 'product-uuid-123'
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

vi.mock('../../../components/forms/ProductForm.vue', () => ({
  default: {
    name: 'ProductForm',
    props: ['name', 'code', 'description', 'price', 'stock', 'stockWarning', 'brand', 'supplier', 'categories'],
    emits: ['update:name', 'update:code', 'update:description', 'update:price', 'update:stock', 'update:stockWarning', 'update:brand', 'update:supplier', 'update:categories'],
    template: '<div>ProductForm</div>'
  }
}))

describe('products/EditPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useProductsStore>

  const productWithCategories = {
    ...mockProduct,
    categories: [
      { id: 7, uuid: 'category-7', name: 'Gaming' },
      { id: 8, uuid: 'category-8', name: 'Office' }
    ]
  }

  const mountComponent = () =>
    mount(EditPage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.params.productId = mockProduct.uuid
    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        products: {
          products: [productWithCategories]
        }
      }
    })
    store = useProductsStore(pinia)
    vi.mocked(store.getProduct).mockResolvedValue({ isOk: true } as never)
    vi.mocked(store.updateProduct).mockResolvedValue({ isOk: true } as never)
  })

  it('loads the product on mount and fills the form', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const form = wrapper.findComponent({ name: 'ProductForm' })
    expect(store.getProduct).toHaveBeenCalledWith(mockProduct.uuid)
    expect(form.props('name')).toBe(productWithCategories.name)
    expect(form.props('code')).toBe(productWithCategories.code)
    expect(form.props('description')).toBe(productWithCategories.description)
    expect(form.props('price')).toBe(productWithCategories.price)
    expect(form.props('stock')).toBe(productWithCategories.stock)
    expect(form.props('stockWarning')).toBe(productWithCategories.min_stock_warning)
    expect(form.props('brand')).toBe(productWithCategories.brand_id)
    expect(form.props('supplier')).toBe(productWithCategories.supplier_id)
    expect(form.props('categories')).toEqual([7, 8])
  })

  it('submits the updated product payload', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const form = wrapper.findComponent({ name: 'ProductForm' })
    await form.vm.$emit('update:name', 'Updated Product')
    await form.vm.$emit('update:price', 130.5)
    await form.vm.$emit('update:categories', [7])
    await wrapper.vm.$nextTick()

    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(store.updateProduct).toHaveBeenCalledWith({
      uuid: productWithCategories.uuid,
      name: 'Updated Product',
      code: productWithCategories.code,
      price: 130.5,
      description: productWithCategories.description,
      stock: productWithCategories.stock,
      min_stock_warning: productWithCategories.min_stock_warning,
      brand_id: productWithCategories.brand_id,
      supplier_id: productWithCategories.supplier_id,
      categories: [7]
    })
    expect(mockGoodNotify).toHaveBeenCalledWith('products.updated', {
      name: 'products show',
      params: mockRoute.params
    })
  })

  it('uses the error notifier when updating fails', async () => {
    vi.mocked(store.updateProduct).mockRejectedValue(new Error('boom'))

    const wrapper = mountComponent()
    await flushPromises()
    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('products.error_updating', {
      name: 'products show',
      params: mockRoute.params
    })
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
  })
})
