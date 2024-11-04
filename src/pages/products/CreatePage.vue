<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

import { useProductsStore } from '../../stores/products'

import ProductForm from 'src/components/forms/ProductForm.vue'

const router = useRouter()
const quasar = useQuasar()
const { t } = useI18n()
const productsStore = useProductsStore()

const name = ref('')
const code = ref('')
const price = ref(0.0)
const description = ref('')
const stock = ref(0)
const stockWarning = ref(0)
const supplier = ref(null)
const categories = ref<number[]>([])

const submit = () => {
  productsStore
    .createProduct({
      name: name.value,
      code: code.value,
      price: Number(price.value.toString().replace(',', '.')),
      description: description.value,
      stock: stock.value,
      min_stock_warning: stockWarning.value,
      supplier_id: supplier.value,
      categories: categories.value
    })
    .then(({ isOk, error }) => {
      if (!isOk) throw error

      quasar.notify({
        color: 'positive',
        message: t('products.created')
      })
      router.push({ name: 'products index' })
    })
    .catch((error) => {
      quasar.notify({
        color: 'negative',
        message: t('products.error_creating')
      })
      console.error(error)
    })
}
</script>

<template>
  <q-page padding>
    <h4>{{ t("products.create") }}</h4>

    <div class="q-gutter-md">
      <product-form
        v-model:name="name"
        v-model:code="code"
        v-model:description="description"
        v-model:price.number="price"
        v-model:stock.number="stock"
        v-model:stock-warning.number="stockWarning"
        v-model:supplier="supplier"
        v-model:categories="categories"
      />

      <q-btn
        color="primary"
        :label="t('common.create')"
        :loading="productsStore.productsRequest.fetching"
        @click="submit"
      />
    </div>
  </q-page>
</template>
