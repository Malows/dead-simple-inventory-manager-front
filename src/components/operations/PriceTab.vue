<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

import { useBrandsStore } from '../../stores/brands'
import { useCategoriesStore } from '../../stores/categories'
import { useSuppliersStore } from '../../stores/suppliers'
import { useProductsStore } from '../../stores/products'
import { bulkOperationService } from '../../services/BulkOperationService'
import type { PriceAdjustmentType, PriceEntityType } from '../../types/operations.interfaces'
import type { SelectOption } from '../../types'

import FilterableSelect from '../FilterableSelect.vue'

const { t } = useI18n()
const quasar = useQuasar()
const brandsStore = useBrandsStore()
const categoriesStore = useCategoriesStore()
const suppliersStore = useSuppliersStore()
const productsStore = useProductsStore()

const entityType = ref<PriceEntityType | null>(null)
const entityUuid = ref<string | null>(null)
const adjustmentType = ref<PriceAdjustmentType | null>(null)
const adjustmentValue = ref<number>(0)

const entityTypeOptions = computed(() => [
  { label: t('operations.by_brand'), value: 'brand' as PriceEntityType },
  { label: t('operations.by_supplier'), value: 'supplier' as PriceEntityType },
  { label: t('operations.by_category'), value: 'category' as PriceEntityType }
])

const adjustmentTypeOptions = computed(() => [
  { label: t('operations.price_percentage'), value: 'price_percentage' as PriceAdjustmentType },
  { label: t('operations.price_fixed'), value: 'price_fixed' as PriceAdjustmentType }
])

const entityOptions = computed<SelectOption<string>[]>(() => {
  switch (entityType.value) {
    case 'brand':
      return brandsStore.brands.map((b) => ({ label: b.name, value: b.uuid }))
    case 'supplier':
      return suppliersStore.suppliers.map((s) => ({ label: s.name, value: s.uuid }))
    case 'category':
      return categoriesStore.categories.map((c) => ({ label: c.name, value: c.uuid }))
    default:
      return []
  }
})

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

// Reset entity selection when entity type changes
watch(entityType, () => {
  entityUuid.value = null
})

async function submit () {
  if (!canSubmit.value || !entityUuid.value || !adjustmentType.value || !entityType.value) return

  const payload = {
    type: adjustmentType.value,
    value: adjustmentValue.value
  }

  quasar.loading.show()

  try {
    let response

    switch (entityType.value) {
      case 'brand':
        response = await bulkOperationService.adjustBrandPrice(entityUuid.value, payload)
        break
      case 'supplier':
        response = await bulkOperationService.adjustSupplierPrice(entityUuid.value, payload)
        break
      case 'category':
        response = await bulkOperationService.adjustCategoryPrice(entityUuid.value, payload)
        break
    }

    if (response?.isOk) {
      quasar.notify({
        color: 'positive',
        message: t('operations.price_updated')
      })
      adjustmentValue.value = 0
      entityUuid.value = null
      adjustmentType.value = null
      entityType.value = null
      await productsStore.forceGetProducts()
    } else {
      quasar.notify({
        color: 'negative',
        message: t('operations.error_price')
      })
    }
  } catch {
    quasar.notify({
      color: 'negative',
      message: t('operations.error_price')
    })
  } finally {
    quasar.loading.hide()
  }
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
      <q-btn color="primary" :label="t('operations.apply')" :disable="!canSubmit" @click="submit" />
    </div>
  </div>
</template>
