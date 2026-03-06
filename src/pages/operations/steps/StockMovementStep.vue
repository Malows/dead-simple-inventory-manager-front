<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { StockMovementType } from '../../../types/operations.interfaces'

import SelectableCard from '../../../components/SelectableCard.vue'

export interface MovementOption {
  value: StockMovementType
  label: string
  description: string
  action: string
  icon: string
  color: string
}

defineEmits<{ next: [] }>()

const movementType = defineModel<StockMovementType | null>({ default: null })

const { t } = useI18n()

const movementOptions = computed<MovementOption[]>(() => [
  {
    value: 'purchase',
    label: t('operations.purchase'),
    description: t('operations.purchase_desc'),
    action: t('operations.purchase_action'),
    icon: 'add_shopping_cart',
    color: 'positive'
  },
  {
    value: 'sale',
    label: t('operations.sale'),
    description: t('operations.sale_desc'),
    action: t('operations.sale_action'),
    icon: 'point_of_sale',
    color: 'negative'
  },
  {
    value: 'adjustment',
    label: t('operations.adjustment'),
    description: t('operations.adjustment_desc'),
    action: t('operations.adjustment_action'),
    icon: 'tune',
    color: 'warning'
  },
  {
    value: 'return',
    label: t('operations.return'),
    description: t('operations.return_desc'),
    action: t('operations.return_action'),
    icon: 'assignment_return',
    color: 'info'
  }
])

const canContinue = computed(() => !!movementType.value)

defineExpose({ movementOptions })
</script>

<template>
  <div class="row q-gutter-md">
    <selectable-card
      v-for="option in movementOptions"
      :key="option.value"
      v-model="movementType"
      :title="option.label"
      :description="option.description"
      :icon="option.icon"
      :color="option.color"
      :action="option.action"
      :value="option.value"
    />
  </div>

  <q-stepper-navigation>
    <q-btn
      color="primary"
      :label="t('operations.next')"
      :disable="!canContinue"
      @click="$emit('next')"
    />
  </q-stepper-navigation>
</template>
