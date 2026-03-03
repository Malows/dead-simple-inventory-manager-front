<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useSuppliersStore } from '../../stores/suppliers'
import { Supplier } from '../../types/supplier.interfaces'
import { useNotify } from '../../composition/useNotify'

import PageWithActions from '../../components/pages/PageWithActions.vue'
import InlineData from '../../components/InlineData.vue'
import ProductList from '../../components/ProductList.vue'
import SupplierDeleteDialog from '../../components/dialogs/SupplierDeleteDialog.vue'

const suppliersStore = useSuppliersStore()
const route = useRoute()
const quasar = useQuasar()
const { t } = useI18n()
const { errorNotify } = useNotify()

const uuid = computed(() =>
  Array.isArray(route.params.supplierId) ? route.params.supplierId[0] : route.params.supplierId
)

const supplier = computed(() =>
  suppliersStore.suppliers.find((supplier: Supplier) => supplier.uuid === uuid.value)
)

onMounted(() => {
  quasar.loading.show()
  suppliersStore
    .getSupplier(uuid.value)
    .catch(errorNotify('suppliers.error_fetching', { name: 'suppliers index' }))
    .finally(() => quasar.loading.hide())
})

const showDeleteDialog = ref(false)
const editRoute = computed(() => ({
  name: 'suppliers edit',
  params: route.params
}))
</script>

<template>
  <page-with-actions v-if="supplier" :title="t('suppliers.show')">
    <template #actions>
      <q-btn round color="primary" size="md" icon="edit" :to="editRoute" />
      <q-btn round color="negative" size="md" icon="delete" @click="showDeleteDialog = true" />
    </template>

    <inline-data :label="t('common.name')">
      {{ supplier.name }}
    </inline-data>
    <inline-data :label="t('suppliers.Address')">
      {{ supplier.phone }}
    </inline-data>
    <inline-data :label="t('suppliers.Phone')">
      {{ supplier.address }}
    </inline-data>
    <inline-data :label="t('suppliers.Email')">
      {{ supplier.email }}
    </inline-data>
    <inline-data :label="t('suppliers.Web')">
      {{ supplier.web }}
    </inline-data>

    <q-separator class="q-mt-lg" />

    <h5>{{ t("products.Products") }}</h5>
    <product-list :products="supplier.products" />

    <supplier-delete-dialog v-model="showDeleteDialog" :supplier />
  </page-with-actions>
</template>
