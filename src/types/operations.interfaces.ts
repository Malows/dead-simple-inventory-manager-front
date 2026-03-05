export type StockMovementType = 'purchase' | 'sale' | 'adjustment' | 'return';

export type PriceAdjustmentType = 'price_percentage' | 'price_fixed';

export interface StockChange {
  id: number;
  value: number;
}

export interface StockRequest {
  type: StockMovementType;
  changes: StockChange[];
}

export interface PriceRequest {
  type?: PriceAdjustmentType;
  value: number;
}

export interface BulkOperationResponse {
  affected_resources: number;
  message: string;
}

export type PriceEntityType = 'brand' | 'supplier' | 'category';
