<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'

import { useProductsStore } from '../../stores/products'
import { Product } from '../../types'

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
      stock: props.product.stock - stock.value
    })
    .then(() => {
      quasar.notify('Stock reducido')
    })
    .catch(() => {
      quasar.notify({
        message: 'Error al restar stock',
        type: 'negative'
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
        <div class="text-h6 q-mb-sm">Restar unidades de stock</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model.number="stock"
          type="number"
          label="Stock"
          :hint="`Stock disponible ${product.stock}`"
          :error="stockCheck"
          error-message="No existe suficiente stock"
          bottom-slots
        />
      </q-card-section>

      <q-card-section class="row items-center q-pb-none">
        <q-separator />
      </q-card-section>

      <q-card-actions class="q-mt-sm" align="right">
        <q-btn
          v-close-popup
          flat
          label="Cancelar"
          color="primary"
        />
        <q-btn
          v-close-popup
          flat
          label="Restar"
          color="primary"
          @click="reduce"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
