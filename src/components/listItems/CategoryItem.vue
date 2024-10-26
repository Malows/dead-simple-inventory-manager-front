<script setup lang="ts">
import { computed } from 'vue'

import { Category } from '../../types/category.interfaces'

const props = defineProps<{ category: Category }>()

const amount = computed(() => (props.category.products?.length ?? 0))

const to = computed(() => ({ name: 'categories show', params: { categoryId: props.category.uuid } }))
const legend = computed(() => `${amount.value} producto${amount.value !== 1 ? 's' : ''}`)
</script>

<template>
  <q-item clickable :to>
      <q-item-section>
          <q-item-label>{{ category.name }}</q-item-label>
          <q-item-label caption>{{ legend }}</q-item-label>
      </q-item-section>
  </q-item>
</template>
