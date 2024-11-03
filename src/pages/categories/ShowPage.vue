<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useCategoriesStore } from '../../stores/categories'
import { Category } from '../../types/category.interfaces'

import PageWithActions from '../../components/pages/PageWithActions.vue'
import InlineData from '../../components/InlineData.vue'
import CategoryDeleteDialog from '../../components/dialogs/CategoryDeleteDialog.vue'

const route = useRoute()
const quasar = useQuasar()
const categoriesStore = useCategoriesStore()
const { t } = useI18n()

const showDeleteDialog = ref(false)

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

const editRoute = computed(() => ({
  name: 'categories edit',
  params: route.params
}))

onMounted(async () => {
  quasar.loading.show()
  await categoriesStore
    .getCategory(uuid.value)
    .finally(() => quasar.loading.hide())
})
</script>

<template>
  <page-with-actions v-if="category" :title="t('categories.show')">
    <template #actions>
      <q-btn round color="primary" size="md" icon="edit" :to="editRoute" />
      <q-btn
        round
        color="negative"
        size="md"
        icon="delete"
        @click="showDeleteDialog = true"
      />
    </template>

    <inline-data :label="t('common.name')">{{ category.name }}</inline-data>

    <category-delete-dialog v-model="showDeleteDialog" :category />
  </page-with-actions>
</template>
