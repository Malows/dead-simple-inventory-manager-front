<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Product } from '../../types/product.interfaces'
import type { StockMovementType } from '../../types/operations.interfaces'

import FilterPagination from '../filterable/FilterPagination.vue'
import { getQuantityMax } from 'src/utils/operations'

const { t } = useI18n()

const props = defineProps<{
  title: string
  totalCount: number
  items: Product[]
  checkedItems: Set<string>
  checkedCount: number
  allChecked: boolean
  indeterminate: boolean
  page: number
  totalPages: number
  emptyMessage?: string
  showStock?: boolean
  showQuantities?: boolean
  quantities?: Record<string, number>
  movementType?: StockMovementType | null
}>()

defineEmits<{
  toggleCheck: [uuid: string]
  selectAll: []
  'update:page': [page: number]
  'update:quantity': [uuid: string, value: number]
}>()

const quantityLabel = computed(() => {
  const labels: Record<StockMovementType, string> = {
    adjustment: t('operations.adjusted_quantity'),
    sale: t('operations.sold_quantity'),
    purchase: t('operations.purchased_quantity'),
    return: t('operations.returned_quantity')
  }
  return labels[props.movementType as StockMovementType] || t('operations.quantity')
})

function quantityRules (product: Product) {
  const min = (value: string | number | null) => {
    const parsed = Number(value)
    const isValid = !Number.isNaN(parsed) && parsed >= 0
    return isValid || t('operations.quantity_min', { min: 0 })
  }

  const max = (product: Product) => (value: string | number | null) => {
    const parsed = Number(value)
    const maxValue = getQuantityMax(props.movementType!, product.stock)
    const isValid = Number.isNaN(parsed) || maxValue === undefined || parsed <= maxValue
    return isValid || t('operations.quantity_max_stock')
  }

  return [
    min,
    max(product)
  ]
}
</script>

<template>
  <q-card
    class="col"
    flat
    bordered
  >
    <q-card-section class="q-pa-none">
      <q-item
        dense
        clickable
        @click="$emit('selectAll')"
      >
        <q-item-section side>
          <q-checkbox
            :model-value="allChecked"
            :indeterminate-value="indeterminate ? true : undefined"
            @click.stop="$emit('selectAll')"
          />
        </q-item-section>
        <q-item-section avatar>
          <q-item-label caption>
            {{ checkedCount }} / {{ totalCount }}
          </q-item-label>
        </q-item-section>

        <q-item-section>
          <div class="text-subtitle1 text-weight-medium">
            {{ title }} ({{ totalCount }})
          </div>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-list>
        <q-item
          v-for="product in items"
          :key="product.uuid"
          dense
          clickable
          @click="$emit('toggleCheck', product.uuid)"
        >
          <q-item-section side>
            <q-checkbox
              :model-value="checkedItems.has(product.uuid)"
              @click.stop="$emit('toggleCheck', product.uuid)"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ product.name }}</q-item-label>
            <q-item-label caption>
              {{ product.code }}
              <template v-if="showStock">
                — {{ t('products.stock') }}: {{ product.stock }}
              </template>
            </q-item-label>
          </q-item-section>
          <q-item-section
            v-if="showQuantities && quantities"
            side
          >
            <q-input
              :model-value="quantities[product.uuid] ?? 0"
              type="number"
              dense
              style="width: 100px"
              :min="0"
              :max="getQuantityMax(movementType!, product.stock)"
              :label="quantityLabel"
              :rules="quantityRules(product)"
              @update:model-value="(v: string | number | null) => $emit('update:quantity', product.uuid, Number(v) || 0)"
              @click.stop
            />
          </q-item-section>
        </q-item>

        <q-item v-if="items.length === 0">
          <q-item-section class="text-grey text-center">
            {{ emptyMessage || t("operations.no_results") }}
          </q-item-section>
        </q-item>
      </q-list>

      <filter-pagination
        :model-value="page"
        :max="totalPages"
        @update:model-value="$emit('update:page', $event)"
      />
    </q-card-section>
  </q-card>
</template>
