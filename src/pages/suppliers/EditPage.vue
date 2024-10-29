<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

import { useSuppliersStore } from '../../stores/suppliers'
import { Supplier } from '../../types/supplier.interfaces'

const route = useRoute()
const router = useRouter()
const quasar = useQuasar()
const suppliersStore = useSuppliersStore()

const name = ref('')
const address = ref('')
const phone = ref('')
const email = ref('')
const web = ref('')

const uuid = computed(() => Array.isArray(route.params.supplierId) ? route.params.supplierId[0] : route.params.supplierId)

const supplier = computed(() => suppliersStore.suppliers.find((supplier: Supplier) => supplier.uuid === uuid.value))

onMounted(async () => {
  await suppliersStore.getSupplier(uuid.value)

  if (supplier.value) {
    name.value = supplier.value.name
    address.value = supplier.value.address ?? ''
    phone.value = supplier.value.phone ?? ''
    email.value = supplier.value.email ?? ''
    web.value = supplier.value.web ?? ''
  }
})

const submit = () => {
  suppliersStore.updateSupplier({
    ...supplier.value!,
    name: name.value,
    address: address.value,
    phone: phone.value,
    email: email.value,
    web: web.value
  })
    .then(() => {
      quasar.notify('Proveedor editado')
      return router.push({
        name: 'suppliers show',
        params: route.params
      })
    })
    .catch(console.error)
}
</script>

<template>
  <q-page padding>
    <h4>Editar proveedor</h4>

    <div class="q-gutter-md">
      <q-input v-model="name" label="Nombre" lazy-rule :rules="[val => val?.length > 0 || 'Campo requerido']" />
      <q-input v-model="address" label="Direccion" />
      <q-input v-model="phone" label="Telefono" />
      <q-input v-model="email" label="Email" />
      <q-input v-model="web" label="Web" />

      <q-btn color="primary" @click="submit">Editar</q-btn>
    </div>
  </q-page>
</template>
