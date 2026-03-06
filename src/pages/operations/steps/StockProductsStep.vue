<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useProductsStore } from '../../../stores/products'
import { useBrandsStore } from '../../../stores/brands'
import { useCategoriesStore } from '../../../stores/categories'
import { useSuppliersStore } from '../../../stores/suppliers'
import { useOperationsStore } from '../../../stores/operations'

import TransferList from '../../../components/operations/TransferList.vue'
import StockControls from '../../../components/operations/StockControls.vue'

const { t } = useI18n()

defineEmits<{ next: []; back: []; }>()

const productsStore = useProductsStore()
const brandsStore = useBrandsStore()
const categoriesStore = useCategoriesStore()
const suppliersStore = useSuppliersStore()
const operationsStore = useOperationsStore()

const searchText = ref('')
const filterBrand = ref<number | null>(null)
const filterSupplier = ref<number | null>(null)
const filterCategory = ref<number | null>(null)

const canContinue = computed(() => operationsStore.canContinue)
</script>

<template>
  <stock-controls
    v-model:brand="filterBrand"
    v-model:category="filterCategory"
    v-model:supplier="filterSupplier"
    v-model:search="searchText"
    class="q-mb-md"
    :brands-options="brandsStore.brandsOptions"
    :suppliers-options="suppliersStore.suppliersOptions"
    :categories-options="categoriesStore.categoriesOptions"
  />

  <transfer-list
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
