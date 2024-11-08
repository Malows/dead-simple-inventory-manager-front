<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSuppliersStore } from '../../stores/suppliers'
import { useNotify } from '../../composition/useNotify'

import SupplierForm from '../../components/forms/SupplierForm.vue'

const suppliersStore = useSuppliersStore()
const { t } = useI18n()
const { errorNotify, goodNotify } = useNotify()

const name = ref('')
const address = ref('')
const phone = ref('')
const email = ref('')
const web = ref('')

const createSupplier = () => {
  suppliersStore
    .createSupplier({
      name: name.value,
      address: address.value,
      phone: phone.value,
      email: email.value,
      web: web.value
    })
    .then(goodNotify('suppliers.created', { name: 'suppliers index' }))
    .catch(errorNotify('suppliers.error_creating'))
}
</script>

<template>
  <q-page padding>
    <h4>{{ t("suppliers.create") }}</h4>

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
        :label="t('common.create')"
        :loading="suppliersStore.suppliersRequest.fetching"
        @click="createSupplier"
      />
    </div>
  </q-page>
</template>
