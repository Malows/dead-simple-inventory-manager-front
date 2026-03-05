<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { StockMovementType } from '../../types/operations.interfaces'

import FilterInput from '../filterable/FilterInput.vue'
import FilterableSelect from '../filterable/FilterableSelect.vue'

defineProps<{
  brandsOptions: { label: string; value: number }[];
  suppliersOptions: { label: string; value: number }[];
  categoriesOptions: { label: string; value: number }[];
}>()

const movementType = defineModel<StockMovementType | null>('type', { default: null })
const search = defineModel<string>('search', { default: '' })
const brand = defineModel<number | null>('brand', { default: null })
const category = defineModel<number | null>('category', { default: null })
const supplier = defineModel<number | null>('supplier', { default: null })

const { t } = useI18n()

const movementOptions = computed(() => [
  { label: t('operations.purchase'), value: 'purchase' as StockMovementType },
  { label: t('operations.sale'), value: 'sale' as StockMovementType },
  { label: t('operations.adjustment'), value: 'adjustment' as StockMovementType },
  { label: t('operations.return'), value: 'return' as StockMovementType }
])
</script>

<template>

<div>
      <div class="row q-gutter-md items-start">
      <q-select
      v-model="movementType"
      class="col-12 col-md-4"
      outlined
      emit-value
      map-options
      :options="movementOptions"
      :label="t('operations.movement_type')"
      :rules="[() => !!movementType || t('operations.select_movement_type')]"
      />

    </div>

    <q-separator class="q-my-md" />
  <div class="row gap">
    <filter-input dense v-model="search" />

    <filterable-select
      v-model="brand"
      class="col"
      :label="t('brands.Brand')"
      :options="brandsOptions"
    />

    <filterable-select
      v-model="supplier"
      class="col"
      :label="t('suppliers.Supplier')"
      :options="suppliersOptions"
    />

    <filterable-select
      v-model="category"
      class="col"
      :label="t('categories.Category')"
      :options="categoriesOptions"
    />
  </div>
  </div>
</template>

<style lang="css" scoped>
.gap {
  gap: 1rem;
}
</style>
