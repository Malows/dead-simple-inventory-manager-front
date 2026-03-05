<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useBrandsStore } from '../../stores/brands'
import { Brand } from '../../types/brand.interfaces'
import { useNotify } from '../../composition/useNotify'

import NameOnlyForm from '../../components/forms/NameOnlyForm.vue'

const route = useRoute()
const brandsStore = useBrandsStore()
const { t } = useI18n()
const { errorNotify, goodNotify } = useNotify()

const name = ref('')

const uuid = computed(() =>
  Array.isArray(route.params.brandId) ? route.params.brandId[0] : route.params.brandId
)

const brand = computed(() => brandsStore.brands.find((brand: Brand) => brand.uuid === uuid.value))

onMounted(async () => {
  await brandsStore
    .getBrand(uuid.value)
    .catch(errorNotify('brands.error_getting', { name: 'brands index' }))

  if (brand.value) {
    name.value = brand.value.name
  }
})

const submit = () => {
  const backRoute = { name: 'brands show', params: route.params }

  brandsStore
    .updateBrand({
      ...brand.value!,
      name: name.value
    })
    .then(goodNotify('brands.updated', backRoute))
    .catch(errorNotify('brands.error_updating', backRoute))
}
</script>

<template>
  <q-page padding>
    <h4>{{ t("brands.update") }}</h4>

    <div class="q-gutter-md">
      <name-only-form v-model:name="name" />

      <q-btn
        color="primary"
        :label="t('common.update')"
        :loading="brandsStore.brandsRequest.fetching"
        @click="submit"
      />
    </div>
  </q-page>
</template>
