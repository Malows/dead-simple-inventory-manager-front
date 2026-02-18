<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useBrandsStore } from '../../stores/brands'
import { useNotify } from '../../composition/useNotify'

import BrandForm from '../../components/forms/BrandForm.vue'

const brandsStore = useBrandsStore()
const { t } = useI18n()
const { errorNotify, goodNotify } = useNotify()

const name = ref('')

const createBrand = () => {
  brandsStore
    .createBrand({ name: name.value })
    .then(goodNotify('brands.created', { name: 'brands index' }))
    .catch(errorNotify('brands.error_creating'))
}
</script>

<template>
  <q-page padding>
    <h4>{{ t("brands.create") }}</h4>

    <div class="q-gutter-md">
      <brand-form v-model:name="name" />

      <q-btn
        color="primary"
        :label="t('common.create')"
        :loading="brandsStore.brandsRequest.fetching"
        @click="createBrand"
      />
    </div>
  </q-page>
</template>
