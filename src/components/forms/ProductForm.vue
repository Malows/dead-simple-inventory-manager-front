<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCategoriesStore } from '../../stores/categories'
import { useSuppliersStore } from '../../stores/suppliers'
import { useBrandsStore } from '../../stores/brands'

import FilterableSelect from '../FilterableSelect.vue'
import ToggleGrid from '../ToggleGrid.vue'

const { t } = useI18n()
const categoriesStore = useCategoriesStore()
const brandsStore = useBrandsStore()
const suppliersStore = useSuppliersStore()

const name = defineModel<string>('name', { default: '' })
const code = defineModel<string>('code', { default: '' })
const description = defineModel<string>('description', { default: '' })
const price = defineModel<number>('price', { default: 0 })
const stock = defineModel<number>('stock', { default: 0 })
const stockWarning = defineModel<number>('stockWarning', { default: 0 })
const supplier = defineModel<number | null>('supplier', { default: null })
const brand = defineModel<number | null>('brand', { default: null })
const categories = defineModel<number[]>('categories', { default: [] })

onMounted(() => {
  brandsStore.getBrands()
  categoriesStore.getCategories()
  suppliersStore.getSuppliers()
})
</script>

<template>
  <q-input
    v-model="name"
    :label="t('common.name')"
    lazy-rule
    :rules="[(val) => val?.length > 0 || t('common.required_field')]"
  />

  <div class="input-row--md">
    <q-input v-model="code" :label="t('products.Code')" />
    <q-input v-model.number="price" :label="t('products.Price')">
      <template #prepend>
        <q-icon name="attach_money" />
      </template>
    </q-input>
  </div>

  <q-input v-model="description" :label="t('products.Description')" />

  <div class="input-row--md">
    <q-input v-model.number="stock" type="number" :label="t('products.Stock')" />
    <q-input
      v-model.number="stockWarning"
      type="number"
      :label="t('products.lower_stock_warning')"
    />
  </div>

  <div class="input-row--md">
    <filterable-select
      v-model="brand"
      :label="t('brands.Brand')"
      :options="brandsStore.brandsOptions"
    />
    <filterable-select
      v-model="supplier"
      :label="t('suppliers.Supplier')"
      :options="suppliersStore.suppliersOptions"
    />
  </div>

  <toggle-grid
    v-model="categories"
    :label="t('categories.Categories')"
    :options="categoriesStore.categoriesOptions"
  />
</template>
