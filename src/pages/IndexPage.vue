<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

import { Product } from '../types/product.interfaces'
import { useProductsStore } from '../stores/products'
import { byProduct } from '../utils/filters'
import { useNotify } from '../composition/useNotify'

import HomeItem from '../components/listItems/HomeItem.vue'
import FilterableList from '../components/filterable/FilterableList.vue'
import ProductStockDialog from '../components/dialogs/ProductStockDialog.vue'

const productsStore = useProductsStore()
const quasar = useQuasar()
const { errorNotify } = useNotify()

const selected = ref<Product | null>(null)
const showStock = ref(false)

const codePadding = computed(() => Math.max(...productsStore.products.map(x => x.code.length)))

onMounted(() => {
  quasar.loading.show()
  productsStore
    .getProducts()
    .catch(errorNotify('products.error_fetching'))
    .finally(() => quasar.loading.hide())
})
</script>

<template>
  <q-page padding>
    <filterable-list
      :items="productsStore.products"
      :filter-fn="byProduct"
      @changeSearch="selected = null"
      :items-per-page="50"
    >
      <template #default="{ item }">
        <home-item
          v-model:selected="selected"
          :product="item"
          :code-padding="codePadding"
        />
      </template>
    </filterable-list>

    <q-page-sticky position="bottom-right" :offset="[32, 32]">
      <transition name="fade">
          <q-btn
            v-show="selected"
            color="positive"
            size="xl"
            icon="assignment"
            round
            @click="showStock = true"
          />
      </transition>
    </q-page-sticky>

    <product-stock-dialog
      v-model="showStock"
      v-if="selected"
      :product="selected"
    />
  </q-page>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
