<script lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import { useSuppliersStore } from '../../stores/suppliers'
import { Supplier } from '../../types/supplier.interfaces'

import PageWithActions from '../../components/pages/PageWithActions.vue'
import InlineData from '../../components/InlineData.vue'
import ProductList from '../../components/ProductList.vue'
import SupplierDeleteDialog from '../../components/dialogs/SupplierDeleteDialog.vue'

const route = useRoute()
const router = useRouter()
const quasar = useQuasar()
const suppliersStore = useSuppliersStore()

const uuid = computed(() => Array.isArray(route.params.supplierId) ? route.params.supplierId[0] : route.params.supplierId)

const supplier = computed(() => suppliersStore.suppliers.find((supplier: Supplier) => supplier.uuid === uuid.value))

onMounted(() => {
  quasar.loading.show()
  suppliersStore
    .getSupplier(uuid.value)
    .catch(() => {
      quasar.notify({
        type: 'negative',
        message: 'No se pudieron cargar los proveedores'
      })

      router.push({ name: 'suppliers index' })
    })
    .finally(() => {
      quasar.loading.hide()
    })
})

const showDeleteDialog = ref(false)
const editRoute = computed(() => ({ name: 'suppliers edit', params: route.params }))
</script>

<template>
  <page-with-actions v-if="supplier" title="Ver proveedor">
    <template #actions>
      <q-btn round color="primary" size="md" icon="edit" :to="editRoute" />
      <q-btn round color="negative" size="md" icon="delete" @click="showDeleteDialog = true" />
    </template>

    <inline-data label="Nombre">{{ supplier.name }}</inline-data>
    <inline-data label="Telefono">{{ supplier.phone }}</inline-data>
    <inline-data label="Direccion">{{ supplier.address }}</inline-data>
    <inline-data label="Email">{{ supplier.email }}</inline-data>
    <inline-data label="Web">{{ supplier.web }}</inline-data>

    <q-separator class="q-mt-lg" />

    <h5>Productos</h5>
    <product-list :products="supplier.products" />

    <supplier-delete-dialog v-model="showDeleteDialog" />
  </page-with-actions>
</template>
