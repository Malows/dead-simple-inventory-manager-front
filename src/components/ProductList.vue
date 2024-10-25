<script setup lang="ts">
import { Product } from '../types'

import ProductItem from './listItems/ProductItem.vue'

defineProps<{ products: Product[] }>()
</script>

<template>
<q-list>
  <product-item
    v-for="product in products"
    :key="product.id"
    :product
  />
</q-list>
</template>
