import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from '../products'
import type { RawProduct } from '../../types/product.interfaces'

const makeRawProduct = (
  id = 1,
  uuid = 'p-uuid-1',
  name = 'Prod A',
  price = 100,
  stock = 10
): RawProduct => ({
  id,
  uuid,
  name,
  code: 'P-001',
  stock,
  min_stock_warning: 5,
  description: null,
  price,
  brand_id: 1,
  supplier_id: 1,
  image_url: null,
  brand: null,
  supplier: null,
  categories: [],
  last_price_update: null,
  last_stock_update: null,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  deleted_at: null
})

vi.mock('../../services/Crud', () => ({
  productService: {
    fetch: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    uploadImage: vi.fn()
  }
}))

import { productService } from '../../services/Crud'

function mockResponse<T> (data: T, isOk = true) {
  return { isOk, code: isOk ? 200 : 500, data, error: null, message: '' }
}

describe('products store', () => {
  let store: ReturnType<typeof useProductsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useProductsStore()
    vi.clearAllMocks()
  })

  describe('getProducts / forceGetProducts', () => {
    it('fetches and stores products', async () => {
      vi.mocked(productService.fetch).mockResolvedValue(mockResponse([makeRawProduct()]))
      await store.getProducts()
      expect(store.products).toHaveLength(1)
      expect(store.products[0].name).toBe('Prod A')
    })

    it('returns early if already fetched and products are not empty', async () => {
      vi.mocked(productService.fetch).mockResolvedValue(mockResponse([makeRawProduct()]))
      await store.getProducts()
      expect(productService.fetch).toHaveBeenCalledTimes(1)

      await store.getProducts()
      expect(productService.fetch).toHaveBeenCalledTimes(1)
    })

    it('forceGetProducts always re-fetches', async () => {
      vi.mocked(productService.fetch).mockResolvedValue(mockResponse([makeRawProduct()]))
      await store.forceGetProducts()
      expect(productService.fetch).toHaveBeenCalledTimes(1)
      await store.forceGetProducts()
      expect(productService.fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('getProduct', () => {
    it('fetches and adds a single product', async () => {
      vi.mocked(productService.get).mockResolvedValue(mockResponse(makeRawProduct()))
      await store.getProduct('p-uuid-1')
      expect(store.products).toHaveLength(1)
    })

    it('updates existing product', async () => {
      vi.mocked(productService.fetch).mockResolvedValue(mockResponse([makeRawProduct()]))
      await store.getProducts()

      vi.mocked(productService.get).mockResolvedValue(
        mockResponse(makeRawProduct(1, 'p-uuid-1', 'Updated'))
      )
      await store.getProduct('p-uuid-1')
      expect(store.products).toHaveLength(1)
      expect(store.products[0].name).toBe('Updated')
    })

    it('pushes new product to the list if not present', async () => {
      vi.mocked(productService.get).mockResolvedValue(
        mockResponse(makeRawProduct(2, 'p-uuid-2', 'Product 2'))
      )
      await store.getProduct('p-uuid-2')
      expect(store.products).toHaveLength(1)
      expect(store.products[0].uuid).toBe('p-uuid-2')
    })
  })

  describe('createProduct', () => {
    it('adds to list', async () => {
      vi.mocked(productService.create).mockResolvedValue(
        mockResponse(makeRawProduct(2, 'p-uuid-2', 'New'))
      )
      await store.createProduct({
        name: 'New',
        code: 'N',
        stock: 0,
        min_stock_warning: 0,
        description: null,
        price: 0,
        brand_id: null,
        supplier_id: null
      })
      expect(store.products).toHaveLength(1)
    })
  })

  describe('updateProduct', () => {
    it('updates product in list', async () => {
      vi.mocked(productService.fetch).mockResolvedValue(mockResponse([makeRawProduct()]))
      await store.getProducts()

      vi.mocked(productService.update).mockResolvedValue(
        mockResponse(makeRawProduct(1, 'p-uuid-1', 'Edited'))
      )
      await store.updateProduct({
        uuid: 'p-uuid-1',
        name: 'Edited',
        code: 'P-001',
        stock: 10,
        min_stock_warning: 5,
        description: null,
        price: 100,
        brand_id: 1,
        supplier_id: 1
      })
      expect(store.products[0].name).toBe('Edited')
    })

    it('pushes product to the list if not present during update', async () => {
      vi.mocked(productService.update).mockResolvedValue(
        mockResponse(makeRawProduct(1, 'p-uuid-1', 'New in list'))
      )
      await store.updateProduct({
        uuid: 'p-uuid-1',
        name: 'New in list',
        code: 'P-001',
        stock: 10,
        min_stock_warning: 5,
        description: null,
        price: 100,
        brand_id: 1,
        supplier_id: 1
      })
      expect(store.products).toHaveLength(1)
      expect(store.products[0].name).toBe('New in list')
    })
  })

  describe('deleteProduct', () => {
    it('removes from list', async () => {
      vi.mocked(productService.fetch).mockResolvedValue(mockResponse([makeRawProduct()]))
      await store.getProducts()

      vi.mocked(productService.remove).mockResolvedValue(mockResponse(makeRawProduct()))
      await store.deleteProduct(store.products[0])
      expect(store.products).toHaveLength(0)
    })

    it('does nothing to list if product is not present', async () => {
      vi.mocked(productService.remove).mockResolvedValue(mockResponse(makeRawProduct()))
      await store.deleteProduct({
        id: 1,
        uuid: 'p-uuid-1',
        name: 'Prod A',
        created_at: new Date(),
        updated_at: new Date(),
        code: 'P-001',
        stock: 10,
        min_stock_warning: 5,
        description: null,
        price: 100,
        brand_id: 1,
        supplier_id: 1,
        image_url: null,
        brand: null,
        supplier: null,
        categories: [],
        last_price_update: null,
        last_stock_update: null,
        deleted_at: null
      })
      expect(store.products).toHaveLength(0)
    })
  })

  describe('uploadProductImage', () => {
    it('calls uploadImage and updates product', async () => {
      vi.mocked(productService.fetch).mockResolvedValue(mockResponse([makeRawProduct()]))
      await store.getProducts()

      vi.mocked(productService.uploadImage).mockResolvedValue(
        mockResponse(makeRawProduct(1, 'p-uuid-1', 'Prod A'))
      )
      const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' })
      await store.uploadProductImage('p-uuid-1', file)
      expect(productService.uploadImage).toHaveBeenCalledWith('p-uuid-1', file)
    })

    it('pushes product to list if not present during image upload', async () => {
      vi.mocked(productService.uploadImage).mockResolvedValue(
        mockResponse(makeRawProduct(1, 'p-uuid-1', 'Prod A'))
      )
      const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' })
      await store.uploadProductImage('p-uuid-1', file)
      expect(store.products).toHaveLength(1)
    })
  })

  describe('moneyInvested', () => {
    it('calculates total investment', async () => {
      vi.mocked(productService.fetch).mockResolvedValue(
        mockResponse([makeRawProduct(1, 'p1', 'A', 100, 10), makeRawProduct(2, 'p2', 'B', 50, 20)])
      )
      await store.getProducts()
      // 100*10 + 50*20 = 2000
      expect(store.moneyInvested).toBe(2000)
    })

    it('skips products with zero stock or null price', async () => {
      vi.mocked(productService.fetch).mockResolvedValue(
        mockResponse([
          makeRawProduct(1, 'p1', 'A', 100, 0),
          makeRawProduct(2, 'p2', 'B', null as unknown as number, 10)
        ])
      )
      await store.getProducts()
      expect(store.moneyInvested).toBe(0)
    })
  })
})
