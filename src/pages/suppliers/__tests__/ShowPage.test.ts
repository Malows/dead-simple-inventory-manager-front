import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import ShowPage from '../ShowPage.vue'
import { useSuppliersStore } from '../../../stores/suppliers'
import { mockSupplier } from '../../../__tests__/mocks'

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
      supplierId: ['supplier-uuid-123']
    }
  }
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

vi.mock('../../../components/ProductList.vue', () => ({
  default: {
    name: 'ProductList',
    props: ['products'],
    template: '<div>ProductList</div>'
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

describe('suppliers/ShowPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useSuppliersStore>

  const mountComponent = () =>
    mount(ShowPage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.params.supplierId = [mockSupplier.uuid]
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
    vi.mocked(store.deleteSupplier).mockResolvedValue({ isOk: true } as never)
  })

  it('fetches the supplier on mount and renders its details', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    expect(mockLoadingShow).toHaveBeenCalledTimes(1)
    expect(store.getSupplier).toHaveBeenCalledWith(mockSupplier.uuid)
    expect(mockLoadingHide).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain(mockSupplier.name)
    expect(wrapper.findComponent({ name: 'ProductList' }).props('products')).toEqual(mockSupplier.products)
  })

  it('builds the edit route and opens the delete dialog', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const buttons = wrapper.findAllComponents({ name: 'QBtn' })
    expect(buttons[0]?.props('to')).toEqual({
      name: 'suppliers edit',
      params: mockRoute.params
    })

    await buttons[1]?.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'BaseDeleteDialog' }).props('modelValue')).toBe(true)
  })

  it('passes a delete action bound to the selected supplier', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const deleteDialog = wrapper.findComponent({ name: 'BaseDeleteDialog' })
    await deleteDialog.props('deleteAction')()

    expect(deleteDialog.props('confirmMessage')).toBe(`suppliers.confirm_delete:${mockSupplier.name}`)
    expect(store.deleteSupplier).toHaveBeenCalledWith(mockSupplier)
  })
})
