import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSuppliersStore } from '../suppliers'
import type { RawSupplier } from '../../types/supplier.interfaces'

const makeRawSupplier = (id = 1, uuid = 's-uuid-1', name = 'Sup A'): RawSupplier => ({
  id,
  uuid,
  name,
  email: 'a@b.com',
  phone: '123',
  address: '123 St',
  web: null,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  products: []
})

vi.mock('../../services/Crud', () => ({
  supplierService: {
    fetch: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import { supplierService } from '../../services/Crud'

function mockResponse<T> (data: T, isOk = true) {
  return { isOk, code: isOk ? 200 : 500, data, error: null, message: '' }
}

describe('suppliers store', () => {
  let store: ReturnType<typeof useSuppliersStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useSuppliersStore()
    vi.clearAllMocks()
  })

  describe('getSuppliers', () => {
    it('fetches and stores suppliers', async () => {
      vi.mocked(supplierService.fetch).mockResolvedValue(mockResponse([makeRawSupplier()]))
      await store.getSuppliers()
      expect(store.suppliers).toHaveLength(1)
      expect(store.suppliers[0].name).toBe('Sup A')
    })

    it('returns early if already fetched and suppliers are not empty', async () => {
      vi.mocked(supplierService.fetch).mockResolvedValue(mockResponse([makeRawSupplier()]))
      await store.getSuppliers()
      expect(supplierService.fetch).toHaveBeenCalledTimes(1)

      await store.getSuppliers()
      expect(supplierService.fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('getSupplier', () => {
    it('fetches and adds a single supplier', async () => {
      vi.mocked(supplierService.get).mockResolvedValue(mockResponse(makeRawSupplier()))
      await store.getSupplier('s-uuid-1')
      expect(store.suppliers).toHaveLength(1)
    })

    it('updates existing supplier in the list', async () => {
      vi.mocked(supplierService.fetch).mockResolvedValue(mockResponse([makeRawSupplier()]))
      await store.getSuppliers()

      vi.mocked(supplierService.get).mockResolvedValue(
        mockResponse(makeRawSupplier(1, 's-uuid-1', 'Updated'))
      )
      await store.getSupplier('s-uuid-1')
      expect(store.suppliers).toHaveLength(1)
      expect(store.suppliers[0].name).toBe('Updated')
    })
  })

  describe('createSupplier', () => {
    it('adds to list', async () => {
      vi.mocked(supplierService.create).mockResolvedValue(
        mockResponse(makeRawSupplier(2, 's-uuid-2', 'New'))
      )
      await store.createSupplier({
        name: 'New',
        email: null,
        phone: null,
        address: null,
        web: null
      })
      expect(store.suppliers).toHaveLength(1)
    })
  })

  describe('updateSupplier', () => {
    it('updates existing', async () => {
      vi.mocked(supplierService.fetch).mockResolvedValue(mockResponse([makeRawSupplier()]))
      await store.getSuppliers()

      vi.mocked(supplierService.update).mockResolvedValue(
        mockResponse(makeRawSupplier(1, 's-uuid-1', 'Edited'))
      )
      await store.updateSupplier({
        id: 1,
        uuid: 's-uuid-1',
        name: 'Edited',
        email: null,
        phone: null,
        address: null,
        web: null,
        created_at: new Date(),
        updated_at: new Date(),
        products: []
      })
      expect(store.suppliers[0].name).toBe('Edited')
    })

    it('pushes supplier to the list if not present during update', async () => {
      vi.mocked(supplierService.update).mockResolvedValue(
        mockResponse(makeRawSupplier(1, 's-uuid-1', 'New in list'))
      )
      await store.updateSupplier({
        id: 1,
        uuid: 's-uuid-1',
        name: 'New in list',
        email: null,
        phone: null,
        address: null,
        web: null,
        created_at: new Date(),
        updated_at: new Date(),
        products: []
      })
      expect(store.suppliers).toHaveLength(1)
      expect(store.suppliers[0].name).toBe('New in list')
    })
  })

  describe('deleteSupplier', () => {
    it('removes from list', async () => {
      vi.mocked(supplierService.fetch).mockResolvedValue(mockResponse([makeRawSupplier()]))
      await store.getSuppliers()

      vi.mocked(supplierService.remove).mockResolvedValue(mockResponse(makeRawSupplier()))
      await store.deleteSupplier(store.suppliers[0])
      expect(store.suppliers).toHaveLength(0)
    })

    it('does nothing to list if supplier is not present', async () => {
      vi.mocked(supplierService.remove).mockResolvedValue(mockResponse(makeRawSupplier()))
      await store.deleteSupplier({
        id: 1,
        uuid: 's-uuid-1',
        name: 'Sup A',
        email: null,
        phone: null,
        address: null,
        web: null,
        created_at: new Date(),
        updated_at: new Date(),
        products: []
      })
      expect(store.suppliers).toHaveLength(0)
    })
  })

  describe('suppliersOptions', () => {
    it('returns SelectOption array', async () => {
      vi.mocked(supplierService.fetch).mockResolvedValue(mockResponse([makeRawSupplier()]))
      await store.getSuppliers()
      expect(store.suppliersOptions).toEqual([{ label: 'Sup A', value: 1 }])
    })
  })

  describe('error paths (null data)', () => {
    it('getSuppliers: does not update list when response.data is null', async () => {
      vi.mocked(supplierService.fetch).mockResolvedValue(mockResponse(null, false))
      await store.getSuppliers()
      expect(store.suppliers).toHaveLength(0)
    })

    it('getSupplier: does not update list when response.data is null', async () => {
      vi.mocked(supplierService.get).mockResolvedValue(mockResponse(null, false))
      await store.getSupplier('s-uuid-1')
      expect(store.suppliers).toHaveLength(0)
    })

    it('createSupplier: does not add to list when response.data is null', async () => {
      vi.mocked(supplierService.create).mockResolvedValue(mockResponse(null, false))
      await store.createSupplier({ name: 'Fail', email: null, phone: null, address: null, web: null })
      expect(store.suppliers).toHaveLength(0)
    })

    it('updateSupplier: does not modify list when response.data is null', async () => {
      vi.mocked(supplierService.fetch).mockResolvedValue(mockResponse([makeRawSupplier()]))
      await store.getSuppliers()
      vi.mocked(supplierService.update).mockResolvedValue(mockResponse(null, false))
      await store.updateSupplier({ id: 1, uuid: 's-uuid-1', name: 'Sup A', email: null, phone: null, address: null, web: null, created_at: new Date(), updated_at: new Date(), products: [] })
      expect(store.suppliers[0].name).toBe('Sup A')
    })

    it('deleteSupplier: does not modify list when response.data is null', async () => {
      vi.mocked(supplierService.fetch).mockResolvedValue(mockResponse([makeRawSupplier()]))
      await store.getSuppliers()
      vi.mocked(supplierService.remove).mockResolvedValue(mockResponse(null, false))
      await store.deleteSupplier(store.suppliers[0])
      expect(store.suppliers).toHaveLength(1)
    })
  })
})
