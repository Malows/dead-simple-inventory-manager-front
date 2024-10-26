<script lang="ts">
import { computed } from 'vue'

import { Supplier } from '../../types/supplier.interfaces'

const props = defineProps<{ supplier: Supplier}>()

const amount = computed(() => (props.supplier.products?.length ?? 0))
const to = computed(() => ({ name: 'suppliers show', params: { supplierId: props.supplier.uuid } }))
const legend = computed(() => `${amount.value} producto${amount.value !== 1 ? 's' : ''}`)
</script>

<template>
  <q-item clickable :to="to">
      <q-item-section>
          <q-item-label>{{ supplier.name }}</q-item-label>
          <q-item-label caption>{{ legend }}</q-item-label>
      </q-item-section>
  </q-item>
</template>
