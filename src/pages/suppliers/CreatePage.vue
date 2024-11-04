<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useSuppliersStore } from '../../stores/suppliers'

import SupplierForm from '../../components/forms/SupplierForm.vue'

const suppliersStore = useSuppliersStore()
const quasar = useQuasar()
const router = useRouter()
const { t } = useI18n()

const name = ref('')
const address = ref('')
const phone = ref('')
const email = ref('')
const web = ref('')

const createSupplier = () => {
  quasar.loading.show()
  suppliersStore
    .createSupplier({
      name: name.value,
      address: address.value,
      phone: phone.value,
      email: email.value,
      web: web.value
    })
    .then(() => {
      quasar.notify({
        color: 'positive',
        message: t('suppliers.created')
      })
      return router.push({ name: 'suppliers index' })
    })
    .catch((error) => {
      quasar.notify({
        color: 'negative',
        message: t('suppliers.error_creating')
      })
      console.error(error)
    })
    .finally(() => quasar.loading.hide())
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
