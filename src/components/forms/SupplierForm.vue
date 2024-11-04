<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const name = defineModel<string>('name', { default: '' })
const address = defineModel<string>('address', { default: '' })
const phone = defineModel<string>('phone', { default: '' })
const email = defineModel<string>('email', { default: '' })
const web = defineModel<string>('web', { default: '' })
</script>

<template>
  <q-input
    v-model="name"
    :label="t('common.name')"
    lazy-rule
    :rules="[(val) => val?.length > 0 || t('common.required_field')]"
  />
  <q-input
    v-model="address"
    :label="t('suppliers.Address')"
  />
  <q-input
    v-model="phone"
    :label="t('suppliers.Phone')"
  />
  <q-input
    v-model="email"
    :label="t('suppliers.Email')"
  />
  <q-input
    v-model="web"
    :label="t('suppliers.Web')"
  />
</template>
