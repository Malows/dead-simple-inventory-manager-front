<script setup lang="ts">
import { computed } from 'vue'

import type { Product } from '../../../types/product.interfaces'

const { product, padding = 0 } = defineProps<{ product: Product; padding?: number }>()

const code = computed(() => {
  const value = product.code || 'no asignado'
  return `cod: ${value.padStart(padding, ' ')}`
})
</script>

<template>
  <q-item-section avatar>
    <q-item-label>{{ code }}</q-item-label>
  </q-item-section>
</template>
