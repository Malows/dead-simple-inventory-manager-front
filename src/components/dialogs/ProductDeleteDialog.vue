<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

import { useProductsStore } from '../../stores/products'
import { Product } from '../../store/store-flag'

const props = defineProps<{ product: Product }>()
const show = defineModel({ type: Boolean, default: false })

const productsStore = useProductsStore()
const router = useRouter()
const quasar = useQuasar()

const destroy = () => {
  if (!props.product) {
    console.error('Product is not valid', props.product)
    return
  }

  quasar.loading.show()
  productsStore
    .deleteProduct(props.product)
    .then(() => {
      quasar.notify('Producto eliminado')
      router.push({ name: 'products index' })
    })
    .catch(console.error)
    .finally(() => {
      quasar.loading.hide()
    })
}
</script>

<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-sm">Confirmar</div>
      </q-card-section>

      <q-card-section class="row items-center">
        <div class="text-body1">Esta seguro de que desea eliminar el product {{ product.name }} ({{ product.code }})?
        </div>
      </q-card-section>

      <q-card-section class="row items-center q-pb-none">
        <q-separator />
      </q-card-section>

      <q-card-actions class="q-mt-sm" align="right">
        <q-btn v-close-popup flat label="Eliminar" color="red" @click="destroy" />
        <q-btn v-close-popup flat label="Cancelar" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
