<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useProductsStore } from '../../../stores/products'
import { useBrandsStore } from '../../../stores/brands'
import { useCategoriesStore } from '../../../stores/categories'
import { useSuppliersStore } from '../../../stores/suppliers'
import type { Product } from '../../../types/product.interfaces'

import FilterInput from '../../filterable/FilterInput.vue'
import FilterableSelect from '../../FilterableSelect.vue'
import TransferList from '../TransferList.vue'

const { t } = useI18n()

defineEmits<{ next: []; back: []; }>()

const productsStore = useProductsStore()
const brandsStore = useBrandsStore()
const categoriesStore = useCategoriesStore()
const suppliersStore = useSuppliersStore()

const selectedProducts = defineModel<Product[]>({ default: () => [] })
const quantities = defineModel<Record<string, number>>('quantities', { default: () => ({}) })

const searchText = ref('')
const filterBrand = ref<number | null>(null)
const filterSupplier = ref<number | null>(null)
const filterCategory = ref<number | null>(null)

const canContinue = computed(() => {
  if (selectedProducts.value.length === 0) return false
  return selectedProducts.value.every((p) => (quantities.value[p.uuid] ?? 0) > 0)
})
</script>

<template>
  <div class="row gap q-mb-md">
    <filter-input dense v-model="searchText" class="col-12 col-md" />

    <filterable-select
      v-model="filterBrand"
      class="col"
      :label="t('brands.Brand')"
      :options="brandsStore.brandsOptions"
    />

    <filterable-select
      v-model="filterSupplier"
      class="col"
      :label="t('suppliers.Supplier')"
      :options="suppliersStore.suppliersOptions"
    />

    <filterable-select
      v-model="filterCategory"
      class="col"
      :label="t('categories.Category')"
      :options="categoriesStore.categoriesOptions"
    />
  </div>

  <transfer-list
    v-model="selectedProducts"
    v-model:quantities="quantities"
    :items="productsStore.products"
    :search-text="searchText"
    :filter-brand="filterBrand"
    :filter-supplier="filterSupplier"
    :filter-category="filterCategory"
    show-quantities
  />

  <q-stepper-navigation>
    <q-btn
      color="primary"
      :label="t('operations.next')"
      :disable="!canContinue"
      @click="$emit('next')"
    />
    <q-btn
      flat
      color="primary"
      :label="t('operations.back')"
      class="q-ml-sm"
      @click="$emit('back')"
    />
  </q-stepper-navigation>
</template>

<style scoped lang="css">
.gap {
  gap: 1rem;
}
</style>
