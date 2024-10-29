<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'

import { useSuppliersStore } from '../../stores/suppliers'

import PageWithAdd from '../../components/pages/PageWithAdd.vue'
import FilterableList from '../../components/filterable/FilterableList.vue'
import SupplierItem from '../../components/listItems/SupplierItem.vue'

const suppliersStore = useSuppliersStore()
const quasar = useQuasar()

onMounted(() => {
  quasar.loading.show()
  suppliersStore
    .getSuppliers()
    .catch(() => {
      quasar.notify({
        type: 'negative',
        message: 'No se pudieron cargar los proveedores'
      })
    })
    .finally(() => {
      quasar.loading.hide()
    })
})
</script>

<template>
  <page-with-add title="Proveedores" :to="{ name: 'suppliers create' }">
    <filterable-list :items="suppliers" :items-per-page="50">
      <template #default="{ item }">
        <supplier-item :supplier="item" />
      </template>
    </filterable-list>
  </page-with-add>
</template>
