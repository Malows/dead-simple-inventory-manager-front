<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useOperationsStore } from '../../../stores/operations'
import type { MovementOption } from './StockMovementStep.vue'

defineProps<{
  movement: MovementOption | undefined
  canConfirm: boolean
}>()

defineEmits<{
  back: []
  confirm: []
}>()

const { t } = useI18n()
const operationsStore = useOperationsStore()
</script>

<template>
  <div
    v-if="movement"
    class="q-mb-md"
  >
    <div class="text-subtitle2 text-grey-7">
      {{ t('operations.review_movement_type') }}
    </div>
    <div class="row items-center q-gutter-sm q-mt-xs">
      <q-icon
        :name="movement.icon"
        :color="movement.color"
        size="24px"
      />
      <span class="text-subtitle1 text-weight-bold">{{ movement.label }}</span>
      <q-badge
        :color="movement.color"
        :label="movement.action"
        outline
      />
    </div>
  </div>

  <q-separator class="q-my-md" />

  <div class="text-subtitle2 text-grey-7 q-mb-sm">
    {{ t('operations.review_products') }}
    ({{ t('operations.review_total_products', { count: operationsStore.selectedProducts.length }, operationsStore.selectedProducts.length) }})
  </div>

  <q-list
    v-if="operationsStore.selectedProducts.length > 0"
    bordered
    separator
    class="rounded-borders"
  >
    <q-item
      v-for="product in operationsStore.selectedProducts"
      :key="product.uuid"
    >
      <q-item-section avatar>
        <q-icon
          name="inventory_2"
          color="grey-7"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ product.name }}</q-item-label>
        <q-item-label caption>
          {{ product.code }} — {{ t('products.stock') }}: {{ product.stock }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-chip
          color="primary"
          text-color="white"
          :label="`${t('operations.quantity')}: ${operationsStore.quantities[product.uuid] ?? 0}`"
        />
      </q-item-section>
    </q-item>
  </q-list>

  <div
    v-else
    class="text-grey text-center q-pa-lg"
  >
    {{ t('operations.review_empty') }}
  </div>

  <q-stepper-navigation>
    <q-btn
      color="primary"
      icon="check"
      :label="t('operations.review_confirm')"
      :disable="!canConfirm"
      @click="$emit('confirm')"
    />
    <q-btn
      flat
      color="primary"
      :label="t('operations.back')"
      class="q-ml-sm"
      @click="$emit('back')"
    />
  </q-stepper-navigation>
</template>
