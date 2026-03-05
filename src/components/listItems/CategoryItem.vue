<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { Category } from '../../types/category.interfaces'

const { category } = defineProps<{ category: Category }>()
const { t } = useI18n()

const amount = computed(() => category.products?.length ?? 0)

const to = computed(() => ({ name: 'categories show', params: { categoryId: category.uuid } }))
</script>

<template>
  <q-item
    clickable
    :to
  >
    <q-item-section>
      <q-item-label>{{ category.name }}</q-item-label>
      <q-item-label caption>
        {{ t("products.count", amount) }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
