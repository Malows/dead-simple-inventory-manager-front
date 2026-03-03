<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

import { useProductsStore } from '../../stores/products'
import { useBrandsStore } from '../../stores/brands'
import { useCategoriesStore } from '../../stores/categories'
import { useSuppliersStore } from '../../stores/suppliers'
import { useNotify } from '../../composition/useNotify'

import StockTab from '../../components/operations/StockTab.vue'
import PriceTab from '../../components/operations/PriceTab.vue'

const { t } = useI18n()
const quasar = useQuasar()
const { errorNotify } = useNotify()

const productsStore = useProductsStore()
const brandsStore = useBrandsStore()
const categoriesStore = useCategoriesStore()
const suppliersStore = useSuppliersStore()

const activeTab = ref('stock')

onMounted(() => {
  quasar.loading.show()

  Promise.all([
    productsStore.getProducts(),
    brandsStore.getBrands(),
    categoriesStore.getCategories(),
    suppliersStore.getSuppliers()
  ])
    .catch(errorNotify('operations.error_stock'))
    .finally(() => quasar.loading.hide())
})
</script>

<template>
  <q-page padding>
    <h4>{{ t("operations.Operations") }}</h4>

    <q-tabs
      v-model="activeTab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="stock" :label="t('operations.stock')" />
      <q-tab name="prices" :label="t('operations.prices_by_group')" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel name="stock">
        <stock-tab />
      </q-tab-panel>

      <q-tab-panel name="prices">
        <price-tab />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
