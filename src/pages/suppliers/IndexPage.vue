<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useSuppliersStore } from '../../stores/suppliers'
import { useNotify } from '../../composition/useNotify'

import PageWithAdd from '../../components/pages/PageWithAdd.vue'
import FilterableList from '../../components/filterable/FilterableList.vue'
import SupplierItem from '../../components/listItems/SupplierItem.vue'

const suppliersStore = useSuppliersStore()
const quasar = useQuasar()
const { t } = useI18n()
const { errorNotify } = useNotify()

onMounted(() => {
  quasar.loading.show()
  suppliersStore
    .getSuppliers()
    .catch(errorNotify('suppliers.error_fetching'))
    .finally(() => quasar.loading.hide())
})
</script>

<template>
  <page-with-add :title="t('suppliers.Suppliers')" :to="{ name: 'suppliers create' }">
    <filterable-list :items="suppliersStore.suppliers" :items-per-page="50">
      <template #default="{ item }">
        <supplier-item :supplier="item" />
      </template>
    </filterable-list>
  </page-with-add>
</template>
