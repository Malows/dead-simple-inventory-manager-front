import type { StockMovementType } from '../types/operations.interfaces'

export function isQuantityValid (
  movementType: StockMovementType,
  quantity: number,
  currentStock: number
): boolean {
  if (!Number.isFinite(quantity) || quantity < 0) {
    return false
  }

  if (movementType !== 'sale') return true

  return quantity <= currentStock
}

export function getQuantityInitialValue (movementType: StockMovementType, currentStock: number): number {
  if (movementType === 'adjustment') {
    return currentStock
  }

  return 0
}

export function getQuantityMax (movementType: StockMovementType, currentStock: number): number | undefined {
  return movementType === 'sale' ? currentStock : undefined
}
