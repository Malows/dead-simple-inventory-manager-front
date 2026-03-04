<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const name = defineModel<string>('name', { default: '' })
</script>

<template>
  <q-input
    v-model="name"
    :label="t('common.name')"
    lazy-rule
    :rules="[(val) => val?.length > 0 || t('common.required_field')]"
  />
</template>
