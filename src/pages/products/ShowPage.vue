<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useProductsStore } from '../../stores/products'
import { parsePrice } from '../../utils/text'
import { useNotify } from '../../composition/useNotify'

import PageWithActions from '../../components/pages/PageWithActions.vue'
import InlineData from '../../components/InlineData.vue'
import ProductDeleteDialog from '../../components/dialogs/ProductDeleteDialog.vue'
import ProductStockDialog from '../../components/dialogs/ProductStockDialog.vue'
import ProductPhotoDialog from '../../components/dialogs/ProductPhotoDialog.vue'

const productsStore = useProductsStore()
const route = useRoute()
const quasar = useQuasar()
const { t } = useI18n()
const { errorNotify } = useNotify()

const uuid = computed(() =>
  Array.isArray(route.params.productId) ? route.params.productId[0] : route.params.productId
)
const product = computed(() =>
  productsStore.products.find((product) => product.uuid === uuid.value)
)

onMounted(() => {
  quasar.loading.show()
  productsStore
    .getProduct(uuid.value)
    .catch(errorNotify('products.error_getting', { name: 'products index' }))
    .finally(() => quasar.loading.hide())
})

const showDeleteDialog = ref(false)
const showStockDialog = ref(false)
const showPhotoDialog = ref(false)

const editRoute = computed(() => ({
  name: 'products edit',
  params: route.params
}))
const price = computed(() => (product.value?.price ? parsePrice(product.value.price) : ''))
</script>

<template>
  <page-with-actions v-if="product" :title="t('products.show')">
    <template #actions>
      <q-btn round color="primary" size="md" icon="edit" :to="editRoute" />
      <q-btn round color="primary" size="md" icon="photo" @click="showPhotoDialog = true" />
      <q-btn round color="negative" size="md" icon="delete" @click="showDeleteDialog = true" />
    </template>

    <!-- Product Image -->
    <div v-if="product.image_url" class="q-mb-md">
      <q-img
        :src="product.image_url"
        fit="contain"
        class="product-image-card"
        spinner-color="primary"
        loading="lazy"
      >
        <template #error>
          <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
            <q-icon name="broken_image" size="64px" />
          </div>
        </template>
      </q-img>
    </div>

    <inline-data :label="t('common.name')">
      {{ product.name }}
    </inline-data>
    <inline-data :label="t('products.Description')">
      {{ product.description }}
    </inline-data>

    <div class="input-row--md">
      <inline-data :label="t('products.Code')">
        {{ product.code }}
      </inline-data>
      <inline-data :label="t('products.Price')">
        {{ price }}
      </inline-data>
      <inline-data label="Stock">
        {{ product.stock }}
      </inline-data>
      <inline-data :label="t('products.lower_stock_warning')">
        {{ product.min_stock_warning }}
      </inline-data>
    </div>

    <inline-data v-if="product.brand" :label="t('brands.Brand')">
      <router-link
        :to="{
          name: 'brands show',
          params: { brandId: product.brand.uuid },
        }"
      >
        {{ product.brand.name }}
      </router-link>
    </inline-data>

    <inline-data v-if="product.supplier" :label="t('suppliers.Supplier')">
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
      <q-btn round color="positive" size="xl" icon="assignment" @click="showStockDialog = true" />
    </q-page-sticky>

    <product-delete-dialog v-model="showDeleteDialog" :product />
    <product-stock-dialog v-model="showStockDialog" :product />
    <product-photo-dialog v-model="showPhotoDialog" :product />
  </page-with-actions>
</template>

<style scoped>
.product-image-card {
  border-radius: 8px;
  max-height: 400px;
}
</style>
