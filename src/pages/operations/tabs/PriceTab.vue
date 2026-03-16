<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { bulkOperationService } from '../../../services/BulkOperationService'
import type { PriceAdjustmentType } from '../../../types/operations.interfaces'
import { useEntitySelection } from '../../../composition/components/useEntitySelection'
import { useBulkSubmit } from '../../../composition/components/useBulkSubmit'

import FilterableSelect from '../../../components/filterable/FilterableSelect.vue'

const { t } = useI18n()

const { entityType, entityUuid, entityTypeOptions, entityOptions, reset: resetEntity } = useEntitySelection()
const { execute } = useBulkSubmit()

const adjustmentType = ref<PriceAdjustmentType | null>(null)
const adjustmentValue = ref<number>(0)

const adjustmentTypeOptions = computed(() => [
  { label: t('operations.price_percentage'), value: 'price_percentage' as PriceAdjustmentType },
  { label: t('operations.price_fixed'), value: 'price_fixed' as PriceAdjustmentType }
])

const hint = computed(() => {
  if (adjustmentType.value === 'price_percentage') return t('operations.hint_percentage')
  if (adjustmentType.value === 'price_fixed') return t('operations.hint_fixed')
  return ''
})

const canSubmit = computed(() => {
  return (
    !!entityType.value &&
    !!entityUuid.value &&
    !!adjustmentType.value &&
    adjustmentValue.value !== 0
  )
})

const priceActionMap = {
  brand: bulkOperationService.adjustBrandPrice.bind(bulkOperationService),
  supplier: bulkOperationService.adjustSupplierPrice.bind(bulkOperationService),
  category: bulkOperationService.adjustCategoryPrice.bind(bulkOperationService)
} as const

async function submit () {
  if (!canSubmit.value || !entityUuid.value || !adjustmentType.value || !entityType.value) return

  const payload = { type: adjustmentType.value, value: adjustmentValue.value }
  const action = priceActionMap[entityType.value]

  await execute(
    () => action(entityUuid.value!, payload),
    'operations.price_updated',
    'operations.error_price',
    () => {
      adjustmentValue.value = 0
      adjustmentType.value = null
      resetEntity()
    }
  )
}
</script>

<template>
  <div class="q-gutter-md">
    <div class="row q-gutter-md">
      <q-select
        v-model="entityType"
        class="col-12 col-md-4"
        outlined
        emit-value
        map-options
        :options="entityTypeOptions"
        :label="t('operations.entity_type')"
      />

      <filterable-select
        v-if="entityType"
        v-model="entityUuid"
        class="col-12 col-md-4"
        :label="t('operations.select_entity')"
        :options="entityOptions"
      />
    </div>

    <div class="row q-gutter-md">
      <q-select
        v-model="adjustmentType"
        class="col-12 col-md-4"
        outlined
        emit-value
        map-options
        :options="adjustmentTypeOptions"
        :label="t('operations.adjustment_type')"
      />

      <q-input
        v-model.number="adjustmentValue"
        class="col-12 col-md-4"
        type="number"
        outlined
        :label="t('operations.value')"
        :hint="hint"
      />
    </div>

    <div class="row justify-end q-mt-md">
      <q-btn
        color="primary"
        :label="t('operations.apply')"
        :disable="!canSubmit"
        @click="submit"
      />
    </div>
  </div>
</template>
