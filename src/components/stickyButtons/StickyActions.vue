<script setup lang="ts">
import { useStickyButton } from 'src/composition/components/stickyButtons'

withDefaults(defineProps<{ color?: string }>(), { color: 'accent' })

const { position, offset, direction, icon } = useStickyButton()
</script>

<template>
  <q-page-sticky :position :offset>
    <q-fab :icon :direction :color>
      <slot></slot>
    </q-fab>
  </q-page-sticky>
  </template>
