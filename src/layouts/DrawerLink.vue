<script setup lang="ts">
import { Link } from '../types'

defineProps<{ link: Link }>()
</script>

<template>
  <q-item clickable :to="link.to">
    <q-item-section avatar>
      <q-icon v-if="link.icon" :name="link.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ link.label }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
