import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { useStorageLocationsStore } from '../storageLocations'
import type { RawStorageLocation } from '../../types/storage-location.interfaces'

const makeRawStorageLocation = (
  id = 1,
  uuid = 'sl-uuid-1',
  name = 'Main Warehouse'
): RawStorageLocation => ({
  id,
  uuid,
  name,
  description: 'Primary location',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  products: []
})

vi.mock('../../services/Crud', () => ({
  storageLocationService: {
    fetch: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import { storageLocationService } from '../../services/Crud'

function mockResponse<T> (data: T, isOk = true) {
  return { isOk, code: isOk ? 200 : 500, data, error: null, message: '' }
}

describe('storage locations store', () => {
  let store: ReturnType<typeof useStorageLocationsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useStorageLocationsStore()
    vi.clearAllMocks()
  })

  describe('getStorageLocations', () => {
    it('fetches and stores storage locations', async () => {
      vi.mocked(storageLocationService.fetch).mockResolvedValue(mockResponse([makeRawStorageLocation()]))

      await store.getStorageLocations()

      expect(store.storageLocations).toHaveLength(1)
      expect(store.storageLocations[0].name).toBe('Main Warehouse')
      expect(store.storageLocations[0].created_at).toBeInstanceOf(Date)
    })

    it('returns early if already fetched and storage locations are not empty', async () => {
      vi.mocked(storageLocationService.fetch).mockResolvedValue(mockResponse([makeRawStorageLocation()]))

      await store.getStorageLocations()
      expect(storageLocationService.fetch).toHaveBeenCalledTimes(1)

      await store.getStorageLocations()
      expect(storageLocationService.fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('getStorageLocation', () => {
    it('fetches and adds a single storage location', async () => {
      vi.mocked(storageLocationService.get).mockResolvedValue(mockResponse(makeRawStorageLocation()))

      await store.getStorageLocation('sl-uuid-1')

      expect(store.storageLocations).toHaveLength(1)
    })

    it('updates existing storage location in the list', async () => {
      vi.mocked(storageLocationService.fetch).mockResolvedValue(mockResponse([makeRawStorageLocation()]))
      await store.getStorageLocations()

      vi.mocked(storageLocationService.get).mockResolvedValue(
        mockResponse(makeRawStorageLocation(1, 'sl-uuid-1', 'Updated Warehouse'))
      )

      await store.getStorageLocation('sl-uuid-1')

      expect(store.storageLocations).toHaveLength(1)
      expect(store.storageLocations[0].name).toBe('Updated Warehouse')
    })
  })

  describe('createStorageLocation', () => {
    it('adds new storage location to list', async () => {
      vi.mocked(storageLocationService.create).mockResolvedValue(
        mockResponse(makeRawStorageLocation(2, 'sl-uuid-2', 'Secondary Warehouse'))
      )

      await store.createStorageLocation({ name: 'Secondary Warehouse', description: 'Backup' })

      expect(store.storageLocations).toHaveLength(1)
      expect(store.storageLocations[0].name).toBe('Secondary Warehouse')
    })
  })

  describe('updateStorageLocation', () => {
    it('updates storage location in list', async () => {
      vi.mocked(storageLocationService.fetch).mockResolvedValue(mockResponse([makeRawStorageLocation()]))
      await store.getStorageLocations()

      vi.mocked(storageLocationService.update).mockResolvedValue(
        mockResponse(makeRawStorageLocation(1, 'sl-uuid-1', 'Edited Warehouse'))
      )

      await store.updateStorageLocation({
        id: 1,
        uuid: 'sl-uuid-1',
        name: 'Edited Warehouse',
        description: 'Primary location',
        created_at: new Date(),
        updated_at: new Date(),
        products: []
      })

      expect(store.storageLocations[0].name).toBe('Edited Warehouse')
    })
  })

  describe('deleteStorageLocation', () => {
    it('removes storage location from list', async () => {
      vi.mocked(storageLocationService.fetch).mockResolvedValue(mockResponse([makeRawStorageLocation()]))
      await store.getStorageLocations()

      vi.mocked(storageLocationService.remove).mockResolvedValue(mockResponse(makeRawStorageLocation()))
      await store.deleteStorageLocation(store.storageLocations[0])

      expect(store.storageLocations).toHaveLength(0)
    })
  })

  describe('storageLocationsOptions', () => {
    it('returns SelectOption array', async () => {
      vi.mocked(storageLocationService.fetch).mockResolvedValue(mockResponse([makeRawStorageLocation()]))
      await store.getStorageLocations()

      expect(store.storageLocationsOptions).toEqual([{ label: 'Main Warehouse', value: 1 }])
    })
  })
})
