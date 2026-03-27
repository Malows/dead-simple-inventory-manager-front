<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { StorageLocation } from '../../types/storage-location.interfaces'

const { storageLocation } = defineProps<{ storageLocation: StorageLocation }>()
const { t } = useI18n()

const amount = computed(() => storageLocation.products?.length ?? 0)
const to = computed(() => ({
  name: 'storage locations show',
  params: { storageLocationId: storageLocation.uuid }
}))
</script>

<template>
  <q-item
    clickable
    :to="to"
  >
    <q-item-section>
      <q-item-label>{{ storageLocation.name }}</q-item-label>
      <q-item-label caption>
        {{ storageLocation.description }}
      </q-item-label>
      <q-item-label caption>
        {{ t('products.count', amount) }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
