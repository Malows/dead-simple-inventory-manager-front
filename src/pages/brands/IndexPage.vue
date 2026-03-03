<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useBrandsStore } from '../../stores/brands'
import { useNotify } from '../../composition/useNotify'

import PageWithAdd from '../../components/pages/PageWithAdd.vue'
import FilterableList from '../../components/filterable/FilterableList.vue'
import BrandItem from '../../components/listItems/BrandItem.vue'

const brandsStore = useBrandsStore()
const quasar = useQuasar()
const { t } = useI18n()
const { errorNotify } = useNotify()

onMounted(() => {
  quasar.loading.show()
  brandsStore
    .getBrands()
    .catch(errorNotify('brands.error_fetching'))
    .finally(() => quasar.loading.hide())
})
</script>

<template>
  <page-with-add :title="t('brands.Brands')" :to="{ name: 'brands create' }">
    <filterable-list :items="brandsStore.brands" :items-per-page="50">
      <template #default="{ item }">
        <brand-item :brand="item" />
      </template>
    </filterable-list>
  </page-with-add>
</template>
