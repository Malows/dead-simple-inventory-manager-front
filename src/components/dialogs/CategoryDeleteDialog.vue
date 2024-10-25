<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

import { useCategoriesStore } from '../../stores/categories'
import { CategoryWithProducts } from '../../types'

const categoriesStore = useCategoriesStore()
const router = useRouter()
const quasar = useQuasar()

const props = defineProps<{ category: CategoryWithProducts | null }>()

const show = defineModel({ type: Boolean, default: false })

const destroy = () => {
  if (!props.category) {
    console.error('Category is not valid', props.category)
    return
  }

  quasar.loading.show()
  categoriesStore
    .deleteCategory(props.category)
    .then(() => {
      quasar.notify('Categoría eliminada')
      router.push({ name: 'categories index' })
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
        <div class="text-body1">
          Esta seguro de que desea eliminar la categoría {{ category?.name }}?
        </div>
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
