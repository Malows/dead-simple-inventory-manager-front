<script setup lang="ts">
import { computed } from 'vue'

import { Product } from '../../types/product.interfaces'
import { parsePrice } from '../../utils/text'
import ProductAvatar from '../products/ProductAvatar.vue'

const props = withDefaults(
  defineProps<{ product: Product; codePadding?: number; }>(),
  { codePadding: 0 }
)

const selected = defineModel<Product | null>({ default: null })

const iconColor = computed(() => {
  const { stock, min_stock_warning: stockWarning } = props.product

  if (stock > stockWarning) return 'positive'
  if (stock > 0) return 'warning'
  return 'negative'
})

const price = computed(() => props.product.price ? parsePrice(props.product.price) : 'no asignado')
const code = computed(() => {
  const value = props.product.code || 'no asignado'
  return `cod: ${value.padStart(props.codePadding, ' ')}`
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
        size="xs"
        :color="iconColor"
      />
    </q-item-section>

    <q-item-section avatar>
      <product-avatar :product="product"/>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ product.name }}</q-item-label>
      <q-item-label caption>stock: {{ product.stock }}</q-item-label>
    </q-item-section>

    <q-item-section avatar>
      <q-item-label>{{ price }}</q-item-label>
    </q-item-section>

    <q-separator class="q-mx-md" vertical/>

    <q-item-section avatar>
      <q-item-label>{{ code }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<style scoped>
.rounded {
  border-radius: .75rem;
}
</style>
