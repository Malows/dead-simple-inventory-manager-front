<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useProductsStore } from '../../stores/products'
import { useNotify } from '../../composition/useNotify'

import ProductForm from '../../components/forms/ProductForm.vue'

const productsStore = useProductsStore()
const route = useRoute()
const { t } = useI18n()
const { errorNotify, goodNotify } = useNotify()

const name = ref('')
const code = ref('')
const price = ref(0.0)
const description = ref('')
const stock = ref(0)
const stockWarning = ref(0)
const supplier = ref<number | null>(null)
const categories = ref<number[]>([])

const uuid = computed(() =>
  Array.isArray(route.params.productId)
    ? route.params.productId[0]
    : route.params.productId
)
const product = computed(() =>
  productsStore.products.find((product) => product.uuid === uuid.value)
)

onMounted(async () => {
  await productsStore
    .getProduct(uuid.value)
    .catch(errorNotify('products.error_getting', { name: 'products index' }))

  if (product.value) {
    name.value = product.value.name
    code.value = product.value.code
    price.value = product.value.price ?? 0.0
    description.value = product.value.description ?? ''
    stock.value = product.value.stock
    stockWarning.value = product.value.min_stock_warning
    supplier.value = product.value.supplier_id
    categories.value = product.value.categories?.map((x) => x.id) ?? []
  }
})

const submit = () => {
  const backRoute = { name: 'products show', params: route.params }

  productsStore
    .updateProduct({
      uuid: uuid.value,
      name: name.value,
      code: code.value,
      price: Number(price.value.toString().replace(',', '.')),
      description: description.value,
      stock: stock.value,
      min_stock_warning: stockWarning.value,
      supplier_id: supplier.value,
      categories: categories.value
    })
    .then(goodNotify('products.updated', backRoute))
    .catch(errorNotify('products.error_updating', backRoute))
}
</script>

<template>
  <q-page padding>
    <h4>{{ t("products.update") }}</h4>

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
        :label="t('common.update')"
        :loading="productsStore.productsRequest.fetching"
        @click="submit"
      />
    </div>
  </q-page>
</template>
