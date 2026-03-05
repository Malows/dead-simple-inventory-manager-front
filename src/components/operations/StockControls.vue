<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import FilterInput from '../filterable/FilterInput.vue'
import FilterableSelect from '../filterable/FilterableSelect.vue'

defineProps<{
  brandsOptions: { label: string; value: number }[];
  suppliersOptions: { label: string; value: number }[];
  categoriesOptions: { label: string; value: number }[];
}>()

const search = defineModel<string>('search', { default: '' })
const brand = defineModel<number | null>('brand', { default: null })
const category = defineModel<number | null>('category', { default: null })
const supplier = defineModel<number | null>('supplier', { default: null })

const { t } = useI18n()
</script>

<template>
  <div class="row gap">
    <filter-input
      v-model="search"
      class="col"
      dense
    />

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
</template>

<style lang="css" scoped>
.gap {
  gap: 1rem;
}
</style>
