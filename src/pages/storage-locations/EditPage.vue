<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useStorageLocationsStore } from '../../stores/storageLocations'
import { StorageLocation } from '../../types/storage-location.interfaces'
import { useNotify } from '../../composition/useNotify'

import StorageLocationForm from '../../components/forms/StorageLocationForm.vue'

const route = useRoute()
const storageLocationsStore = useStorageLocationsStore()
const { t } = useI18n()
const { errorNotify, goodNotify } = useNotify()

const name = ref('')
const description = ref('')

const uuid = computed(() =>
  Array.isArray(route.params.storageLocationId)
    ? route.params.storageLocationId[0]
    : route.params.storageLocationId
)

const storageLocation = computed(() =>
  storageLocationsStore.storageLocations.find((location: StorageLocation) => location.uuid === uuid.value)
)

onMounted(async () => {
  await storageLocationsStore
    .getStorageLocation(uuid.value)
    .catch(errorNotify('storage_locations.error_getting', { name: 'storage locations index' }))

  if (storageLocation.value) {
    name.value = storageLocation.value.name
    description.value = storageLocation.value.description ?? ''
  }
})

const submit = () => {
  const backRoute = { name: 'storage locations show', params: route.params }

  storageLocationsStore
    .updateStorageLocation({
      ...storageLocation.value!,
      name: name.value,
      description: description.value
    })
    .then(goodNotify('storage_locations.updated', backRoute))
    .catch(errorNotify('storage_locations.error_updating', backRoute))
}
</script>

<template>
  <q-page padding>
    <h4>{{ t("storage_locations.update") }}</h4>

    <div class="q-gutter-md">
      <storage-location-form
        v-model:name="name"
        v-model:description="description"
      />

      <q-btn
        color="primary"
        :label="t('common.update')"
        :loading="storageLocationsStore.storageLocationsRequest.fetching"
        @click="submit"
      />
    </div>
  </q-page>
</template>
