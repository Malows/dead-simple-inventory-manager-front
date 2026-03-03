<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useCategoriesStore } from '../../stores/categories'
import { Category } from '../../types/category.interfaces'

const categoriesStore = useCategoriesStore()
const router = useRouter()
const quasar = useQuasar()
const { t } = useI18n()

const props = defineProps<{ category: Category | null }>()

const show = defineModel({ type: Boolean, default: false })

const destroy = () => {
  if (!props.category) {
    console.error('Category is not valid', props.category)
    return
  }

  quasar.loading.show()
  categoriesStore
    .deleteCategory(props.category)
    .then(({ isOk }) => {
      const color = isOk ? 'positive' : 'negative'
      const message = isOk ? t('categories.deleted') : t('categories.error_deleting')
      quasar.notify({ color, message })

      if (isOk) {
        router.push({ name: 'categories index' })
      }
    })
    .catch((error) => {
      quasar.notify({
        color: 'negative',
        message: t('categories.error_deleting')
      })
      console.error(error)
    })
    .finally(() => {
      quasar.loading.hide()
    })
}
</script>

<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-sm">
          {{ t("common.confirm") }}
        </div>
      </q-card-section>

      <q-card-section class="row items-center">
        <div class="text-body1">
          {{ t("categories.confirm_delete", { name: category?.name }) }}
        </div>
      </q-card-section>

      <q-card-section class="row items-center q-pb-none">
        <q-separator />
      </q-card-section>

      <q-card-actions class="q-mt-sm" align="right">
        <q-btn v-close-popup flat color="red" :label="t('common.delete')" @click="destroy" />
        <q-btn v-close-popup flat color="primary" :label="t('common.cancel')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
