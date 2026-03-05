import Service from './Service'
import HttpResponse, { handle } from './Response'
import { BULK_OPERATIONS_URL } from './api'
import type {
  StockRequest,
  PriceRequest,
  BulkOperationResponse
} from '../types/operations.interfaces'

class BulkOperationService extends Service {
  adjustStock (payload: StockRequest): Promise<HttpResponse<BulkOperationResponse>> {
    return handle<BulkOperationResponse>(
      fetch(`${BULK_OPERATIONS_URL}/stock`, {
        headers: this.authHeader(),
        method: 'POST',
        body: JSON.stringify(payload)
      })
    )
  }

  adjustBrandPrice (
    brandUuid: string,
    payload: PriceRequest
  ): Promise<HttpResponse<BulkOperationResponse>> {
    return handle<BulkOperationResponse>(
      fetch(`${BULK_OPERATIONS_URL}/brands/${brandUuid}`, {
        headers: this.authHeader(),
        method: 'POST',
        body: JSON.stringify(payload)
      })
    )
  }

  adjustCategoryPrice (
    categoryUuid: string,
    payload: PriceRequest
  ): Promise<HttpResponse<BulkOperationResponse>> {
    return handle<BulkOperationResponse>(
      fetch(`${BULK_OPERATIONS_URL}/categories/${categoryUuid}`, {
        headers: this.authHeader(),
        method: 'POST',
        body: JSON.stringify(payload)
      })
    )
  }

  adjustSupplierPrice (
    supplierUuid: string,
    payload: PriceRequest
  ): Promise<HttpResponse<BulkOperationResponse>> {
    return handle<BulkOperationResponse>(
      fetch(`${BULK_OPERATIONS_URL}/suppliers/${supplierUuid}`, {
        headers: this.authHeader(),
        method: 'POST',
        body: JSON.stringify(payload)
      })
    )
  }
}

export const bulkOperationService = new BulkOperationService()
