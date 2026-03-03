import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCategoriesStore } from '../categories'
import type { RawCategory } from '../../types/category.interfaces'

const makeRawCategory = (id = 1, uuid = 'c-uuid-1', name = 'Cat A'): RawCategory => ({
  id,
  uuid,
  name,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  products: []
})

vi.mock('../../services/Crud', () => ({
  categoryService: {
    fetch: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import { categoryService } from '../../services/Crud'

function mockResponse<T> (data: T, isOk = true) {
  return { isOk, code: isOk ? 200 : 500, data, error: null, message: '' }
}

describe('categories store', () => {
  let store: ReturnType<typeof useCategoriesStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useCategoriesStore()
    vi.clearAllMocks()
  })

  describe('getCategories', () => {
    it('fetches and stores categories', async () => {
      vi.mocked(categoryService.fetch).mockResolvedValue(mockResponse([makeRawCategory()]))
      await store.getCategories()
      expect(store.categories).toHaveLength(1)
      expect(store.categories[0].name).toBe('Cat A')
    })
  })

  describe('getCategory', () => {
    it('fetches and adds a single category', async () => {
      vi.mocked(categoryService.get).mockResolvedValue(mockResponse(makeRawCategory()))
      await store.getCategory('c-uuid-1')
      expect(store.categories).toHaveLength(1)
    })
  })

  describe('createCategory', () => {
    it('adds to list', async () => {
      vi.mocked(categoryService.create).mockResolvedValue(
        mockResponse(makeRawCategory(2, 'c-uuid-2', 'New'))
      )
      await store.createCategory({ name: 'New' })
      expect(store.categories).toHaveLength(1)
    })
  })

  describe('updateCategory', () => {
    it('updates existing', async () => {
      vi.mocked(categoryService.fetch).mockResolvedValue(mockResponse([makeRawCategory()]))
      await store.getCategories()

      vi.mocked(categoryService.update).mockResolvedValue(
        mockResponse(makeRawCategory(1, 'c-uuid-1', 'Edited'))
      )
      await store.updateCategory({
        id: 1,
        uuid: 'c-uuid-1',
        name: 'Edited',
        created_at: new Date(),
        updated_at: new Date(),
        products: []
      })
      expect(store.categories[0].name).toBe('Edited')
    })
  })

  describe('deleteCategory', () => {
    it('removes from list', async () => {
      vi.mocked(categoryService.fetch).mockResolvedValue(mockResponse([makeRawCategory()]))
      await store.getCategories()

      vi.mocked(categoryService.remove).mockResolvedValue(mockResponse(makeRawCategory()))
      await store.deleteCategory(store.categories[0])
      expect(store.categories).toHaveLength(0)
    })
  })

  describe('categoriesOptions', () => {
    it('returns SelectOption array', async () => {
      vi.mocked(categoryService.fetch).mockResolvedValue(mockResponse([makeRawCategory()]))
      await store.getCategories()
      expect(store.categoriesOptions).toEqual([{ label: 'Cat A', value: 1 }])
    })
  })

  describe('categoriesMap', () => {
    it('returns Map by id', async () => {
      vi.mocked(categoryService.fetch).mockResolvedValue(mockResponse([makeRawCategory()]))
      await store.getCategories()
      expect(store.categoriesMap.get(1)!.name).toBe('Cat A')
    })
  })
})
