<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useSuppliersStore } from '../../stores/suppliers'
import { Supplier } from '../../types/supplier.interfaces'
import { useNotify } from '../../composition/useNotify'

import SupplierForm from '../../components/forms/SupplierForm.vue'

const route = useRoute()
const suppliersStore = useSuppliersStore()
const { t } = useI18n()
const { errorNotify, goodNotify } = useNotify()

const name = ref('')
const address = ref('')
const phone = ref('')
const email = ref('')
const web = ref('')

const uuid = computed(() =>
  Array.isArray(route.params.supplierId) ? route.params.supplierId[0] : route.params.supplierId
)

const supplier = computed(() =>
  suppliersStore.suppliers.find((supplier: Supplier) => supplier.uuid === uuid.value)
)

onMounted(async () => {
  await suppliersStore
    .getSupplier(uuid.value)
    .catch(errorNotify('suppliers.error_getting', { name: 'suppliers index' }))

  if (supplier.value) {
    name.value = supplier.value.name
    address.value = supplier.value.address ?? ''
    phone.value = supplier.value.phone ?? ''
    email.value = supplier.value.email ?? ''
    web.value = supplier.value.web ?? ''
  }
})

const submit = () => {
  const backRoute = { name: 'suppliers show', params: route.params }

  suppliersStore
    .updateSupplier({
      ...supplier.value!,
      name: name.value,
      address: address.value,
      phone: phone.value,
      email: email.value,
      web: web.value
    })
    .then(goodNotify('suppliers.updated', backRoute))
    .catch(errorNotify('suppliers.error_updating', backRoute))
}
</script>

<template>
  <q-page padding>
    <h4>{{ t("suppliers.update") }}</h4>

    <div class="q-gutter-md">
      <supplier-form
        v-model:name="name"
        v-model:address="address"
        v-model:phone="phone"
        v-model:email="email"
        v-model:web="web"
      />

      <q-btn
        color="primary"
        :label="t('common.update')"
        :loading="suppliersStore.suppliersRequest.fetching"
        @click="submit"
      />
    </div>
  </q-page>
</template>
