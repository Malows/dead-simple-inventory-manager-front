import type { Product } from '../../types/product.interfaces'
import type { StockChange, StockMovementType } from '../../types/operations.interfaces'

type StockChangeStrategy = (currentStock: number, inputValue: number) => number

export const stockChangeStrategies: Record<StockMovementType, StockChangeStrategy> = {
  purchase: (currentStock, inputValue) => currentStock + inputValue,
  return: (currentStock, inputValue) => currentStock + inputValue,
  sale: (currentStock, inputValue) => currentStock - inputValue,
  adjustment: (_currentStock, inputValue) => inputValue
}

export function parseStockChange (
  movementType: StockMovementType,
  product: Product,
  inputValue: number
): StockChange {
  const strategy = stockChangeStrategies[movementType]
  const normalizedInput = Number.isFinite(inputValue) ? Math.max(0, inputValue) : 0

  return {
    id: product.id,
    value: strategy(product.stock, normalizedInput)
  }
}

export function parseStockChanges (
  movementType: StockMovementType,
  products: Product[],
  quantities: Record<string, number>
): StockChange[] {
  return products.map((product) => parseStockChange(movementType, product, quantities[product.uuid] ?? 0))
}
