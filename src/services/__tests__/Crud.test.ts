import { describe, it, expect, vi, beforeEach } from 'vitest'
import { brandService, categoryService, productService, supplierService } from '../Crud'
import { BRANDS_URL, CATEGORIES_URL, PRODUCTS_URL, SUPPLIERS_URL } from '../api'

function mockFetchResponse (data: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data)
  } as unknown as Response)
}

describe('Crud services', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('brandService has correct URL', () => {
    expect(brandService.url()).toBe(BRANDS_URL)
  })

  it('categoryService has correct URL', () => {
    expect(categoryService.url()).toBe(CATEGORIES_URL)
  })

  it('productService has correct URL', () => {
    expect(productService.url()).toBe(PRODUCTS_URL)
  })

  it('supplierService has correct URL', () => {
    expect(supplierService.url()).toBe(SUPPLIERS_URL)
  })

  describe('ProductService.uploadImage', () => {
    it('sends POST with FormData to /image endpoint', async () => {
      const fetchMock = mockFetchResponse({ id: 1, name: 'P' })
      vi.stubGlobal('fetch', fetchMock)

      const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' })
      await productService.uploadImage('prod-uuid', file)

      expect(fetchMock).toHaveBeenCalledWith(
        `${PRODUCTS_URL}/prod-uuid/image`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      )
    })
  })
})
