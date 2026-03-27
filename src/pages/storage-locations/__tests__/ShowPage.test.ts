import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import ShowPage from '../ShowPage.vue'
import { useStorageLocationsStore } from '../../../stores/storageLocations'
import { mockStorageLocation } from './mocks'

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
      storageLocationId: ['storage-location-uuid-123']
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

describe('storage-locations/ShowPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useStorageLocationsStore>

  const mountComponent = () =>
    mount(ShowPage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.params.storageLocationId = [mockStorageLocation.uuid]
    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        storageLocations: {
          storageLocations: [mockStorageLocation]
        }
      }
    })
    store = useStorageLocationsStore(pinia)
    vi.mocked(store.getStorageLocation).mockResolvedValue({ isOk: true } as never)
    vi.mocked(store.deleteStorageLocation).mockResolvedValue({ isOk: true } as never)
  })

  it('fetches storage location on mount and renders details', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    expect(mockLoadingShow).toHaveBeenCalledTimes(1)
    expect(store.getStorageLocation).toHaveBeenCalledWith(mockStorageLocation.uuid)
    expect(mockLoadingHide).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain(mockStorageLocation.name)
    expect(wrapper.findComponent({ name: 'ProductList' }).props('products')).toEqual(mockStorageLocation.products)
  })

  it('builds edit route and opens delete dialog', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const buttons = wrapper.findAllComponents({ name: 'QBtn' })
    expect(buttons[0]?.props('to')).toEqual({
      name: 'storage locations edit',
      params: mockRoute.params
    })

    await buttons[1]?.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'BaseDeleteDialog' }).props('modelValue')).toBe(true)
  })

  it('passes a delete action bound to selected storage location', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const deleteDialog = wrapper.findComponent({ name: 'BaseDeleteDialog' })
    await deleteDialog.props('deleteAction')()

    expect(deleteDialog.props('confirmMessage')).toBe(`storage_locations.confirm_delete:${mockStorageLocation.name}`)
    expect(store.deleteStorageLocation).toHaveBeenCalledWith(mockStorageLocation)
  })
})
