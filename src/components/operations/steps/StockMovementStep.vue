<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { StockMovementType } from '../../../types/operations.interfaces'

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
    <q-card
      v-for="option in movementOptions"
      :key="option.value"
      class="col-12 col-sm-5 cursor-pointer movement-card"
      :class="{ 'selected-card': movementType === option.value }"
      flat
      bordered
      @click="movementType = option.value"
    >
      <q-card-section horizontal>
        <q-card-section class="flex items-center q-pa-md">
          <q-icon
            :name="option.icon"
            :color="option.color"
            size="40px"
          />
        </q-card-section>
        <q-card-section class="col">
          <div class="text-subtitle1 text-weight-bold">
            {{ option.label }}
          </div>
          <div class="text-body2 text-grey-7 q-mt-xs">
            {{ option.description }}
          </div>
          <q-badge
            :color="option.color"
            :label="option.action"
            class="q-mt-sm"
            outline
          />
        </q-card-section>
        <q-card-section v-if="movementType === option.value" class="flex items-center">
          <q-icon name="check_circle" color="primary" size="24px" />
        </q-card-section>
      </q-card-section>
    </q-card>
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

<style scoped lang="scss">
.movement-card {
  transition: all 0.2s ease;
  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

.selected-card {
  border-color: var(--q-primary);
  background: rgba(var(--q-primary-rgb), 0.04);
}
</style>
