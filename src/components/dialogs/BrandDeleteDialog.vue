<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useBrandsStore } from '../../stores/brands'
import { Brand } from '../../types/brand.interfaces'

const brandsStore = useBrandsStore()
const router = useRouter()
const quasar = useQuasar()
const { t } = useI18n()

const props = defineProps<{ brand: Brand | null }>()

const show = defineModel({ type: Boolean, default: false })

const destroy = () => {
  if (!props.brand) {
    console.error('Brand is not valid', props.brand)
    return
  }

  quasar.loading.show()
  brandsStore
    .deleteBrand(props.brand)
    .then(({ isOk }) => {
      const color = isOk ? 'positive' : 'negative'
      const message = isOk ? t('brands.deleted') : t('brands.error_deleting')
      quasar.notify({ color, message })

      if (isOk) {
        router.push({ name: 'brands index' })
      }
    })
    .catch((error) => {
      quasar.notify({
        color: 'negative',
        message: t('brands.error_deleting')
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
          {{ t("common.confirm") }}
        </div>
      </q-card-section>

      <q-card-section class="row items-center">
        <div class="text-body1">
          {{ t("brands.confirm_delete", { name: brand?.name }) }}
        </div>
      </q-card-section>

      <q-card-section class="row items-center q-pb-none">
        <q-separator />
      </q-card-section>

      <q-card-actions class="q-mt-sm" align="right">
        <q-btn v-close-popup flat color="red" :label="t('common.delete')" @click="destroy" />
        <q-btn v-close-popup flat color="primary" :label="t('common.cancel')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
