<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCategoriesStore } from '../../stores/categories'
import { useNotify } from '../../composition/useNotify'

import NameOnlyForm from '../../components/forms/NameOnlyForm.vue'

const categoriesStore = useCategoriesStore()
const { t } = useI18n()
const { errorNotify, goodNotify } = useNotify()

const name = ref('')

const submit = () => {
  if (!name.value) return

  categoriesStore
    .createCategory({ name: name.value })
    .then(goodNotify('categories.created', { name: 'categories index' }))
    .catch(errorNotify('categories.error_creating'))
}
</script>

<template>
  <q-page padding>
    <h4>{{ t("categories.create") }}</h4>

    <div class="q-gutter-md">
      <name-only-form v-model:name="name" />

      <q-btn
        color="primary"
        :label="t('common.create')"
        :loading="categoriesStore.categoriesRequest.fetching"
        @click="submit"
      />
    </div>
  </q-page>
</template>
