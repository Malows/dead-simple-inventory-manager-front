<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useCategoriesStore } from '../../stores/categories'
import { Category } from '../../types/category.interfaces'

const name = ref('')

const quasar = useQuasar()
const router = useRouter()
const route = useRoute()
const categoriesStore = useCategoriesStore()
const { t } = useI18n()

const uuid = computed(() =>
  Array.isArray(route.params.categoryId)
    ? route.params.categoryId[0]
    : route.params.categoryId
)
const category = computed(() =>
  categoriesStore.categories.find(
    (category: Category) => category.uuid === uuid.value
  )
)

onMounted(async () => {
  quasar.loading.show()
  await categoriesStore
    .getCategory(uuid.value)
    .catch(console.error)
    .finally(() => quasar.loading.hide())

  if (category.value) {
    name.value = category.value.name
  }
})

const submit = () => {
  categoriesStore
    .updateCategory({ ...category.value!, name: name.value })
    .then(({ isOk, error }) => {
      if (!isOk) throw error

      quasar.notify({
        color: 'positive',
        message: t('categories.updated')
      })
      router.push({
        name: 'categories show',
        params: route.params
      })
    })
    .catch((error) => {
      quasar.notify({
        color: 'negative',
        message: t('categories.error_updating')
      })
      console.error(error)
    })
}
</script>

<template>
  <q-page padding>
    <h4>{{ t("categories.update") }}</h4>

    <div class="q-gutter-md">
      <q-input
        v-model="name"
        :label="t('common.name')"
        lazy-rule
        :rules="[(val) => val?.length > 0 || t('common.required_field')]"
      />

      <q-btn
        color="primary"
        :label="t('common.update')"
        :loading="categoriesStore.categoriesRequest.fetching"
        @click="submit"
      />
    </div>
  </q-page>
</template>
