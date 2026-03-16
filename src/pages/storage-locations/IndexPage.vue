<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useStorageLocationsStore } from '../../stores/storageLocations'
import { useNotify } from '../../composition/useNotify'

import PageWithAdd from '../../components/pages/PageWithAdd.vue'
import FilterableList from '../../components/filterable/FilterableList.vue'
import StorageLocationItem from '../../components/listItems/StorageLocationItem.vue'

const storageLocationsStore = useStorageLocationsStore()
const quasar = useQuasar()
const { t } = useI18n()
const { errorNotify } = useNotify()

onMounted(() => {
  quasar.loading.show()
  storageLocationsStore
    .getStorageLocations()
    .catch(errorNotify('storage_locations.error_fetching'))
    .finally(() => quasar.loading.hide())
})
</script>

<template>
  <page-with-add
    :title="t('storage_locations.StorageLocations')"
    :to="{ name: 'storage locations create' }"
  >
    <filterable-list
      :items="storageLocationsStore.storageLocations"
      :items-per-page="50"
    >
      <template #default="{ item }">
        <storage-location-item :storage-location="item" />
      </template>
    </filterable-list>
  </page-with-add>
</template>
