<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { byProductAdvanced } from '../../utils/filters'
import type { Product } from '../../types/product.interfaces'
import { useOperationsStore } from '../../stores/operations'

import { useTransferSelection } from '../../composition/components/useTransferSelection'
import { useTransferPagination } from '../../composition/components/useTransferPagination'

import TransferPanel from './TransferPanel.vue'

const { t } = useI18n()

const props = defineProps<{
  items: Product[]
  searchText: string
  filterBrand: number | null
  filterSupplier: number | null
  filterCategory: number | null
  showQuantities?: boolean
}>()

const operationsStore = useOperationsStore()
const model = computed({
  get: () => operationsStore.selectedProducts,
  set: (products: Product[]) => operationsStore.setSelectedProducts(products)
})
const quantities = computed(() => operationsStore.quantities)

// Set of selected UUIDs for fast lookup
const selectedUuids = computed(() => new Set(model.value.map((p) => p.uuid)))

// Left list: items NOT in selected, filtered
const availableProducts = computed(() => {
  const filter = byProductAdvanced(
    props.searchText,
    props.filterBrand,
    props.filterSupplier,
    props.filterCategory
  )
  return props.items.filter((p) => !selectedUuids.value.has(p.uuid) && filter(p))
})

// Selection
const {
  leftChecked, rightChecked,
  toggleLeftCheck, toggleRightCheck,
  selectAllLeft, selectAllRight,
  canMoveRight, buttonIcon, buttonDisabled,
  clearLeftChecked, clearRightChecked
} = useTransferSelection(
  () => availableProducts.value,
  () => model.value
)

// Pagination
const { leftPage, rightPage, leftPages, rightPages, leftSlice, rightSlice, watchFilters } =
  useTransferPagination(
    () => availableProducts.value,
    () => model.value
  )

// Left panel computed helpers
const leftAllChecked = computed(() => leftChecked.value.size > 0 && leftChecked.value.size === availableProducts.value.length)
const leftIndeterminate = computed(() => leftChecked.value.size > 0 && leftChecked.value.size < availableProducts.value.length)

// Right panel computed helpers
const rightAllChecked = computed(() => rightChecked.value.size > 0 && rightChecked.value.size === model.value.length)
const rightIndeterminate = computed(() => rightChecked.value.size > 0 && rightChecked.value.size < model.value.length)

function transfer () {
  if (canMoveRight.value) {
    const toMove = props.items.filter((p) => leftChecked.value.has(p.uuid))
    model.value = [...model.value, ...toMove]
    clearLeftChecked()
  } else {
    model.value = model.value.filter((p) => !rightChecked.value.has(p.uuid))
    clearRightChecked()
  }
}

function onUpdateQuantity (uuid: string, value: number) {
  operationsStore.setQuantity(uuid, value)
}

// Reset pagination on filter change
watchFilters([
  toRef(() => props.searchText),
  toRef(() => props.filterBrand),
  toRef(() => props.filterSupplier),
  toRef(() => props.filterCategory)
])
</script>

<template>
  <div class="transfer-list row q-gutter-md">
    <transfer-panel
      :title="t('operations.available')"
      :total-count="availableProducts.length"
      :items="(leftSlice as Product[])"
      :checked-items="leftChecked"
      :checked-count="leftChecked.size"
      :all-checked="leftAllChecked"
      :indeterminate="leftIndeterminate"
      :page="leftPage"
      :total-pages="leftPages"
      @toggle-check="toggleLeftCheck"
      @select-all="selectAllLeft"
      @update:page="leftPage = $event"
    />

    <!-- Center transfer button -->
    <div class="column justify-center items-center">
      <q-btn
        round
        color="primary"
        :icon="buttonIcon"
        :disable="buttonDisabled"
        @click="transfer"
      />
    </div>

    <transfer-panel
      :title="t('operations.selected')"
      :total-count="model.length"
      :items="(rightSlice as Product[])"
      :checked-items="rightChecked"
      :checked-count="rightChecked.size"
      :all-checked="rightAllChecked"
      :indeterminate="rightIndeterminate"
      :page="rightPage"
      :total-pages="rightPages"
      show-stock
      :show-quantities="showQuantities"
      :quantities="quantities"
      :movement-type="operationsStore.movementType"
      @toggle-check="toggleRightCheck"
      @select-all="selectAllRight"
      @update:page="rightPage = $event"
      @update:quantity="onUpdateQuantity"
    />
  </div>
</template>

<style scoped lang="scss">
.transfer-list {
  min-height: 400px;
}
</style>
