<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useBrandsStore } from '../../stores/brands'
import { Brand } from '../../types/brand.interfaces'
import { useNotify } from '../../composition/useNotify'

import PageWithActions from '../../components/pages/PageWithActions.vue'
import InlineData from '../../components/InlineData.vue'
import ProductList from '../../components/ProductList.vue'
import BrandDeleteDialog from '../../components/dialogs/BrandDeleteDialog.vue'

const brandsStore = useBrandsStore()
const route = useRoute()
const quasar = useQuasar()
const { t } = useI18n()
const { errorNotify } = useNotify()

const showDeleteDialog = ref(false)

const uuid = computed(() =>
  Array.isArray(route.params.brandId) ? route.params.brandId[0] : route.params.brandId
)
const brand = computed(() => brandsStore.brands.find((brand: Brand) => brand.uuid === uuid.value))

const editRoute = computed(() => ({
  name: 'brands edit',
  params: route.params
}))

onMounted(() => {
  quasar.loading.show()
  brandsStore
    .getBrand(uuid.value)
    .catch(errorNotify('brands.error_getting', { name: 'brands index' }))
    .finally(() => quasar.loading.hide())
})
</script>

<template>
  <page-with-actions v-if="brand" :title="t('brands.show')">
    <template #actions>
      <q-btn round color="primary" size="md" icon="edit" :to="editRoute" />
      <q-btn round color="negative" size="md" icon="delete" @click="showDeleteDialog = true" />
    </template>

    <inline-data :label="t('common.name')">
      {{ brand.name }}
    </inline-data>

    <q-separator class="q-mt-lg" />

    <h5>{{ t("products.Products") }}</h5>
    <product-list :products="brand.products" />

    <brand-delete-dialog v-model="showDeleteDialog" :brand />
  </page-with-actions>
</template>
