<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

import { useProductsStore } from '../../stores/products'
import { bulkOperationService } from '../../services/BulkOperationService'
import type { Product } from '../../types/product.interfaces'
import type { StockMovementType, StockChange } from '../../types/operations.interfaces'

import StockMovementStep from './steps/StockMovementStep.vue'
import StockProductsStep from './steps/StockProductsStep.vue'
import StockReviewStep from './steps/StockReviewStep.vue'

const { t } = useI18n()
const quasar = useQuasar()
const productsStore = useProductsStore()

// Stepper state
const step = ref(1)

// Step 1
const movementType = ref<StockMovementType | null>(null)
const movementStepRef = ref<InstanceType<typeof StockMovementStep> | null>(null)

// Step 2
const selectedProducts = ref<Product[]>([])
const quantities = ref<Record<string, number>>({})

// Review helpers
const canConfirm = computed(() => {
  if (!movementType.value) return false
  if (selectedProducts.value.length === 0) return false
  return selectedProducts.value.every((p) => (quantities.value[p.uuid] ?? 0) > 0)
})

const selectedMovement = computed(() =>
  movementStepRef.value?.movementOptions.find((m) => m.value === movementType.value)
)

function resetAll () {
  step.value = 1
  movementType.value = null
  selectedProducts.value = []
  quantities.value = {}
}

async function submit () {
  if (!canConfirm.value || !movementType.value) return

  const changes: StockChange[] = selectedProducts.value.map((p) => ({
    id: p.id,
    value: quantities.value[p.uuid] ?? 0
  }))

  quasar.loading.show()

  try {
    const response = await bulkOperationService.adjustStock({
      type: movementType.value,
      changes
    })

    if (response.isOk) {
      quasar.notify({
        color: 'positive',
        message: t('operations.stock_updated')
      })
      resetAll()
      await productsStore.forceGetProducts()
    } else {
      quasar.notify({
        color: 'negative',
        message: t('operations.error_stock')
      })
    }
  } catch {
    quasar.notify({
      color: 'negative',
      message: t('operations.error_stock')
    })
  } finally {
    quasar.loading.hide()
  }
}
</script>

<template>
  <q-stepper
    v-model="step"
    animated
    color="primary"
    flat
    bordered
  >
    <q-step
      :name="1"
      :title="t('operations.step_movement_type')"
      icon="swap_vert"
      :done="step > 1"
    >
      <stock-movement-step
        ref="movementStepRef"
        v-model="movementType"
        @next="step = 2"
      />
    </q-step>

    <q-step
      :name="2"
      :title="t('operations.step_select_products')"
      icon="inventory_2"
      :done="step > 2"
    >
      <stock-products-step
        v-model="selectedProducts"
        v-model:quantities="quantities"
        @next="step = 3"
        @back="step = 1"
      />
    </q-step>

    <q-step
      :name="3"
      :title="t('operations.step_review')"
      icon="checklist"
    >
      <stock-review-step
        :movement="selectedMovement"
        :products="selectedProducts"
        :quantities="quantities"
        :can-confirm="canConfirm"
        @confirm="submit"
        @back="step = 2"
      />
    </q-step>
  </q-stepper>
</template>
