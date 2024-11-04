<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useProductsStore } from '../../stores/products'
import { Product } from '../../types/product.interfaces'

const props = defineProps<{ product: Product }>()
const show = defineModel({ type: Boolean, default: false })
const { t } = useI18n()

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
    .then(({ isOk }) => {
      const color = isOk ? 'positive' : 'negative'
      const message = isOk ? t('products.deleted') : t('products.error_deleting')
      quasar.notify({ color, message })

      if (isOk) {
        router.push({ name: 'products index' })
      }
    })
    .catch((error) => {
      quasar.notify({
        color: 'negative',
        message: t('products.error_deleting')
      })
      console.error(error)
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
          {{ t('common.confirm') }}
        </div>
      </q-card-section>

      <q-card-section class="row items-center">
        <div class="text-body1">
          {{ t('products.confirm_delete', { name: product.name, code: product.code }) }}
        </div>
      </q-card-section>

      <q-card-section class="row items-center q-pb-none">
        <q-separator />
      </q-card-section>

      <q-card-actions class="q-mt-sm" align="right">
        <q-btn
          v-close-popup
          flat
          :label="t('common.delete')"
          color="red"
          @click="destroy"
        />
        <q-btn
          v-close-popup
          flat
          :label="t('common.cancel')"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
