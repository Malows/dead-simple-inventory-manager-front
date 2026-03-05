<script setup lang="ts">
import { computed } from 'vue'

import type { Product } from '../../types/product.interfaces'

import ImagePart from './products/ImagePart.vue'
import NamePart from './products/NamePart.vue'
import PricePart from './products/PricePart.vue'
import CodePart from './products/CodePart.vue'

const props = defineProps<{ product: Product; codePadding?: number }>()

const iconData = computed(() => {
  const { stock, min_stock_warning: stockWarning } = props.product

  if (stock > stockWarning) return { name: 'check', color: 'positive' }

  if (stock > 0) return { name: 'warning', color: 'warning' }

  return { name: 'error', color: 'negative' }
})

const to = computed(() => ({ name: 'products show', params: { productId: props.product.uuid } }))
</script>

<template>
  <q-item
    clickable
    :to
  >
    <q-item-section avatar>
      <q-icon
        :name="iconData.name"
        :color="iconData.color"
      />
    </q-item-section>

    <image-part :product />
    <name-part :product />
    <price-part :product />

    <q-separator
      class="q-mx-md"
      vertical
    />

    <code-part
      :product
      :padding="props.codePadding"
    />
  </q-item>
</template>
