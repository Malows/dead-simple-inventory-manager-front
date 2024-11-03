<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useCategoriesStore } from '../../stores/categories'

const name = ref('')
const categoriesStore = useCategoriesStore()
const quasar = useQuasar()
const router = useRouter()
const { t } = useI18n()

const submit = () => {
  if (!name.value) return

  categoriesStore
    .createCategory({ name: name.value })
    .then(() => {
      quasar.notify({
        color: 'positive',
        message: t('categories.created')
      })
      return router.push({ name: 'categories index' })
    })
    .catch(console.error)
}
</script>

<template>
  <q-page padding>
    <h4>{{ t("categories.create") }}</h4>

    <div class="q-gutter-md">
      <q-input
        v-model="name"
        :label="t('common.name')"
        lazy-rule
        :rules="[(val) => val?.length > 0 || t('common.required_field')]"
      />

      <q-btn
        color="primary"
        label="Crear"
        :loading="categoriesStore.categoriesRequest.fetching"
        @click="submit"
      />
    </div>
  </q-page>
</template>
