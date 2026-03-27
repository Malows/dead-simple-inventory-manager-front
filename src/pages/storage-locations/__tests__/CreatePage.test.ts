import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import CreatePage from '../CreatePage.vue'
import { useStorageLocationsStore } from '../../../stores/storageLocations'

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

vi.mock('../../../components/forms/StorageLocationForm.vue', () => ({
  default: {
    name: 'StorageLocationForm',
    props: ['name', 'description'],
    emits: ['update:name', 'update:description'],
    template: '<div>StorageLocationForm</div>'
  }
}))

describe('storage-locations/CreatePage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useStorageLocationsStore>

  const mountComponent = () =>
    mount(CreatePage, {
      global: {
        plugins: [pinia]
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createTestingPinia({ createSpy: vi.fn })
    store = useStorageLocationsStore(pinia)
    vi.mocked(store.createStorageLocation).mockResolvedValue({ isOk: true } as never)
  })

  it('renders the form and submit button', () => {
    const wrapper = mountComponent()

    expect(wrapper.findComponent({ name: 'StorageLocationForm' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'QBtn' }).props('label')).toBe('common.create')
  })

  it('submits the entered payload', async () => {
    const wrapper = mountComponent()
    const form = wrapper.findComponent({ name: 'StorageLocationForm' })

    await form.vm.$emit('update:name', 'Main Warehouse')
    await form.vm.$emit('update:description', 'Primary location')
    await wrapper.vm.$nextTick()

    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(store.createStorageLocation).toHaveBeenCalledWith({
      name: 'Main Warehouse',
      description: 'Primary location'
    })
    expect(mockGoodNotify).toHaveBeenCalledWith('storage_locations.created', { name: 'storage locations index' })
  })

  it('uses the error notifier when creation fails', async () => {
    vi.mocked(store.createStorageLocation).mockRejectedValue(new Error('boom'))

    const wrapper = mountComponent()
    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(mockErrorNotify).toHaveBeenCalledWith('storage_locations.error_creating')
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
  })
})
