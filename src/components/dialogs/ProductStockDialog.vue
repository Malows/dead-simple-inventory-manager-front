<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useProductsStore } from '../../stores/products'
import { Product } from '../../types/product.interfaces'

const { t } = useI18n()
const props = defineProps<{ product: Product }>()
const show = defineModel({ type: Boolean, default: false })

const productsStore = useProductsStore()
const quasar = useQuasar()

const stock = ref(0)

const stockCheck = computed(() => props.product.stock - stock.value < 0)

const reduce = () => {
  if (stockCheck.value) {
    return
  }

  quasar.loading.show()

  productsStore
    .updateProduct({
      ...props.product,
      categories: props.product.categories.map((category) => category.id),
      stock: props.product.stock - stock.value
    })
    .then(({ isOk }) => {
      const color = isOk ? 'positive' : 'negative'
      const message = isOk ? t('products.stock_reduced') : t('products.error_reducing_stock')
      quasar.notify({ color, message })
    })
    .catch((error) => {
      console.error(error)
      quasar.notify({
        color: 'negative',
        message: t('products.error_reducing_stock')
      })
    })
    .finally(() => {
      quasar.loading.hide()
    })
}
</script>

<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-sm">
          {{ t("products.reduce_stock") }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model.number="stock"
          type="number"
          :label="t('products.stock')"
          :hint="t('products.available_stock', { stock: product.stock })"
          :error="stockCheck"
          :error-message="t('products.insufficient_stock')"
          bottom-slots
        />
      </q-card-section>

      <q-card-section class="row items-center q-pb-none">
        <q-separator />
      </q-card-section>

      <q-card-actions class="q-mt-sm" align="right">
        <q-btn v-close-popup flat :label="t('common.cancel')" color="primary" />
        <q-btn v-close-popup flat :label="t('products.reduce')" color="primary" @click="reduce" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
