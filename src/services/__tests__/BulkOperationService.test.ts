import { describe, it, expect, vi, beforeEach } from 'vitest'
import { bulkOperationService } from '../BulkOperationService'
import { BULK_OPERATIONS_URL } from '../api'

function mockFetchResponse (data: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data)
  } as unknown as Response)
}

describe('BulkOperationService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('adjustStock', () => {
    it('calls POST to /stock with StockRequest body', async () => {
      const fetchMock = mockFetchResponse({ affected_resources: 3, message: 'OK' })
      vi.stubGlobal('fetch', fetchMock)

      const payload = {
        type: 'purchase' as const,
        changes: [
          { id: 1, value: 5 },
          { id: 2, value: 10 }
        ]
      }
      const result = await bulkOperationService.adjustStock(payload)

      expect(fetchMock).toHaveBeenCalledWith(
        `${BULK_OPERATIONS_URL}/stock`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(payload)
        })
      )
      expect(result.data).toEqual({ affected_resources: 3, message: 'OK' })
    })
  })

  describe('adjustBrandPrice', () => {
    it('calls POST to /brands/{uuid}', async () => {
      const fetchMock = mockFetchResponse({ affected_resources: 5, message: 'OK' })
      vi.stubGlobal('fetch', fetchMock)

      const payload = { type: 'price_percentage' as const, value: 10 }
      await bulkOperationService.adjustBrandPrice('brand-uuid', payload)

      expect(fetchMock).toHaveBeenCalledWith(
        `${BULK_OPERATIONS_URL}/brands/brand-uuid`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(payload)
        })
      )
    })
  })

  describe('adjustCategoryPrice', () => {
    it('calls POST to /categories/{uuid}', async () => {
      const fetchMock = mockFetchResponse({ affected_resources: 2, message: 'OK' })
      vi.stubGlobal('fetch', fetchMock)

      const payload = { type: 'price_fixed' as const, value: -50 }
      await bulkOperationService.adjustCategoryPrice('cat-uuid', payload)

      expect(fetchMock).toHaveBeenCalledWith(
        `${BULK_OPERATIONS_URL}/categories/cat-uuid`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(payload)
        })
      )
    })
  })

  describe('adjustSupplierPrice', () => {
    it('calls POST to /suppliers/{uuid}', async () => {
      const fetchMock = mockFetchResponse({ affected_resources: 8, message: 'OK' })
      vi.stubGlobal('fetch', fetchMock)

      const payload = { type: 'price_percentage' as const, value: -15 }
      await bulkOperationService.adjustSupplierPrice('sup-uuid', payload)

      expect(fetchMock).toHaveBeenCalledWith(
        `${BULK_OPERATIONS_URL}/suppliers/sup-uuid`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(payload)
        })
      )
    })
  })
})
