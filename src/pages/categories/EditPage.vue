<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useCategoriesStore } from '../../stores/categories'
import { Category } from '../../types/category.interfaces'
import { useNotify } from '../../composition/useNotify'

import CategoryForm from '../../components/forms/CategoryForm.vue'

const categoriesStore = useCategoriesStore()
const route = useRoute()
const { t } = useI18n()
const { errorNotify, goodNotify } = useNotify()

const name = ref('')

const uuid = computed(() =>
  Array.isArray(route.params.categoryId) ? route.params.categoryId[0] : route.params.categoryId
)
const category = computed(() =>
  categoriesStore.categories.find((category: Category) => category.uuid === uuid.value)
)

onMounted(async () => {
  await categoriesStore
    .getCategory(uuid.value)
    .catch(errorNotify('categories.error_getting', { name: 'categories index' }))

  if (category.value) {
    name.value = category.value.name
  }
})

const submit = () => {
  const backRoute = { name: 'categories show', params: route.params }

  categoriesStore
    .updateCategory({ ...category.value!, name: name.value })
    .then(goodNotify('categories.updated', backRoute))
    .catch(errorNotify('categories.error_updating', backRoute))
}
</script>

<template>
  <q-page padding>
    <h4>{{ t("categories.update") }}</h4>

    <div class="q-gutter-md">
      <category-form v-model:name="name" />

      <q-btn
        color="primary"
        :label="t('common.update')"
        :loading="categoriesStore.categoriesRequest.fetching"
        @click="submit"
      />
    </div>
  </q-page>
</template>
