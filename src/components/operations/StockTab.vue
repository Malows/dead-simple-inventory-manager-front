<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

import { useProductsStore } from '../../stores/products'
import { useBrandsStore } from '../../stores/brands'
import { useCategoriesStore } from '../../stores/categories'
import { useSuppliersStore } from '../../stores/suppliers'
import { bulkOperationService } from '../../services/BulkOperationService'
import type { Product } from '../../types/product.interfaces'
import type { StockMovementType, StockChange } from '../../types/operations.interfaces'

import OperationsControls from './OperationsControls.vue'
import TransferList from './TransferList.vue'

const { t } = useI18n()
const quasar = useQuasar()

const productsStore = useProductsStore()
const brandsStore = useBrandsStore()
const categoriesStore = useCategoriesStore()
const suppliersStore = useSuppliersStore()

const selectedProducts = ref<Product[]>([])
const quantities = ref<Record<string, number>>({})

// Filters for left list
const movementType = ref<StockMovementType | null>(null)
const searchText = ref('')
const filterBrand = ref<number | null>(null)
const filterSupplier = ref<number | null>(null)
const filterCategory = ref<number | null>(null)

const canSubmit = computed(() => {
  if (!movementType.value) return false
  if (selectedProducts.value.length === 0) return false
  return selectedProducts.value.every((p) => (quantities.value[p.uuid] ?? 0) > 0)
})

async function submit () {
  if (!canSubmit.value || !movementType.value) return

  const changes: StockChange[] = selectedProducts.value.map((p) => ({
    id: p.id,
    value: quantities.value[p.uuid] ?? 0
  }))

  quasar.loading.show()

  try {
    const response = await bulkOperationService.adjustStock({
      type: movementType.value,
      changes
    })

    if (response.isOk) {
      quasar.notify({
        color: 'positive',
        message: t('operations.stock_updated')
      })
      selectedProducts.value = []
      quantities.value = {}
      movementType.value = null
      await productsStore.forceGetProducts()
    } else {
      quasar.notify({
        color: 'negative',
        message: t('operations.error_stock')
      })
    }
  } catch {
    quasar.notify({
      color: 'negative',
      message: t('operations.error_stock')
    })
  } finally {
    quasar.loading.hide()
  }
}
</script>

<template>
  <div>
    <operations-controls
      :brands-options="brandsStore.brandsOptions"
      :suppliers-options="suppliersStore.suppliersOptions"
      :categories-options="categoriesStore.categoriesOptions"
      v-model:type="movementType"
      v-model:search="searchText"
      v-model:brand="filterBrand"
      v-model:supplier="filterSupplier"
      v-model:category="filterCategory"
    />

    <transfer-list
      v-model="selectedProducts"
      :items="productsStore.products"
      :search-text="searchText"
      :filter-brand="filterBrand"
      :filter-supplier="filterSupplier"
      :filter-category="filterCategory"
    />

    <div v-if="selectedProducts.length > 0" class="q-mt-md">
      <div class="text-subtitle1 q-mb-sm">
        {{ t("operations.quantity") }}
      </div>

      <q-list bordered separator class="rounded-borders">
        <q-item v-for="product in selectedProducts" :key="product.uuid">
          <q-item-section>
            <q-item-label>{{ product.name }}</q-item-label>
            <q-item-label caption> {{ product.code }} — Stock: {{ product.stock }} </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-input
              v-model.number="quantities[product.uuid]"
              type="number"
              dense
              outlined
              style="width: 120px"
              :min="0"
              :label="t('operations.quantity')"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="row justify-end q-mt-md">
      <q-btn
        color="primary"
        :label="t('operations.execute')"
        :disable="!canSubmit"
        @click="submit"
      />
    </div>
  </div>
</template>
