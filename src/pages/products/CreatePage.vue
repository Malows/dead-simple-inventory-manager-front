<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import { useCategoriesStore } from '../../stores/categories'
import { useProductsStore } from '../../stores/products'
import { useSuppliersStore } from '../../stores/suppliers'
import { SelectOption, WithId } from '../../types/index'

import ToggleGrid from 'src/components/ToggleGrid.vue'

const router = useRouter()
const quasar = useQuasar()
const categoriesStore = useCategoriesStore()
const productsStore = useProductsStore()
const suppliersStore = useSuppliersStore()

const name = ref('')
const code = ref('')
const price = ref(0.0)
const description = ref(null)
const stock = ref(0)
const stockWarning = ref(0)
const supplier = ref(null)
const categories = ref<number[]>([])

onMounted(async () => {
  quasar.loading.show()
  await Promise.all([
    categoriesStore.getCategories(),
    suppliersStore.getSuppliers()
  ]).finally(() => quasar.loading.hide())
})

const categoriesOptions = computed(() => categoriesStore.categories.map((category) => ({ label: category.name, value: category.id, id: category.id }) as WithId<SelectOption<number>>))
const suppliersOptions = computed(() => suppliersStore.suppliers.map((supplier) => ({ label: supplier.name, value: supplier.id }) as SelectOption<number>))

const submit = () => {
  quasar.loading.show()

  productsStore.createProduct({
    name: name.value,
    code: code.value,
    price: Number(price.value.toString().replace(',', '.')),
    description: description.value,
    stock: stock.value,
    min_stock_warning: stockWarning.value,
    supplier_id: supplier.value,
    categories: categories.value
  })
    .then(() => {
      quasar.notify('Producto creado')
      return router.push({ name: 'products index' })
    })
    .catch(console.error)
    .finally(() => quasar.loading.hide())
}
</script>

<template>
  <q-page padding>
    <h4>Crear producto</h4>

    <div class="q-gutter-md">
      <q-input label="Nombre" v-model="name" />

      <div class="input-row--md">
        <q-input label="Codigo" v-model="code" />
        <q-input label="Precio" v-model="price">
          <template #prepend>
            <q-icon name="attach_money" />
          </template>
        </q-input>
      </div>

      <q-input label="Descripcion" v-model="description" />

      <div class="input-row--md">
        <q-input label="Stock" type="number" v-model.number="stock" />
        <q-input label="Advertencia de stock bajo" type="number" v-model.number="stockWarning" />
      </div>

      <q-select label="Proveedor" v-model="supplier" map-options emit-value :options="suppliersOptions" />

      <toggle-grid label="Categorías" :options="categoriesOptions" v-model="categories" />

      <q-btn color="primary" @click="submit">Crear</q-btn>
    </div>
  </q-page>
</template>
