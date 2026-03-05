<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { Brand } from '../../types/brand.interfaces'

const { brand } = defineProps<{ brand: Brand }>()
const { t } = useI18n()

const amount = computed(() => brand.products?.length ?? 0)

const to = computed(() => ({ name: 'brands show', params: { brandId: brand.uuid } }))
</script>

<template>
  <q-item
    clickable
    :to
  >
    <q-item-section>
      <q-item-label>{{ brand.name }}</q-item-label>
      <q-item-label caption>
        {{ t("products.count", amount) }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
