import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBrandsStore } from '../brands'
import type { RawBrand } from '../../types/brand.interfaces'

const makeRawBrand = (id = 1, uuid = 'b-uuid-1', name = 'Brand A'): RawBrand => ({
  id,
  uuid,
  name,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  products: []
})

vi.mock('../../services/Crud', () => ({
  brandService: {
    fetch: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import { brandService } from '../../services/Crud'

function mockResponse<T> (data: T, isOk = true) {
  return { isOk, code: isOk ? 200 : 500, data, error: null, message: '' }
}

describe('brands store', () => {
  let store: ReturnType<typeof useBrandsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBrandsStore()
    vi.clearAllMocks()
  })

  describe('getBrands', () => {
    it('fetches and stores brands', async () => {
      vi.mocked(brandService.fetch).mockResolvedValue(mockResponse([makeRawBrand()]))
      await store.getBrands()
      expect(store.brands).toHaveLength(1)
      expect(store.brands[0].name).toBe('Brand A')
      expect(store.brands[0].created_at).toBeInstanceOf(Date)
    })

    it('returns early if already fetched and brands are not empty', async () => {
      vi.mocked(brandService.fetch).mockResolvedValue(mockResponse([makeRawBrand()]))
      await store.getBrands()
      expect(brandService.fetch).toHaveBeenCalledTimes(1)

      await store.getBrands()
      expect(brandService.fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('getBrand', () => {
    it('fetches and adds a single brand', async () => {
      vi.mocked(brandService.get).mockResolvedValue(mockResponse(makeRawBrand()))
      await store.getBrand('b-uuid-1')
      expect(store.brands).toHaveLength(1)
    })

    it('updates existing brand in the list', async () => {
      vi.mocked(brandService.fetch).mockResolvedValue(mockResponse([makeRawBrand()]))
      await store.getBrands()

      vi.mocked(brandService.get).mockResolvedValue(
        mockResponse(makeRawBrand(1, 'b-uuid-1', 'Updated'))
      )
      await store.getBrand('b-uuid-1')
      expect(store.brands).toHaveLength(1)
      expect(store.brands[0].name).toBe('Updated')
    })

    it('pushes new brand to the list if not present', async () => {
      vi.mocked(brandService.get).mockResolvedValue(
        mockResponse(makeRawBrand(2, 'b-uuid-2', 'Brand 2'))
      )
      await store.getBrand('b-uuid-2')
      expect(store.brands).toHaveLength(1)
      expect(store.brands[0].uuid).toBe('b-uuid-2')
    })
  })

  describe('createBrand', () => {
    it('adds new brand to list', async () => {
      vi.mocked(brandService.create).mockResolvedValue(
        mockResponse(makeRawBrand(2, 'b-uuid-2', 'New'))
      )
      await store.createBrand({ name: 'New' })
      expect(store.brands).toHaveLength(1)
      expect(store.brands[0].name).toBe('New')
    })
  })

  describe('updateBrand', () => {
    it('updates brand in list', async () => {
      vi.mocked(brandService.fetch).mockResolvedValue(mockResponse([makeRawBrand()]))
      await store.getBrands()

      vi.mocked(brandService.update).mockResolvedValue(
        mockResponse(makeRawBrand(1, 'b-uuid-1', 'Edited'))
      )
      await store.updateBrand({
        id: 1,
        uuid: 'b-uuid-1',
        name: 'Edited',
        created_at: new Date(),
        updated_at: new Date(),
        products: []
      })
      expect(store.brands[0].name).toBe('Edited')
    })

    it('pushes brand to the list if not present during update', async () => {
      vi.mocked(brandService.update).mockResolvedValue(
        mockResponse(makeRawBrand(1, 'b-uuid-1', 'New in list'))
      )
      await store.updateBrand({
        id: 1,
        uuid: 'b-uuid-1',
        name: 'New in list',
        created_at: new Date(),
        updated_at: new Date(),
        products: []
      })
      expect(store.brands).toHaveLength(1)
      expect(store.brands[0].name).toBe('New in list')
    })
  })

  describe('deleteBrand', () => {
    it('removes brand from list', async () => {
      vi.mocked(brandService.fetch).mockResolvedValue(mockResponse([makeRawBrand()]))
      await store.getBrands()
      expect(store.brands).toHaveLength(1)

      vi.mocked(brandService.remove).mockResolvedValue(mockResponse(makeRawBrand()))
      await store.deleteBrand(store.brands[0])
      expect(store.brands).toHaveLength(0)
    })

    it('does nothing to list if brand is not present', async () => {
      vi.mocked(brandService.remove).mockResolvedValue(mockResponse(makeRawBrand()))
      await store.deleteBrand({
        id: 1,
        uuid: 'b-uuid-1',
        name: 'Brand A',
        created_at: new Date(),
        updated_at: new Date(),
        products: []
      })
      expect(store.brands).toHaveLength(0)
    })
  })

  describe('brandsOptions', () => {
    it('returns SelectOption array', async () => {
      vi.mocked(brandService.fetch).mockResolvedValue(mockResponse([makeRawBrand()]))
      await store.getBrands()
      expect(store.brandsOptions).toEqual([{ label: 'Brand A', value: 1 }])
    })
  })

  describe('error paths (null data)', () => {
    it('getBrands: does not update list when response.data is null', async () => {
      vi.mocked(brandService.fetch).mockResolvedValue(mockResponse(null, false))
      await store.getBrands()
      expect(store.brands).toHaveLength(0)
    })

    it('getBrand: does not update list when response.data is null', async () => {
      vi.mocked(brandService.get).mockResolvedValue(mockResponse(null, false))
      await store.getBrand('b-uuid-1')
      expect(store.brands).toHaveLength(0)
    })

    it('createBrand: does not add to list when response.data is null', async () => {
      vi.mocked(brandService.create).mockResolvedValue(mockResponse(null, false))
      await store.createBrand({ name: 'Fail' })
      expect(store.brands).toHaveLength(0)
    })

    it('updateBrand: does not modify list when response.data is null', async () => {
      vi.mocked(brandService.fetch).mockResolvedValue(mockResponse([makeRawBrand()]))
      await store.getBrands()
      vi.mocked(brandService.update).mockResolvedValue(mockResponse(null, false))
      await store.updateBrand({ id: 1, uuid: 'b-uuid-1', name: 'Brand A', created_at: new Date(), updated_at: new Date(), products: [] })
      expect(store.brands[0].name).toBe('Brand A')
    })

    it('deleteBrand: does not modify list when response.data is null', async () => {
      vi.mocked(brandService.fetch).mockResolvedValue(mockResponse([makeRawBrand()]))
      await store.getBrands()
      vi.mocked(brandService.remove).mockResolvedValue(mockResponse(null, false))
      await store.deleteBrand(store.brands[0])
      expect(store.brands).toHaveLength(1)
    })
  })
})
