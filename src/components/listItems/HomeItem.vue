<script setup lang="ts">
import { computed } from 'vue'

import type { Product } from '../../types/product.interfaces'

import ImagePart from './products/ImagePart.vue'
import PricePart from './products/PricePart.vue'
import NamePart from './products/NamePart.vue'
import CodePart from './products/CodePart.vue'

const props = defineProps<{ product: Product; codePadding?: number; }>()

const selected = defineModel<Product | null>('selected', { default: null })

const iconColor = computed(() => {
  const { stock, min_stock_warning: stockWarning } = props.product

  if (stock > stockWarning) return 'positive'
  if (stock > 0) return 'warning'
  return 'negative'
})

const isSelected = computed(() => props.product.id === selected.value?.id)
const clickOnItem = () => {
  selected.value = isSelected.value ? null : props.product
}
</script>

<template>
  <q-item
    class="rounded"
    :class="{ 'bg-primary': isSelected }"
    clickable
    @click="clickOnItem"
  >
    <q-item-section avatar>
      <q-icon
        name="stop_circle"
        size="sm"
        :color="iconColor"
      />
    </q-item-section>

    <image-part :product size="64px"/>
    <name-part :product />
    <price-part :product />

    <q-separator class="q-mx-md" vertical/>

    <code-part :product :padding="codePadding" />
  </q-item>
</template>

<style scoped>
.rounded {
  border-radius: .75rem;
}
</style>
