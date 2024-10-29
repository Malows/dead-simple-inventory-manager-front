<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import { useSuppliersStore } from '../../stores/suppliers'

const name = ref('')
const address = ref('')
const phone = ref('')
const email = ref('')
const web = ref('')

const store = useSuppliersStore()
const quasar = useQuasar()
const router = useRouter()

const createSupplier = () => {
  quasar.loading.show()
  store
    .createSupplier({
      name: name.value,
      address: address.value,
      phone: phone.value,
      email: email.value,
      web: web.value
    })
    .then(() => {
      quasar.notify('Proveedor creado')
      return router.push({ name: 'suppliers index' })
    })
    .catch(console.error)
    .finally(() => quasar.loading.hide())
}
</script>

<template>
<q-page padding>
  <h4>Crear proveedor</h4>

  <div class="q-gutter-md">
    <q-input v-model="name" label="Nombre" lazy-rule :rules="[val => val?.length > 0 || 'Campo requerido']" />
    <q-input v-model="address" label="Direccion" />
    <q-input v-model="phone" label="Telefono" />
    <q-input v-model="email" label="Email" />
    <q-input v-model="web" label="Web" />

    <q-btn color="primary" @click="createSupplier">Crear</q-btn>
  </div>
  </q-page>
</template>
