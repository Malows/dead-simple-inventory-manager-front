<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'

import { useProductsStore } from '../../stores/products'
import { byProduct } from '../../utils/filters'

import PageWithAdd from '../../components/pages/PageWithActions.vue'
import FilterableList from '../../components/filterable/FilterableList.vue'
import ProductItem from '../../components/listItems/ProductItem.vue'

const productsStore = useProductsStore()
const quasar = useQuasar()
const codePadding = computed(() => Math.max(...productsStore.products.map(x => x.code.length)))

onMounted(() => {
  quasar.loading.show()
  productsStore
    .getProducts()
    .catch(console.error)
    .finally(() => {
      quasar.loading.hide()
    })
})
</script>

<template>
  <page-with-add title="Productos" :to="{ name: 'products create'}">
    <filterable-list :items="productsStore.products" :filter-fn="byProduct" :items-per-page="50">
      <template #default="{ item }">
        <product-item :product="item" :code-padding="codePadding" />
      </template>
    </filterable-list>
  </page-with-add>
</template>
