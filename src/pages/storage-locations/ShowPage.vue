<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useStorageLocationsStore } from '../../stores/storageLocations'
import { StorageLocation } from '../../types/storage-location.interfaces'
import { useNotify } from '../../composition/useNotify'

import PageWithActions from '../../components/pages/PageWithActions.vue'
import InlineData from '../../components/InlineData.vue'
import ProductList from '../../components/ProductList.vue'
import BaseDeleteDialog from '../../components/dialogs/BaseDeleteDialog.vue'

const storageLocationsStore = useStorageLocationsStore()
const route = useRoute()
const quasar = useQuasar()
const { t } = useI18n()
const { errorNotify } = useNotify()

const showDeleteDialog = ref(false)

const uuid = computed(() =>
  Array.isArray(route.params.storageLocationId)
    ? route.params.storageLocationId[0]
    : route.params.storageLocationId
)

const storageLocation = computed(() =>
  storageLocationsStore.storageLocations.find((location: StorageLocation) => location.uuid === uuid.value)
)

const editRoute = computed(() => ({
  name: 'storage locations edit',
  params: route.params
}))

onMounted(() => {
  quasar.loading.show()
  storageLocationsStore
    .getStorageLocation(uuid.value)
    .catch(errorNotify('storage_locations.error_getting', { name: 'storage locations index' }))
    .finally(() => quasar.loading.hide())
})
</script>

<template>
  <page-with-actions
    v-if="storageLocation"
    :title="t('storage_locations.show')"
  >
    <template #actions>
      <q-btn
        round
        color="primary"
        size="md"
        icon="edit"
        :to="editRoute"
      />
      <q-btn
        round
        color="negative"
        size="md"
        icon="delete"
        @click="showDeleteDialog = true"
      />
    </template>

    <inline-data :label="t('common.name')">
      {{ storageLocation.name }}
    </inline-data>
    <inline-data :label="t('storage_locations.Description')">
      {{ storageLocation.description }}
    </inline-data>

    <q-separator class="q-mt-lg" />

    <h5>{{ t("products.Products") }}</h5>
    <product-list :products="storageLocation.products" />

    <base-delete-dialog
      v-model="showDeleteDialog"
      :confirm-message="t('storage_locations.confirm_delete', { name: storageLocation?.name })"
      :delete-action="() => storageLocationsStore.deleteStorageLocation(storageLocation!)"
      success-route="storage locations index"
      success-message-key="storage_locations.deleted"
      error-message-key="storage_locations.error_deleting"
    />
  </page-with-actions>
</template>
