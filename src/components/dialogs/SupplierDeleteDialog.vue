<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

import { useSuppliersStore } from '../../stores/suppliers'
import { Supplier } from '../../types/supplier.interfaces'

const props = defineProps<{ supplier: Supplier }>()
const show = defineModel<boolean>()

const suppliersStore = useSuppliersStore()
const router = useRouter()
const quasar = useQuasar()

const destroy = () => {
  if (!props.supplier) {
    console.error('Supplier is not valid', props.supplier)
    return
  }

  quasar.loading.show()
  suppliersStore
    .deleteSupplier(props.supplier)
    .then(() => {
      quasar.notify('Proveedor eliminado')
      router.push({ name: 'suppliers index' })
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
        <div class="text-body1">Esta seguro de que desea eliminar el proveedor {{ supplier?.name }}?</div>
      </q-card-section>

      <q-card-section class="row items-center q-pb-none">
        <q-separator />
      </q-card-section>

      <q-card-actions class="q-mt-sm" align="right">
        <q-btn
          v-close-popup
          flat
          label="Eliminar"
          color="red"
          @click="destroy"
        />
        <q-btn
          v-close-popup
          flat
          label="Cancelar"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
