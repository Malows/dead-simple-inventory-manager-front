<script setup lang="ts">
import { computed } from 'vue'

import type { Product } from '../../../types/product.interfaces'
import { toPlainString } from '../../../utils/date'

const { product } = defineProps<{ product: Product }>()

const stock = computed(() => `${product.stock} - ${toPlainString(product.last_stock_update ?? '')}`)
</script>

<template>
  <q-item-section>
    <q-item-label>{{ product.name }}</q-item-label>
    <q-item-label caption>
      stock: {{ stock }}
    </q-item-label>
  </q-item-section>
</template>
