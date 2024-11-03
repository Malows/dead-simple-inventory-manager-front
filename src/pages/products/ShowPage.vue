<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useProductsStore } from '../../stores/products'
import { parsePrice } from '../../utils/text'

import PageWithActions from '../../components/pages/PageWithActions.vue'
import InlineData from '../../components/InlineData.vue'
import ProductDeleteDialog from '../../components/dialogs/ProductDeleteDialog.vue'
import ProductStockDialog from '../../components/dialogs/ProductStockDialog.vue'

const route = useRoute()
const quasar = useQuasar()
const { t } = useI18n()
const productsStore = useProductsStore()

const uuid = computed(() =>
  Array.isArray(route.params.productId)
    ? route.params.productId[0]
    : route.params.productId
)
const product = computed(() =>
  productsStore.products.find((product) => product.uuid === uuid.value)
)

onMounted(async () => {
  quasar.loading.show()

  productsStore
    .getProduct(uuid.value)
    .catch(console.error)
    .finally(() => quasar.loading.hide())
})

const showDeleteDialog = ref(false)
const showStockDialog = ref(false)

const editRoute = computed(() => ({
  name: 'products edit',
  params: route.params
}))
const price = computed(() =>
  product.value?.price ? parsePrice(product.value.price) : ''
)
</script>

<template>
  <page-with-actions v-if="product" :title="t('products.show')">
    <template #actions>
      <q-btn round color="primary" size="md" icon="edit" :to="editRoute" />
      <q-btn
        round
        color="negative"
        size="md"
        icon="delete"
        @click="showDeleteDialog = true"
      />
    </template>

    <inline-data :label="t('common.name')">{{ product.name }}</inline-data>
    <inline-data label="Descripcion">{{ product.description }}</inline-data>

    <div class="input-row--md">
      <inline-data label="Código">{{ product.code }}</inline-data>
      <inline-data label="Precio">{{ price }}</inline-data>
      <inline-data label="Stock">{{ product.stock }}</inline-data>
      <inline-data label="Advertencia de stock bajo">{{
        product.min_stock_warning
      }}</inline-data>
    </div>

    <inline-data v-if="product.supplier" label="Proveedor">
      <router-link
        :to="{
          name: 'suppliers show',
          params: { supplierId: product.supplier.uuid },
        }"
      >
        {{ product.supplier.name }}
      </router-link>
    </inline-data>

    <q-page-sticky position="bottom-right" :offset="[32, 32]">
      <q-btn
        round
        color="positive"
        size="xl"
        icon="assignment"
        @click="showStockDialog = true"
      />
    </q-page-sticky>

    <product-delete-dialog v-model="showDeleteDialog" :product="product" />
    <product-stock-dialog v-model="showStockDialog" :product="product" />
  </page-with-actions>
</template>
