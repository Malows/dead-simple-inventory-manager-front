<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Product } from '../../../types/product.interfaces'
import { toPlainString } from '../../../utils/date'

const { product } = defineProps<{ product: Product }>()
const { t } = useI18n()

const stock = computed(
  () => `${product.stock} - ${toPlainString(product.last_stock_update ?? '')}`
)
</script>

<template>
  <q-item-section>
    <q-item-label>{{ product.name }}</q-item-label>
    <q-item-label caption> {{ t('products.stock') }}: {{ stock }} </q-item-label>
  </q-item-section>
</template>
