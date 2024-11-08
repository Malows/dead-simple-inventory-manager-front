<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useProductsStore } from '../../stores/products'
import { useNotify } from '../../composition/useNotify'

import ProductForm from '../../components/forms/ProductForm.vue'

const productsStore = useProductsStore()
const { t } = useI18n()
const { errorNotify, goodNotify } = useNotify()

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
    .then(goodNotify('products.created', { name: 'products index' }))
    .catch(errorNotify('products.error_creating'))
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
