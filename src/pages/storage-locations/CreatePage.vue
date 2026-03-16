<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useStorageLocationsStore } from '../../stores/storageLocations'
import { useNotify } from '../../composition/useNotify'

import StorageLocationForm from '../../components/forms/StorageLocationForm.vue'

const storageLocationsStore = useStorageLocationsStore()
const { t } = useI18n()
const { errorNotify, goodNotify } = useNotify()

const name = ref('')
const description = ref('')

const createStorageLocation = () => {
  storageLocationsStore
    .createStorageLocation({
      name: name.value,
      description: description.value
    })
    .then(goodNotify('storage_locations.created', { name: 'storage locations index' }))
    .catch(errorNotify('storage_locations.error_creating'))
}
</script>

<template>
  <q-page padding>
    <h4>{{ t("storage_locations.create") }}</h4>

    <div class="q-gutter-md">
      <storage-location-form
        v-model:name="name"
        v-model:description="description"
      />

      <q-btn
        color="primary"
        :label="t('common.create')"
        :loading="storageLocationsStore.storageLocationsRequest.fetching"
        @click="createStorageLocation"
      />
    </div>
  </q-page>
</template>
