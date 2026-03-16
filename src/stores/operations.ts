import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { Product } from '../types/product.interfaces'
import type { StockMovementType } from '../types/operations.interfaces'
import { parseStockChanges } from '../services/interceptors/stock.interceptors'
import { getQuantityInitialValue, isQuantityValid } from '../utils/operations'

export const useOperationsStore = defineStore('operations', () => {
  const step = ref(1)
  const movementType = ref<StockMovementType | null>(null)
  const selectedProducts = ref<Product[]>([])
  const quantities = ref<Record<string, number>>({})

  function syncQuantitiesForSelection () {
    const currentMovementType = movementType.value

    if (!currentMovementType) {
      quantities.value = {}
      return
    }

    const nextQuantities = selectedProducts.value.reduce<Record<string, number>>((acc, product) => {
      const currentValue = quantities.value[product.uuid]

      if (typeof currentValue === 'number') {
        acc[product.uuid] = currentValue
        return acc
      }

      acc[product.uuid] = getQuantityInitialValue(currentMovementType, product.stock)
      return acc
    }, {})

    quantities.value = nextQuantities
  }

  function setMovementType (type: StockMovementType | null) {
    movementType.value = type

    if (!type) {
      quantities.value = {}
      return
    }

    quantities.value = selectedProducts.value.reduce<Record<string, number>>((acc, product) => {
      acc[product.uuid] = getQuantityInitialValue(type, product.stock)
      return acc
    }, {})
  }

  function setSelectedProducts (products: Product[]) {
    selectedProducts.value = products
    syncQuantitiesForSelection()
  }

  function setQuantity (uuid: string, value: number) {
    const normalizedValue = Number.isFinite(value) ? Math.max(0, value) : 0
    quantities.value[uuid] = normalizedValue
  }

  function goToStep (nextStep: number) {
    step.value = nextStep
  }

  function resetAll () {
    step.value = 1
    movementType.value = null
    selectedProducts.value = []
    quantities.value = {}
  }

  const canContinue = computed(() => {
    const currentMovementType = movementType.value

    if (!currentMovementType) return false
    if (selectedProducts.value.length === 0) return false

    if (currentMovementType === 'adjustment') {
      return selectedProducts.value.every((product) => {
        const quantity = quantities.value[product.uuid] ?? getQuantityInitialValue('adjustment', product.stock)
        return isQuantityValid('adjustment', quantity, product.stock)
      })
    }

    return selectedProducts.value.every((product) => {
      const quantity = quantities.value[product.uuid] ?? 0
      if (quantity <= 0) return false
      return isQuantityValid(currentMovementType, quantity, product.stock)
    })
  })

  const canConfirm = computed(() => canContinue.value)

  const stockChanges = computed(() => {
    if (!movementType.value) return []
    return parseStockChanges(movementType.value, selectedProducts.value, quantities.value)
  })

  return {
    step,
    movementType,
    selectedProducts,
    quantities,
    canContinue,
    canConfirm,
    stockChanges,
    setMovementType,
    setSelectedProducts,
    setQuantity,
    goToStep,
    resetAll
  }
})
