<script setup lang="ts">
import { computed } from 'vue'

import type { Product } from '../../../types/product.interfaces'
import { toPlainString } from '../../../utils/date'
import { parsePrice } from '../../../utils/text'

const { product } = defineProps<{ product: Product }>()
const price = computed(() => product.price ? parsePrice(product.price) : 'no asignado')
</script>

<template>
  <q-item-section avatar>
    <q-item-label>{{ price }}</q-item-label>
    <q-item-label v-if="product.last_price_update" caption>
      {{ toPlainString(product.last_price_update) }}
    </q-item-label>
  </q-item-section>
</template>
