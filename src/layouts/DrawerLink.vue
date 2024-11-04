<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { Link } from '../types'

defineProps<{ link: Link }>()

const { t } = useI18n()
</script>

<template>
  <q-item clickable :to="link.to">
    <q-item-section avatar>
      <q-icon v-if="link.icon" :name="link.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ t(link.label) }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
