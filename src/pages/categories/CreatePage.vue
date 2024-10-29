<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import { useCategoriesStore } from '../../stores/categories'

const name = ref('')
const categoriesStore = useCategoriesStore()
const quasar = useQuasar()
const router = useRouter()

const submit = () => {
  categoriesStore.createCategory({ name: name.value })
    .then(() => {
      quasar.notify('Categoría creada')
      return router.push({ name: 'categories index' })
    })
    .catch(console.error)
}
</script>

<template>
  <q-page padding>
    <h4>Crear categoría</h4>

    <div class="q-gutter-md">
      <q-input v-model="name" label="Nombre" lazy-rule :rules="[val => val?.length > 0 || 'Campo requerido']" />

      <q-btn color="primary" @click="submit">Crear</q-btn>
    </div>
  </q-page>
</template>
