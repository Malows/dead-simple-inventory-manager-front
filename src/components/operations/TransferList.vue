<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { byProductAdvanced } from '../../utils/filters'
import type { Product } from '../../types/product.interfaces'

import FilterPagination from '../filterable/FilterPagination.vue'

const { t } = useI18n()

const props = defineProps<{
  items: Product[]
  searchText: string
  filterBrand: number | null
  filterSupplier: number | null
  filterCategory: number | null
}>()

const model = defineModel<Product[]>({ default: () => [] })

// Selection state
const leftChecked = ref<Set<string>>(new Set())
const rightChecked = ref<Set<string>>(new Set())

// Pagination
const leftPage = ref(1)
const rightPage = ref(1)
const itemsPerPage = 10

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

// Paginated slices
const leftPages = computed(() => Math.ceil(availableProducts.value.length / itemsPerPage) || 1)
const rightPages = computed(() => Math.ceil(model.value.length / itemsPerPage) || 1)

const leftSlice = computed(() =>
  availableProducts.value.slice((leftPage.value - 1) * itemsPerPage, leftPage.value * itemsPerPage)
)
const rightSlice = computed(() =>
  model.value.slice((rightPage.value - 1) * itemsPerPage, rightPage.value * itemsPerPage)
)

// Button state
const canMoveRight = computed(() => leftChecked.value.size > 0)
const canMoveLeft = computed(() => rightChecked.value.size > 0)
const buttonIcon = computed(() => (canMoveRight.value ? 'chevron_right' : 'chevron_left'))
const buttonDisabled = computed(() => !canMoveRight.value && !canMoveLeft.value)

// Ensure exclusivity: when checking on one side, uncheck the other
function toggleLeftCheck (uuid: string) {
  rightChecked.value.clear()
  if (leftChecked.value.has(uuid)) {
    leftChecked.value.delete(uuid)
  } else {
    leftChecked.value.add(uuid)
  }
}

function toggleRightCheck (uuid: string) {
  leftChecked.value.clear()
  if (rightChecked.value.has(uuid)) {
    rightChecked.value.delete(uuid)
  } else {
    rightChecked.value.add(uuid)
  }
}

function selectAllLeft () {
  rightChecked.value.clear()
  if (leftChecked.value.size === availableProducts.value.length) {
    leftChecked.value.clear()
  } else {
    leftChecked.value = new Set(availableProducts.value.map((p) => p.uuid))
  }
}

function selectAllRight () {
  leftChecked.value.clear()
  if (rightChecked.value.size === model.value.length) {
    rightChecked.value.clear()
  } else {
    rightChecked.value = new Set(model.value.map((p) => p.uuid))
  }
}

function transfer () {
  if (canMoveRight.value) {
    // Move from left to right
    const toMove = props.items.filter((p) => leftChecked.value.has(p.uuid))
    model.value = [...model.value, ...toMove]
    leftChecked.value.clear()
  } else if (canMoveLeft.value) {
    // Move from right to left
    model.value = model.value.filter((p) => !rightChecked.value.has(p.uuid))
    rightChecked.value.clear()
  }
}

// Reset pagination on filter change
watch([() => props.searchText, () => props.filterBrand, () => props.filterSupplier, () => props.filterCategory], () => {
  leftPage.value = 1
  leftChecked.value.clear()
})
</script>

<template>
  <div class="transfer-list row q-gutter-md">
    <!-- Left panel: Available products -->
    <q-card class="col" flat bordered>
      <q-card-section class="q-pb-none">
        <div class="text-subtitle1 text-weight-medium">
          {{ t("operations.available") }} ({{ availableProducts.length }})
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-none">
        <q-item dense clickable @click="selectAllLeft">
          <q-item-section side>
            <q-checkbox
              :model-value="leftChecked.size > 0 && leftChecked.size === availableProducts.length"
              :indeterminate-value="
                leftChecked.size > 0 && leftChecked.size < availableProducts.length
                  ? true
                  : undefined
              "
              @click.stop="selectAllLeft"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label caption>
              {{ leftChecked.size }} / {{ availableProducts.length }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-list>
          <q-item
            v-for="product in leftSlice"
            :key="product.uuid"
            dense
            clickable
            @click="toggleLeftCheck(product.uuid)"
          >
            <q-item-section side>
              <q-checkbox
                :model-value="leftChecked.has(product.uuid)"
                @click.stop="toggleLeftCheck(product.uuid)"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ product.name }}</q-item-label>
              <q-item-label caption>{{ product.code }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="availableProducts.length === 0">
            <q-item-section class="text-grey text-center">
              {{ t("operations.no_results") }}
            </q-item-section>
          </q-item>
        </q-list>

        <filter-pagination v-model="leftPage" :max="leftPages" />
      </q-card-section>
    </q-card>

    <!-- Center transfer button -->
    <div class="column justify-center items-center">
      <q-btn round color="primary" :icon="buttonIcon" :disable="buttonDisabled" @click="transfer" />
    </div>

    <!-- Right panel: Selected products -->
    <q-card class="col" flat bordered>
      <q-card-section class="q-pb-none">
        <div class="text-subtitle1 text-weight-medium">
          {{ t("operations.selected") }} ({{ model.length }})
        </div>
      </q-card-section>

      <q-separator class="q-mt-md" />

      <q-card-section class="q-pa-none">
        <q-item dense clickable @click="selectAllRight">
          <q-item-section side>
            <q-checkbox
              :model-value="rightChecked.size > 0 && rightChecked.size === model.length"
              :indeterminate-value="
                rightChecked.size > 0 && rightChecked.size < model.length ? true : undefined
              "
              @click.stop="selectAllRight"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label caption> {{ rightChecked.size }} / {{ model.length }} </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-list>
          <q-item
            v-for="product in rightSlice"
            :key="product.uuid"
            dense
            clickable
            @click="toggleRightCheck(product.uuid)"
          >
            <q-item-section side>
              <q-checkbox
                :model-value="rightChecked.has(product.uuid)"
                @click.stop="toggleRightCheck(product.uuid)"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ product.name }}</q-item-label>
              <q-item-label caption>{{ product.code }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="model.length === 0">
            <q-item-section class="text-grey text-center">
              {{ t("operations.no_results") }}
            </q-item-section>
          </q-item>
        </q-list>

        <filter-pagination v-model="rightPage" :max="rightPages" />
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
.transfer-list {
  min-height: 400px;
}
</style>
