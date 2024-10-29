<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

import { useCategoriesStore } from '../../stores/categories'
import { useProductsStore } from '../../stores/products'
import { useSuppliersStore } from '../../stores/suppliers'
import { SelectOption, WithId } from '../../types/index'

import ToggleGrid from 'src/components/ToggleGrid.vue'

const route = useRoute()
const router = useRouter()
const quasar = useQuasar()
const categoriesStore = useCategoriesStore()
const productsStore = useProductsStore()
const suppliersStore = useSuppliersStore()

const name = ref('')
const code = ref('')
const price = ref(0.0)
const description = ref('')
const stock = ref(0)
const stockWarning = ref(0)
const supplier = ref<number | null>(null)
const categories = ref<number[]>([])

const uuid = computed(() => Array.isArray(route.params.productId) ? route.params.productId[0] : route.params.productId)
const product = computed(() => productsStore.products.find((product) => product.uuid === uuid.value))

onMounted(async () => {
  quasar.loading.show()

  await Promise.all([
    productsStore.getProduct(uuid.value),
    categoriesStore.getCategories(),
    suppliersStore.getSuppliers()
  ])
    .catch(console.error)
    .finally(() => quasar.loading.hide())

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

const categoriesOptions = computed(() => categoriesStore.categories.map((category) => ({ label: category.name, value: category.id, id: category.id }) as WithId<SelectOption<number>>))
const suppliersOptions = computed(() => suppliersStore.suppliers.map((supplier) => ({ label: supplier.name, value: supplier.id }) as SelectOption<number>))

const submit = () => {
  productsStore.updateProduct({
    ...product.value,
    name: name.value,
    code: code.value,
    price: Number(price.value.toString().replace(',', '.')),
    description: description.value,
    stock: stock.value,
    min_stock_warning: stockWarning.value,
    supplier_id: supplier.value,
    categories: categories.value.map((id) => categoriesStore.categoriesMap.get(id)!)
  })
    .then(() => {
      quasar.notify('Producto creado')
      return router.push({ name: 'products index' })
    })
    .catch(console.error)
}
</script>

<template>
  <q-page padding>
    <h4>Editar producto</h4>

    <div class="q-gutter-md">
      <q-input label="Nombre" v-model="name"  lazy-rule :rules="[val => val?.length > 0 || 'Campo requerido']" />

      .input-row--md
        <q-input label="Codigo" v-model="code" />
        q-input(label="Precio" v-model="price")
          template(#prepend)
            q-icon(name="attach_money")

      <q-input label="Descripcion" v-model="description" />

      .input-row--md
        <q-input label="Stock" type="number" v-model.number="stock" />
        <q-input label="Advertencia de stock bajo" type="number" v-model.number="stockWarning" />

      <q-select label="Proveedor" v-model="supplier" map-options emit-value :options="suppliersOptions" />

      <toggle-grid label="Categorías" :options="categoriesOptions" v-model="categories" />

      <q-btn color="primary" @click="submit">Editar</q-btn>
    </div>
  </q-page>
</template>
