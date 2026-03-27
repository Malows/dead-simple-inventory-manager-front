import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductStockDialog from '../ProductStockDialog.vue'

// Mock dependencies
const mockNotify = vi.fn()
const mockLoading = { show: vi.fn(), hide: vi.fn() }
vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal<typeof import('quasar')>()
  return {
    ...actual,
    useQuasar: () => ({
      notify: mockNotify,
      loading: mockLoading
    })
  }
})

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

const mockUpdateProduct = vi.fn()
vi.mock('../../../stores/products', () => ({
  useProductsStore: () => ({
    updateProduct: mockUpdateProduct
  })
}))

describe('ProductStockDialog.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mountComponent = (product = { uuid: '123', name: 'Test Product', stock: 10, categories: [] }) =>
    mount(ProductStockDialog, {
      props: { product: product as any }
    })

  it('renders', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
  })

  it('reduce calls updateProduct on success', async () => {
    mockUpdateProduct.mockResolvedValue({ isOk: true })
    const wrapper = mountComponent()

    // Set stock value directly on component
    const vm = wrapper.vm as any
    vm.stock = 5
    await vm.$nextTick()

    await vm.reduce()

    expect(mockLoading.show).toHaveBeenCalled()
    expect(mockUpdateProduct).toHaveBeenCalled()
    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({ color: 'positive' }))
    expect(mockLoading.hide).toHaveBeenCalled()
  })

  it('reduce handles updateProduct failure (isOk: false)', async () => {
    mockUpdateProduct.mockResolvedValue({ isOk: false })
    const wrapper = mountComponent()

    const vm = wrapper.vm as any
    vm.stock = 5
    await vm.$nextTick()

    await vm.reduce()

    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({ color: 'negative' }))
  })

  it('reduce handles updateProduct rejection', async () => {
    mockUpdateProduct.mockRejectedValue(new Error('Network error'))
    const wrapper = mountComponent()

    const vm = wrapper.vm as any
    vm.stock = 5
    await vm.$nextTick()

    await vm.reduce()

    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({ color: 'negative' }))
  })

  it('does not reduce if stockCheck is true', async () => {
    const wrapper = mountComponent({ uuid: '123', name: 'Test Product', stock: 5, categories: [] })

    // Attempt to reduce more than available
    const vm = wrapper.vm as any
    vm.stock = 10
    await vm.$nextTick()

    await vm.reduce()

    expect(mockUpdateProduct).not.toHaveBeenCalled()
  })
})
