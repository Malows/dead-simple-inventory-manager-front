import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import EditPage from '../EditPage.vue'
import { useStorageLocationsStore } from '../../../stores/storageLocations'
import { mockStorageLocation } from './mocks'

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
      storageLocationId: 'storage-location-uuid-123'
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

vi.mock('../../../components/forms/StorageLocationForm.vue', () => ({
  default: {
    name: 'StorageLocationForm',
    props: ['name', 'description'],
    emits: ['update:name', 'update:description'],
    template: '<div>StorageLocationForm</div>'
  }
}))

describe('storage-locations/EditPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useStorageLocationsStore>

  const mountComponent = () =>
    mount(EditPage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.params.storageLocationId = mockStorageLocation.uuid
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
    vi.mocked(store.updateStorageLocation).mockResolvedValue({ isOk: true } as never)
  })

  it('loads the storage location on mount and fills the form', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const form = wrapper.findComponent({ name: 'StorageLocationForm' })
    expect(store.getStorageLocation).toHaveBeenCalledWith(mockStorageLocation.uuid)
    expect(form.props('name')).toBe(mockStorageLocation.name)
    expect(form.props('description')).toBe(mockStorageLocation.description)
  })

  it('submits the updated payload', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const form = wrapper.findComponent({ name: 'StorageLocationForm' })
    await form.vm.$emit('update:name', 'Updated Warehouse')
    await form.vm.$emit('update:description', 'Renamed location')
    await wrapper.vm.$nextTick()

    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(store.updateStorageLocation).toHaveBeenCalledWith({
      ...mockStorageLocation,
      name: 'Updated Warehouse',
      description: 'Renamed location'
    })
    expect(mockGoodNotify).toHaveBeenCalledWith('storage_locations.updated', {
      name: 'storage locations show',
      params: mockRoute.params
    })
  })

  it('uses the error notifier when update fails', async () => {
    vi.mocked(store.updateStorageLocation).mockRejectedValue(new Error('boom'))

    const wrapper = mountComponent()
    await flushPromises()
    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('storage_locations.error_updating', {
      name: 'storage locations show',
      params: mockRoute.params
    })
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
  })
})
