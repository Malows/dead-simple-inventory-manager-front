<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { Supplier } from '../../types/supplier.interfaces'

const props = defineProps<{ supplier: Supplier}>()
const { t } = useI18n()

const amount = computed(() => (props.supplier.products?.length ?? 0))
const to = computed(() => ({ name: 'suppliers show', params: { supplierId: props.supplier.uuid } }))
</script>

<template>
  <q-item clickable :to="to">
    <q-item-section>
      <q-item-label>{{ supplier.name }}</q-item-label>
      <q-item-label caption>
        {{ t('products.count', amount) }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
