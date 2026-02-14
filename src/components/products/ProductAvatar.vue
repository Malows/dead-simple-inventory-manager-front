<script setup lang="ts">
import { ProductEntity } from '../../types/product.interfaces'

withDefaults(
  defineProps<{
    product: ProductEntity
    size?: string
  }>(),
  { size: '64px' }
)
</script>

<template>
  <q-avatar v-if="product.image_url" :size="size">
    <q-img
      :src="product.image_url"
      fit="cover"
      loading="lazy"
    />
  </q-avatar>
</template>
