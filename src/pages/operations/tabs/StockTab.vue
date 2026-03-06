<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { bulkOperationService } from '../../../services/BulkOperationService'
import type { StockMovementType } from '../../../types/operations.interfaces'
import { useOperationsStore } from '../../../stores/operations'

import { useBulkSubmit } from '../../../composition/components/useBulkSubmit'

import StockMovementStep from '../steps/StockMovementStep.vue'
import StockProductsStep from '../steps/StockProductsStep.vue'
import StockReviewStep from '../steps/StockReviewStep.vue'

const { t } = useI18n()
const { execute } = useBulkSubmit()
const operationsStore = useOperationsStore()

const movementStepRef = ref<InstanceType<typeof StockMovementStep> | null>(null)

const movementModel = computed<StockMovementType | null>({
  get: () => operationsStore.movementType,
  set: (value) => operationsStore.setMovementType(value)
})

const stepModel = computed({
  get: () => operationsStore.step,
  set: (value: number) => operationsStore.goToStep(value)
})

const selectedMovement = computed(() =>
  movementStepRef.value?.movementOptions.find((m) => m.value === operationsStore.movementType)
)

onMounted(() => {
  operationsStore.resetAll()
})

async function submit () {
  if (!operationsStore.canConfirm || !operationsStore.movementType) return

  await execute(
    () => bulkOperationService.adjustStock({ type: operationsStore.movementType!, changes: operationsStore.stockChanges }),
    'operations.stock_updated',
    'operations.error_stock',
    operationsStore.resetAll
  )
}
</script>

<template>
  <q-stepper
    v-model="stepModel"
    animated
    header-nav
    color="primary"
    flat
    bordered
  >
    <q-step
      :name="1"
      :title="t('operations.step_movement_type')"
      icon="swap_vert"
      :done="operationsStore.step > 1"
    >
      <stock-movement-step
        ref="movementStepRef"
        v-model="movementModel"
        @next="operationsStore.goToStep(2)"
      />
    </q-step>

    <q-step
      :name="2"
      :title="t('operations.step_select_products')"
      icon="inventory_2"
      :done="operationsStore.step > 2"
    >
      <stock-products-step
        @next="operationsStore.goToStep(3)"
        @back="operationsStore.goToStep(1)"
      />
    </q-step>

    <q-step
      :name="3"
      :title="t('operations.step_review')"
      icon="checklist"
    >
      <stock-review-step
        :movement="selectedMovement"
        :can-confirm="operationsStore.canConfirm"
        @confirm="submit"
        @back="operationsStore.goToStep(2)"
      />
    </q-step>
  </q-stepper>
</template>
