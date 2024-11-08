<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useCategoriesStore } from '../../stores/categories'
import { useErrorRequest } from '../../composition/useRequests'

import PageWithAdd from '../../components/pages/PageWithAdd.vue'
import FilterableList from '../../components/filterable/FilterableList.vue'
import CategoryItem from '../../components/listItems/CategoryItem.vue'

const categoriesStore = useCategoriesStore()
const quasar = useQuasar()
const { t } = useI18n()
const { errorNotify } = useErrorRequest()

onMounted(() => {
  quasar.loading.show()
  categoriesStore
    .getCategories()
    .catch(errorNotify('categories.error_fetching'))
    .finally(() => quasar.loading.hide())
})
</script>

<template>
  <page-with-add
    :title="t('categories.Categories')"
    :to="{ name: 'categories create' }"
  >
    <filterable-list
      :items="categoriesStore.categories"
      :items-per-page="50"
    >
      <template #default="{ item }">
        <category-item :category="item" />
      </template>
    </filterable-list>
  </page-with-add>
</template>
