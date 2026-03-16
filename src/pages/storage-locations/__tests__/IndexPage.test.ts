import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import IndexPage from '../IndexPage.vue'
import { useStorageLocationsStore } from '../../../stores/storageLocations'
import { mockStorageLocation } from './mocks'

const {
  mockLoadingShow,
  mockLoadingHide,
  mockErrorNotify,
  mockErrorHandler
} = vi.hoisted(() => ({
  mockLoadingShow: vi.fn(),
  mockLoadingHide: vi.fn(),
  mockErrorNotify: vi.fn(),
  mockErrorHandler: vi.fn()
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

vi.mock('../../../composition/useNotify', () => ({
  useNotify: () => ({
    errorNotify: mockErrorNotify.mockReturnValue(mockErrorHandler)
  })
}))

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

vi.mock('../../../components/pages/PageWithAdd.vue', () => ({
  default: {
    name: 'PageWithAdd',
    props: ['title', 'to'],
    template: '<section><header>{{ title }}</header><slot /></section>'
  }
}))

vi.mock('../../../components/filterable/FilterableList.vue', () => ({
  default: {
    name: 'FilterableList',
    props: ['items', 'itemsPerPage'],
    template: '<div><slot v-if="items?.length" :item="items[0]" /></div>'
  }
}))

vi.mock('../../../components/listItems/StorageLocationItem.vue', () => ({
  default: {
    name: 'StorageLocationItem',
    props: ['storageLocation'],
    template: '<article>{{ storageLocation?.name }}</article>'
  }
}))

describe('storage-locations/IndexPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useStorageLocationsStore>

  const mountComponent = () =>
    mount(IndexPage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        storageLocations: {
          storageLocations: [mockStorageLocation]
        }
      }
    })
    store = useStorageLocationsStore(pinia)
    vi.mocked(store.getStorageLocations).mockResolvedValue({ isOk: true } as never)
  })

  it('renders the list inside page wrapper', () => {
    const wrapper = mountComponent()

    expect(wrapper.findComponent({ name: 'PageWithAdd' }).props('title')).toBe('storage_locations.StorageLocations')
    expect(wrapper.findComponent({ name: 'FilterableList' }).props('items')).toEqual([mockStorageLocation])
    expect(wrapper.findComponent({ name: 'StorageLocationItem' }).props('storageLocation')).toEqual(mockStorageLocation)
  })

  it('fetches storage locations on mount and hides loader', async () => {
    mountComponent()
    await flushPromises()

    expect(mockLoadingShow).toHaveBeenCalledTimes(1)
    expect(store.getStorageLocations).toHaveBeenCalledTimes(1)
    expect(mockLoadingHide).toHaveBeenCalledTimes(1)
  })

  it('uses error notifier when fetch fails', async () => {
    vi.mocked(store.getStorageLocations).mockRejectedValue(new Error('boom'))

    mountComponent()
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('storage_locations.error_fetching')
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
    expect(mockLoadingHide).toHaveBeenCalledTimes(1)
  })
})
