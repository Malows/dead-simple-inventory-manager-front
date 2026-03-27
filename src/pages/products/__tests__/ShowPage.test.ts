import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import ShowPage from '../ShowPage.vue'
import { useProductsStore } from '../../../stores/products'
import { parsePrice } from '../../../utils/text'
import { mockProduct, mockProductNoImage } from './mocks'

const {
  mockLoadingShow,
  mockLoadingHide,
  mockErrorNotify,
  mockErrorHandler,
  mockRoute
} = vi.hoisted(() => ({
  mockLoadingShow: vi.fn(),
  mockLoadingHide: vi.fn(),
  mockErrorNotify: vi.fn(),
  mockErrorHandler: vi.fn(),
  mockRoute: {
    params: {
      productId: ['product-uuid-123']
    }
  }
}))

vi.mock('../../../utils/text', () => ({
  parsePrice: vi.fn((price: number) => `$${price}`)
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string, values?: Record<string, unknown>) => values?.name ? `${key}:${String(values.name)}` : key })
}))

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => mockRoute
  }
})

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

vi.mock('../../../composition/useNotify', () => ({
  useNotify: () => ({
    errorNotify: mockErrorNotify.mockReturnValue(mockErrorHandler)
  })
}))

vi.mock('../../../components/pages/PageWithActions.vue', () => ({
  default: {
    name: 'PageWithActions',
    props: ['title'],
    template: '<section><header>{{ title }}</header><slot name="actions" /><slot /></section>'
  }
}))

vi.mock('../../../components/InlineData.vue', () => ({
  default: {
    name: 'InlineData',
    props: ['label'],
    template: '<div><strong>{{ label }}</strong><slot /></div>'
  }
}))

vi.mock('../../../components/dialogs/BaseDeleteDialog.vue', () => ({
  default: {
    name: 'BaseDeleteDialog',
    props: ['modelValue', 'confirmMessage', 'deleteAction', 'successRoute', 'successMessageKey', 'errorMessageKey'],
    emits: ['update:modelValue'],
    template: '<div>BaseDeleteDialog</div>'
  }
}))

vi.mock('../../../components/dialogs/ProductStockDialog.vue', () => ({
  default: {
    name: 'ProductStockDialog',
    props: ['modelValue', 'product'],
    emits: ['update:modelValue'],
    template: '<div>ProductStockDialog</div>'
  }
}))

vi.mock('../../../components/dialogs/ProductPhotoDialog.vue', () => ({
  default: {
    name: 'ProductPhotoDialog',
    props: ['modelValue', 'product'],
    emits: ['update:modelValue'],
    template: '<div>ProductPhotoDialog</div>'
  }
}))

describe('products/ShowPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useProductsStore>

  const mountComponent = () =>
    mount(ShowPage, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: {
            name: 'RouterLink',
            props: ['to'],
            template: '<a><slot /></a>'
          }
        }
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.params.productId = [mockProduct.uuid]
    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        products: {
          products: [mockProduct]
        }
      }
    })
    store = useProductsStore(pinia)
    vi.mocked(store.getProduct).mockResolvedValue({ isOk: true } as never)
    vi.mocked(store.deleteProduct).mockResolvedValue({ isOk: true } as never)
  })

  it('fetches the product on mount and renders details', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    expect(mockLoadingShow).toHaveBeenCalledTimes(1)
    expect(store.getProduct).toHaveBeenCalledWith(mockProduct.uuid)
    expect(mockLoadingHide).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain(mockProduct.name)
    expect(wrapper.text()).toContain(`$${mockProduct.price}`)
    expect(wrapper.text()).toContain(mockProduct.storage_location?.name ?? '')
    expect(parsePrice).toHaveBeenCalledWith(mockProduct.price)
    expect(wrapper.findComponent({ name: 'QImg' }).exists()).toBe(true)
  })

  it('does not render image when product has no image url', async () => {
    const wrapper = mountComponent()
    store.products = [mockProductNoImage]
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'QImg' }).exists()).toBe(false)
  })

  it('builds edit route and opens dialogs from action buttons', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const editBtn = wrapper.find('[aria-label="common.edit"]')
    const photoBtn = wrapper.find('[aria-label="products.photo"]')
    const deleteBtn = wrapper.find('[aria-label="common.delete"]')
    const stockBtn = wrapper.find('[aria-label="products.manage_stock"]')

    expect(wrapper.findComponent({ name: 'QBtn', props: { to: { name: 'products edit', params: mockRoute.params } } }).exists()).toBe(true)

    await photoBtn.trigger('click')
    await deleteBtn.trigger('click')
    await stockBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(editBtn.exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ProductPhotoDialog' }).props('modelValue')).toBe(true)
    expect(wrapper.findComponent({ name: 'ProductStockDialog' }).props('modelValue')).toBe(true)
    expect(wrapper.findComponent({ name: 'BaseDeleteDialog' }).props('modelValue')).toBe(true)
  })

  it('passes a delete action bound to the selected product', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const deleteDialog = wrapper.findComponent({ name: 'BaseDeleteDialog' })
    await deleteDialog.props('deleteAction')()

    expect(deleteDialog.props('confirmMessage')).toBe(`products.confirm_delete:${mockProduct.name}`)
    expect(store.deleteProduct).toHaveBeenCalledWith(mockProduct)
  })
})
