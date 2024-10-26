<script setup lang="ts">
import { computed } from 'vue'

import { Product } from '../../types/product.interfaces'
import { parsePrice } from '../../utils/text'

const props = withDefaults(
  defineProps<{ product: Product; codePadding?: number; }>(),
  { codePadding: 0 }
)

const iconData = computed(() => {
  const { stock, min_stock_warning: stockWarning } = props.product

  if (stock > stockWarning) return { name: 'check', color: 'positive' }

  if (stock > 0) return { name: 'warning', color: 'warning' }

  return { name: 'error', color: 'negative' }
})

const price = computed(() => props.product.price ? parsePrice(props.product.price) : 'no asignado')
const code = computed(() => {
  const value = props.product.code || 'no asignado'
  return `cod: ${value.padStart(props.codePadding, ' ')}`
})

const to = computed(() => ({ name: 'products show', params: { productId: props.product.uuid } }))
</script>

<template>
  <q-item clickable :to>
    <q-item-section avatar>
      <q-icon
        :name="iconData.name"
        :color="iconData.color"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ product.name }}</q-item-label>
      <q-item-label caption>stock: {{ product.stock }}</q-item-label>
    </q-item-section>

    <q-item-section avatar>
      <q-item-label>{{ price }}</q-item-label>
    </q-item-section>

    <q-separator class="q-mx-md" vertical />

    <q-item-section avatar>
      <q-item-label>{{ code }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
