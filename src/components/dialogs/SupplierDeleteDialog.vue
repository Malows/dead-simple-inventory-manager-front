<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useSuppliersStore } from '../../stores/suppliers'
import { Supplier } from '../../types/supplier.interfaces'

const props = defineProps<{ supplier: Supplier }>()
const show = defineModel<boolean>()

const suppliersStore = useSuppliersStore()
const router = useRouter()
const quasar = useQuasar()
const { t } = useI18n()

const destroy = () => {
  if (!props.supplier) {
    console.error('Supplier is not valid', props.supplier)
    return
  }

  quasar.loading.show()
  suppliersStore
    .deleteSupplier(props.supplier)
    .then(({ isOk }) => {
      const color = isOk ? 'positive' : 'negative'
      const message = isOk ? t('suppliers.deleted') : t('suppliers.delete_failed')
      quasar.notify({ color, message })

      if (isOk) {
        router.push({ name: 'suppliers index' })
      }
    })
    .catch((error) => {
      console.error(error)
      quasar.notify({
        color: 'negative',
        message: t('suppliers.delete_error')
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
          {{ t('common.confirm') }}
        </div>
      </q-card-section>

      <q-card-section class="row items-center">
        <div class="text-body1">
          {{ t('suppliers.confirm_delete', { name: supplier?.name }) }}
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
