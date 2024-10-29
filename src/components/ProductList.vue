<script setup lang="ts">
import { ProductEntity } from '../types/product.interfaces'

import ProductItem from './listItems/ProductItem.vue'

defineProps<{ products: ProductEntity[] }>()
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
